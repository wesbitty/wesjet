/* eslint-disable import/no-extraneous-dependencies */
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import remarkMdxImages from 'remark-mdx-images'
import { expect, test } from 'vitest'
import * as core from 'wesjet/core'
import { defineDocumentType, makeSource } from 'wesjet/maker'

test('mdx - resolveCwd - contentDirPath', async () => {
  const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: 'posts/*.mdx',
    contentType: 'mdx',
    fields: {},
  }))

  const testDirPath = fileURLToPath(new URL('.', import.meta.url))
  const testOutPath = `${testDirPath}/out`

  await fs.rm(path.join(testDirPath, '.wesjet'), { recursive: true, force: true })

  process.env['PWD'] = testDirPath

  const source = await makeSource({
    contentDirPath: path.join(testDirPath, 'contentDirPath'),
    documentTypes: [Post],
    mdx: {
      resolveCwd: 'contentDirPath',
      remarkPlugins: [remarkMdxImages],
      esbuildOptions: (options) => {
        options.platform = 'node'
        options.outdir = testOutPath
        options.assetNames = `images/[name]-[hash]`
        options.loader = {
          ...options.loader,
          '.png': 'file',
        }
        options.publicPath = '/'
        options.write = true
        return options
      },
    },
  })

  await core.runMain({ tracingServiceName: 'wesjet-test', verbose: false })(
    core.generateDotpkg({ config: { source, esbuildHash: 'STATIC_HASH' }, verbose: true }),
  )

  // Check that the bundled image has been generated
  const statResult = await fs.stat(path.join(testOutPath, 'images/image-b-QQWYPTMT.png')).catch(() => false)

  expect(statResult).not.toEqual(false)
})

test('mdx - resolveCwd - relative', async () => {
  const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: 'posts/*.mdx',
    contentType: 'mdx',
    fields: {},
  }))

  const testDirPath = fileURLToPath(new URL('.', import.meta.url))
  const testOutPath = `${testDirPath}/out`

  await fs.rm(path.join(testDirPath, '.wesjet'), { recursive: true, force: true })

  process.env['PWD'] = testDirPath

  const source = await makeSource({
    contentDirPath: path.join(testDirPath, 'content'),
    documentTypes: [Post],
    mdx: {
      resolveCwd: 'relative',
      remarkPlugins: [remarkMdxImages],
      esbuildOptions: (options) => {
        options.platform = 'node'
        options.outdir = testOutPath
        options.assetNames = `images/[name]-[hash]`
        options.loader = {
          ...options.loader,
          '.png': 'file',
        }
        options.publicPath = '/'
        options.write = true
        return options
      },
    },
  })

  await core.runMain({ tracingServiceName: 'wesjet-test', verbose: false })(
    core.generateDotpkg({ config: { source, esbuildHash: 'STATIC_HASH' }, verbose: true }),
  )

  // Check that the bundled image has been generated
  const statResult = await fs.stat(path.join(testOutPath, 'images/image-a-QQWYPTMT.png')).catch(() => false)

  expect(statResult).not.toEqual(false)
})
