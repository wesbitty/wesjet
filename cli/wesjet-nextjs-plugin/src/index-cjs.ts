import type { NextConfig } from 'next'

import type { NextPluginOptions } from './plugin.js'

export type { NextConfig }

let devServerStarted = false

const defaultPluginOptions: NextPluginOptions = {}
module.exports.defaultPluginOptions = defaultPluginOptions

/**
 * This function allows you to provide custom plugin options (currently there are none however).
 *
 * @example
 * ```js
 * // next.config.js
 * const { createWesjetPlugin } = require('wesjet-nextjs-plugin')
 *
 * const withWesjet = createWesjetPlugin({ configPath: './content/wesjet.config.ts' })
 *
 * module.exports = withWesjet({
 *   // My Next.js config
 * })
 * ```
 */
module.exports.createWesjetPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes('dev') || process.argv.some((_) => _.endsWith('bin/next') || _.endsWith('bin\\next'))
    const isBuild = process.argv.includes('build')

    return {
      ...nextConfig,
      // Since Next.js doesn't provide some kind of real "plugin system" we're (ab)using the `redirects` option here
      // in order to hook into and block the `next build` and initial `next dev` run.
      redirects: async () => {
        // TODO move to post-install?
        const { checkConstraints } = await import('./check-constraints.js')
        checkConstraints()

        // NOTE since next.config.js doesn't support ESM yet, this "CJS -> ESM bridge" is needed
        const { runWesjetBuild, runWesjetDev } = await import('./plugin.js')
        if (isBuild) {
          await runWesjetBuild(pluginOptions)
        } else if (isNextDev && !devServerStarted) {
          devServerStarted = true
          // TODO also block here until first wesjet run is complete
          runWesjetDev(pluginOptions)
        }

        return nextConfig.redirects?.() ?? []
      },
      onDemandEntries: {
        maxInactiveAge: 60 * 60 * 1000, // extend `maxInactiveAge` to 1 hour (from 15 sec by default)
        ...nextConfig.onDemandEntries, // use existing onDemandEntries config if provided by user
      },
      webpack(config: any, options: any) {
        config.watchOptions = {
          ...config.watchOptions,
          // ignored: /node_modules([\\]+|\/)+(?!\.wesjet)/,
          ignored: ['**/node_modules/!(.wesjet)/**/*'],
        }

        // NOTE workaround for https://github.com/vercel/next.js/issues/17806#issuecomment-913437792
        // https://github.com/wesbitty/wesjetpkg/issues/121
        config.module.rules.push({
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  }

/**
 * Next.js plugin for wesjet with default options.
 *
 * If you want to provide custom plugin options, please use {@link createWesjetPlugin} instead.
 *
 * @example
 * ```js
 * // next.config.js
 * const { withWesjet } = require('wesjet-nextjs-plugin')
 *
 * module.exports = withWesjet({
 *   // My Next.js config
 * })
 * ```
 */
module.exports.withWesjet = module.exports.createWesjetPlugin(defaultPluginOptions)
