import * as path from 'node:path'

import type * as core from '@wesjet/core'
import type { RelativePosixFilePath } from '@wesjet/utils'
import * as utils from '@wesjet/utils'
import type { Has } from '@wesjet/utils/effect'
import { T, tag } from '@wesjet/utils/effect'

import type { DocumentContentType } from '../schema/defs/index.js'
import type { RawDocumentData } from '../types.js'
import { getFlattenedPath } from './mapping/index.js'
import type { RawContent } from './types.js'

/** `DocumentContext` is meant as a "container object" that provides useful information when processing a document */
export interface DocumentContext {
  readonly rawContent: RawContent
  readonly relativeFilePath: RelativePosixFilePath
  readonly rawDocumentData: RawDocumentData
  readonly documentTypeDef: core.DocumentTypeDef
}

export const DocumentContext = tag<DocumentContext>(Symbol.for('@wesjet/maker/DocumentContext'))

export const provideDocumentContext = (_: DocumentContext) => T.provideService(DocumentContext)(_)
export const makeAndProvideDocumentContext = ({
  rawContent,
  relativeFilePath,
  documentTypeDef,
}: Omit<DocumentContext, 'rawDocumentData'>) => {
  const contentType: DocumentContentType = utils.pattern
    .match(rawContent.kind)
    .with('markdown', () => 'markdown' as const)
    .with('mdx', () => 'mdx' as const)
    .otherwise(() => 'data' as const)

  const rawDocumentData: RawDocumentData = {
    sourceFilePath: relativeFilePath,
    sourceFileName: path.basename(relativeFilePath),
    sourceFileDir: path.dirname(relativeFilePath),
    contentType,
    flattenedPath: getFlattenedPath(relativeFilePath),
  }

  return provideDocumentContext({ rawContent, rawDocumentData, relativeFilePath, documentTypeDef })
}

export const getFromDocumentContext = <K extends keyof DocumentContext>(key: K) =>
  T.accessService(DocumentContext)((_) => _[key])

export type HasDocumentContext = Has<DocumentContext>
