import type { DocumentGen } from 'wesjet/core'

export const urlFromFilePath = (doc: DocumentGen): string => doc._raw.flattenedPath.replace(/pages\/?/, '')
