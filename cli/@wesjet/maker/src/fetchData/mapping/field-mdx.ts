import * as core from '@wesjet/core'
import type { AbsolutePosixFilePath } from '@wesjet/utils'
import * as utils from '@wesjet/utils'
import type { OT } from '@wesjet/utils/effect'
import { T } from '@wesjet/utils/effect'

import type { HasDocumentContext } from '../DocumentContext.js'
import { getFromDocumentContext } from '../DocumentContext.js'

export const makeMdxField = ({
  mdxString,
  fieldDef,
  options,
  contentDirPath,
}: {
  mdxString: string
  fieldDef: core.FieldDef
  options: core.PluginOptions
  contentDirPath: AbsolutePosixFilePath
}): T.Effect<HasDocumentContext & OT.HasTracer, core.UnexpectedMDXError, core.MDX> =>
  T.gen(function* ($) {
    const isBodyField = fieldDef.name === options.fieldOptions.bodyFieldName
    const rawDocumentData = yield* $(getFromDocumentContext('rawDocumentData'))
    // NOTE for the body field, we're passing the entire document file contents to MDX (e.g. in case some remark/rehype plugins need access to the frontmatter)
    // TODO we should come up with a better way to do this
    if (isBodyField) {
      const rawContent = yield* $(getFromDocumentContext('rawContent'))
      if (rawContent.kind !== 'mdx' && rawContent.kind !== 'markdown') return utils.assertNever(rawContent)

      const code = yield* $(
        core.bundleMDX({
          mdxString: rawContent.rawDocumentContent,
          options: options?.mdx,
          contentDirPath,
          rawDocumentData,
        }),
      )
      return { raw: mdxString, code }
    } else {
      const code = yield* $(core.bundleMDX({ mdxString, options: options?.mdx, contentDirPath, rawDocumentData }))
      return { raw: mdxString, code }
    }
  })
