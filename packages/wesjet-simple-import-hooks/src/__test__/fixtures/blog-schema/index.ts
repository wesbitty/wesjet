import { defineDocumentType } from 'wesjet/maker'

export const post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    slug: { type: 'string', resolve: (_) => _._id.replace('.md', '') },
  },
}))
