import * as Stackbit from '@stackbit/sdk'
import { validateAndNormalizeConfig } from '@stackbit/sdk/dist/config/config-loader.js'
import type * as core from '@wesjet/core'
import type * as SourceFiles from '@wesjet/maker'
import { defineDocumentType, defineNestedType } from '@wesjet/maker'
import type { PartialDeep } from '@wesjet/utils'
import { mergeDeep, not, partition, pick } from '@wesjet/utils'

import type { SharedCtx } from './mapping.js'
import { stackbitDocumentLikeModelToDocumentType, stackbitObjectModelToDocumentType } from './mapping.js'

/** NOTE Overrides are currently not validated - use carefully */
export type WesjetOverrideArgs<TDocumentTypeNames extends string> = {
  documentTypes?: Partial<{
    [TDocumentTypeName in TDocumentTypeNames]: WesjetOverrideDocumentType<TDocumentTypeName>
  }>
  nestedTypes?: Partial<{
    [TDocumentTypeName in TDocumentTypeNames]: WesjetOverrideNestedType
  }>
}

export type WesjetOverrideDocumentType<TDocumentTypeName extends string> = {
  filePathPattern?: string
  fields?: { [fieldName: string]: { type: SourceFiles.FieldDefType } }
  computedFields?: SourceFiles.ComputedFields<TDocumentTypeName>
}

export type WesjetOverrideNestedType = {
  fields?: { [fieldName: string]: { type: SourceFiles.FieldDefType } }
}

/**
 * @example
 * ```ts
 * // wesjet.config.ts
 * import { makeSource } from 'wesjet/maker'
 * import { loadStackbitConfigAsDocumentTypes } from '@wesjet/isdev'
 *
 * // Looks for `stackbit.yaml` in the current directory
 * export default loadStackbitConfigAsDocumentTypes().then((documentTypes) => {
 *   return makeSource({ contentDirPath: 'content', documentTypes })
 * })
 * ```
 */
export const loadStackbitConfigAsDocumentTypes = <TDocumentTypeNames extends core.GetDocumentTypeNamesGen>(
  options: Stackbit.ConfigLoaderOptions = { dirPath: '' },
  overrideArgs: WesjetOverrideArgs<TDocumentTypeNames> = { documentTypes: {}, nestedTypes: {} },
): Promise<SourceFiles.DocumentType[]> =>
  Stackbit.loadConfig(options).then((configResult) => {
    if (configResult.errors.length > 0) {
      throw new Error(configResult.errors.join('\n'))
    }

    return stackbitConfigToDocumentTypes(configResult.config!, overrideArgs)
  })

/**
 *
 * @example
 * ```ts
 * // wesjet.config.ts
 * import { makeSource } from 'wesjet/maker'
 * import { stackbitConfigToDocumentTypes } from '@wesjet/isdev'
 * import stackbitConfig from './stackbit.config.js'
 *
 * const documentTypes = stackbitConfigToDocumentTypes(stackbitConfig)
 *
 * export default makeSource({ contentDirPath: 'content', documentTypes })
 * ```
 */
export const stackbitConfigToDocumentTypes = <TDocumentTypeNames extends core.GetDocumentTypeNamesGen>(
  stackbitConfig: Stackbit.Config | Stackbit.YamlConfig,
  overrideArgs: WesjetOverrideArgs<TDocumentTypeNames> = { documentTypes: {}, nestedTypes: {} },
): SourceFiles.DocumentType[] => {
  const validatedStackbitConfig = validateStackbitConfig(stackbitConfig)

  // NOTE File-based content sources don't have image models
  const models = validatedStackbitConfig.models.filter(not(isImageModel))

  const [documentLikeModels, objectModels] = partition(models, isDocumentLikeModel)

  const ctx: SharedCtx = { documentTypeMap: {}, nestedTypeMap: {} }

  const documentTypes = documentLikeModels.map(stackbitDocumentLikeModelToDocumentType(ctx))

  objectModels.forEach((model) => {
    const nestedType = stackbitObjectModelToDocumentType(ctx)(model)
    ctx.nestedTypeMap[model.name] = nestedType

    const nestedOverride = (overrideArgs.nestedTypes as any)?.[model.name] as WesjetOverrideNestedType | undefined
    const fields = nestedType.def().fields
    if (nestedOverride?.fields && fields) {
      for (const [fieldName, { type }] of Object.entries(nestedOverride.fields)) {
        const fieldDef = Array.isArray(fields)
          ? fields.find((fieldDef) => fieldDef.name === fieldName)
          : fields[fieldName]

        if (fieldDef) {
          fieldDef.type = type
        }
      }

      patchNestedType(nestedType, { fields })
    }
  })

  documentTypes.forEach((documentType) => {
    const documentTypeName = documentType.def().name
    ctx.documentTypeMap[documentTypeName] = documentType

    const documentOverride = (overrideArgs.documentTypes as any)?.[documentTypeName] as
      | WesjetOverrideDocumentType<string>
      | undefined
    if (documentOverride?.filePathPattern !== undefined || documentOverride?.computedFields !== undefined) {
      patchDocumentType(documentType, pick(documentOverride, ['filePathPattern', 'computedFields']))
    }

    const fields = documentType.def().fields
    if (documentOverride?.fields && fields) {
      for (const [fieldName, { type }] of Object.entries(documentOverride.fields)) {
        const fieldDef = Array.isArray(fields)
          ? fields.find((fieldDef) => fieldDef.name === fieldName)
          : fields[fieldName]

        if (fieldDef) {
          fieldDef.type = type
        }
      }

      patchDocumentType(documentType, { fields })
    }
  })

  return documentTypes
}

const patchDocumentType = (
  documentType: SourceFiles.DocumentType,
  patch: PartialDeep<SourceFiles.DocumentTypeDef>,
): void => {
  const previousDef = documentType.def()
  documentType.def = defineDocumentType(() => mergeDeep({ ...previousDef, ...patch })).def
}

const patchNestedType = (nestedType: SourceFiles.NestedType, patch: PartialDeep<SourceFiles.NestedTypeDef>): void => {
  const previousDef = nestedType.def()
  nestedType.def = defineNestedType(() => mergeDeep({ ...previousDef, ...patch })).def
}

const validateStackbitConfig = (stackbitConfig: Stackbit.Config | Stackbit.YamlConfig): Stackbit.Config => {
  if (Array.isArray(stackbitConfig.models)) {
    return stackbitConfig as Stackbit.Config
  }

  const stackbitConfigResult = validateAndNormalizeConfig(stackbitConfig)

  if (stackbitConfigResult.errors.length > 0) {
    throw new Error(stackbitConfigResult.errors.join('\n'))
  }

  return stackbitConfigResult.config
}

const isDocumentLikeModel = (
  model: Stackbit.Model,
): model is Stackbit.PageModel | Stackbit.DataModel | Stackbit.ConfigModel =>
  model.type === 'data' || model.type === 'page' || model.type === 'config'

const isImageModel = (model: Stackbit.Model): model is Stackbit.ImageModel => model.type === 'image'
