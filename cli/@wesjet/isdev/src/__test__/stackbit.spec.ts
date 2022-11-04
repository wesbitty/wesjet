import path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as Stackbit from '@stackbit/sdk'
import * as SourceFiles from '@wesjet/maker'
import { provideDummyTracing } from '@wesjet/utils'
import type { HasClock, HasConsole, OT } from '@wesjet/utils/effect'
import { pipe, provideTestConsole, T } from '@wesjet/utils/effect'
import { expect, test } from 'vitest'

import { stackbitConfigToDocumentTypes } from '../index.js'

const testDirPath = fileURLToPath(new URL('.', import.meta.url))
const NOT_USED_STR = 'NOT_USED'

test('kitchen-sink', async () => {
  const coreSchema = await schemaFromFixture('kitchen-sink')()
  expect(coreSchema).toMatchSnapshot()
})

test('next-starter', async () => {
  const coreSchema = await schemaFromFixture('next-starter')()
  expect(coreSchema).toMatchSnapshot()
})

test('small-business', async () => {
  const coreSchema = await schemaFromFixture('small-business')()
  expect(coreSchema).toMatchSnapshot()
})

const schemaFromFixture = (fixtureName: string) => async () => {
  const nextStarterFixtureDirPath = path.join(testDirPath, 'fixtures', fixtureName)

  const configResult = await Stackbit.loadConfig({ dirPath: nextStarterFixtureDirPath })

  const documentTypes = stackbitConfigToDocumentTypes(configResult.config!)

  const wesjetSource = await SourceFiles.makeSource({ contentDirPath: NOT_USED_STR, documentTypes })
  const schema = await runMain(wesjetSource.provideSchema(NOT_USED_STR))

  return schema.result
}

const runMain = async <E, A>(eff: T.Effect<OT.HasTracer & HasClock & HasConsole, E, A>) => {
  const logMessages: string[] = []
  const result = await pipe(eff, provideTestConsole(logMessages), provideDummyTracing, T.runPromise)

  return { logMessages, result }
}
