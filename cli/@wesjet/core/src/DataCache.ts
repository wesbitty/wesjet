import * as path from 'node:path'

import type { E } from '@wesjet/utils/effect'
import { OT, pipe, T } from '@wesjet/utils/effect'
import type { GetWesjetVersionError } from '@wesjet/utils/node'
import { fs } from '@wesjet/utils/node'

import { ArtifactsDir } from './ArtifactsDir.js'
import type { HasCwd } from './cwd.js'
import type { Document } from './data-types.js'

export namespace DataCache {
  export type Cache = {
    /**
     * A map containing all documents wrapped in a {@link CacheItem} indexed by id.
     * We're using a map/record here (instead of a simple array) since it's easier and more efficient
     * to implement cache operations (e.g. lookup, update, delete) this way.
     */
    cacheItemsMap: { [id: string]: CacheItem }
  }

  export type CacheItem = {
    document: Document
    /**
     * Until all data types are serializable, we can't cache warnings.
     */
    hasWarnings: boolean
    /**
     * The `documentHash` is used to determine if a document has changed and it's value-generation is implemented
     * by a given plugin (e.g. based on the last-edit date in maker)
     */
    documentHash: string
    documentTypeName: string
  }

  export const loadPreviousCacheFromDisk = ({
    schemaHash,
  }: {
    schemaHash: string
  }): T.Effect<
    OT.HasTracer & HasCwd,
    fs.StatError | fs.ReadFileError | fs.JsonParseError | GetWesjetVersionError,
    Cache | undefined
  > =>
    pipe(
      T.gen(function* ($) {
        const cacheDirPath = yield* $(ArtifactsDir.getCacheDirPath)
        const filePath = path.join(cacheDirPath, dataCacheFileName(schemaHash))

        yield* $(OT.addAttribute('filePath', filePath))
        const cache = yield* $(fs.readFileJsonIfExists<Cache>(filePath))

        return cache
      }),
      OT.withSpan('@wesjet/core/cache:loadPreviousCacheFromDisk', { attributes: { schemaHash } })
    )

  export const writeCacheToDisk = ({
    cache,
    schemaHash,
  }: {
    cache: Cache
    schemaHash: string
  }): T.Effect<
    OT.HasTracer & HasCwd,
    never,
    E.Either<fs.WriteFileError | fs.MkdirError | fs.JsonStringifyError | GetWesjetVersionError, void>
  > =>
    pipe(
      T.gen(function* ($) {
        const cacheDirPath = yield* $(ArtifactsDir.mkdirCache)

        const filePath = path.join(cacheDirPath, dataCacheFileName(schemaHash))
        yield* $(OT.addAttribute('filePath', filePath))

        yield* $(fs.writeFileJson({ filePath, content: cache }))
      }),
      T.either,
      OT.withSpan('@wesjet/core/cache:writeCacheToDisk', { attributes: { schemaHash } })
    )

  const dataCacheFileName = (schemaHash: string) => `data-${schemaHash}.json`
}
