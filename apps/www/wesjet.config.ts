// TODO remove eslint-disable when fixed https://github.com/import-js/eslint-plugin-import/issues/1810
// eslint-disable-next-line import/no-unresolved
import { makeSource } from 'wesjet/maker'
import highlight from 'rehype-highlight'
import { contentDirPath } from './src/wesjet/utils'

import * as documentTypes from './src/wesjet'

export default makeSource({
  contentDirPath,
  documentTypes,
  mdx: { rehypePlugins: [highlight] },
})
