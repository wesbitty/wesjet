import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { OT } from '../effect/index.js'
import { pipe, T } from '../effect/index.js'
import * as fs from './fs.js'

// TODO do this at compile time as this takes 10ms every time
// use static import once JSON modules are no longer experimental
// import utilsPkg from '@wesjet/utils/package.json'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const getWesjetVersion = (): T.Effect<OT.HasTracer, GetWesjetVersionError, string> => {
  // Go two levels up for "dist/node/version.js"
  const packageJsonFilePath = path.join(__dirname, '..', '..', 'package.json')

  return pipe(
    fs.readFileJson(packageJsonFilePath),
    T.map((pkg: any) => pkg.version as string),
    T.catchTag('node.fs.FileNotFoundError', (e) => T.die(e)),
  )
}

export type GetWesjetVersionError = fs.ReadFileError | fs.JsonParseError
