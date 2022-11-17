import { defineNestedType } from 'wesjet/maker'

export const Link = defineNestedType(() => ({
  name: 'Link',
  fields: {
    label: {
      type: 'string',
      required: true,
    },
    url: {
      type: 'string',
      required: true,
    },
    isExternal: {
      type: 'boolean',
      default: false,
    },
  },
  extensions: {},
}))
