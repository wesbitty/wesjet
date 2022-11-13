import React from 'react'
import type { MDXComponents } from 'mdx/types'
import ReactDOM from 'react-dom'

// @ts-expect-error React version workaround (This CJS workaround can be removed once Contentlayer is only targeting React 18+)
import { _jsx_runtime } from './jsx-runtime.cjs'
// import * as _jsx_runtime from 'react/jsx-runtime'

type MDXContentProps = {
  [props: string]: unknown
  components?: MDXComponents
}

const getMDXComponent = (code: string, globals: Record<string, unknown> = {}): React.ComponentType<MDXContentProps> => {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals }
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}

export const useMDXComponent = (code: string, globals: Record<string, unknown> = {}) => {
  return React.useMemo(() => getMDXComponent(code, globals), [code, globals])
}
