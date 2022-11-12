import { provideJaegerTracing } from '@wesjet/utils'
import { pipe, provideConsole, T } from '@wesjet/utils/effect'
import type { DocumentType } from 'wesjet/maker'
import { makeSource } from 'wesjet/maker'

import * as azimuth from './azimuth-schema/index.js'
import * as blog from './blog-schema/index.js'

export const makeAzimuthSchema = () => makeSchema(azimuth)
export const makeBlogSchema = () => makeSchema(blog)

const esbuildHash = 'not-important-for-this-test'

const makeSchema = (documentTypes: Record<string, DocumentType<any>>) =>
  pipe(
    T.tryPromise(() => makeSource({ documentTypes, contentDirPath: '' })),
    T.chain(source => source.provideSchema(esbuildHash)),
    provideJaegerTracing('wesjet-cli'),
    provideConsole,
    T.runPromise
  )
