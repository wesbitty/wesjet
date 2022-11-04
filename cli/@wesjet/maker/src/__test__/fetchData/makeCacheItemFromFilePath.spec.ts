import path from 'node:path'

import { E } from '@wesjet/utils/effect'
import { fileURLToPath } from 'url'
import { expect, test } from 'vitest'

// Given we're running the tests of the ./dist directory, we need to point the `__dirname` back to the `src` directory
const testFileDir = path.dirname(fileURLToPath(import.meta.url)).replace('dist', 'src')

const contentDirPath = path.join(testFileDir, 'fixtures', 'content')

import { defineDocumentType } from '../../schema/defs/index.js'
import { runTest } from './utils.js'

test('a.md: hello world should work', async () => {
  const TestPost = defineDocumentType(() => ({
    name: 'TestPost',
    filePathPattern: `**/*.md`,
    fields: {},
  }))

  const { result } = await runTest({ documentTypes: [TestPost], contentDirPath, relativeFilePath: 'a.md' })

  expect(result._tag).toBe('Right')
  if (E.isRight(result)) {
    expect(result.right.document).toBeTruthy()
  }
})

test('a.md: file extension - contentType mismatch', async () => {
  const TestPost = defineDocumentType(() => ({
    name: 'TestPost',
    filePathPattern: `**/*.md`,
    contentType: 'data',
    fields: {},
  }))

  const { result } = await runTest({ documentTypes: [TestPost], contentDirPath, relativeFilePath: 'a.md' })

  expect(result._tag).toBe('Left')
  if (E.isLeft(result)) {
    expect(result.left._tag, 'FileExtensionMismatch')
  }
})

test('b.md: missing required field: list of strings', async () => {
  const TestPost = defineDocumentType(() => ({
    name: 'TestPost',
    filePathPattern: `**/*.md`,
    fields: {
      tags: { type: 'list', of: { type: 'string' }, required: true },
    },
  }))

  const { result } = await runTest({ documentTypes: [TestPost], contentDirPath, relativeFilePath: 'b.md' })

  expect(result._tag, 'Left')
  if (E.isLeft(result)) {
    expect(result.left._tag).toBe('MissingRequiredFieldsError')
  }
})

test('b.md: missing optional field: list of strings', async () => {
  const TestPost = defineDocumentType(() => ({
    name: 'TestPost',
    filePathPattern: `**/*.md`,
    fields: {
      tags: { type: 'list', of: { type: 'string' }, required: false },
    },
  }))

  const { result } = await runTest({ documentTypes: [TestPost], contentDirPath, relativeFilePath: 'b.md' })

  expect(result._tag).toBe('Right')
  if (E.isRight(result)) {
    expect(result.right.document).toBeTruthy()
  }
})

test('c.md: invalid frontmatter', async () => {
  const TestPost = defineDocumentType(() => ({
    name: 'TestPost',
    filePathPattern: `**/*.md`,
    fields: {
      tags: { type: 'list', of: { type: 'string' }, required: true },
      categories: { type: 'list', of: { type: 'string' }, required: true },
      // other: { type: 'boolean', required: true },
    },
  }))

  const { result } = await runTest({ documentTypes: [TestPost], contentDirPath, relativeFilePath: 'c.md' })

  expect(result._tag, 'Left')
  if (E.isLeft(result)) {
    expect(result.left._tag).toBe('IncompatibleFieldDataError')
  }
})
