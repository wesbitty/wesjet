import '@wesjet/utils/effect/Tracing/Enable'

import * as core from '@wesjet/core'
import { errorToString } from '@wesjet/utils'
import { E, OT, pipe, S, T } from '@wesjet/utils/effect'

export type NextPluginOptions = {
  configPath?: string | undefined
}

/** Seems like the next.config.js export function might be executed multiple times, so we need to make sure we only run it once */
let wesjetInitialized = false

export const runWesjetDev = async ({ configPath }: NextPluginOptions) => {
  if (wesjetInitialized) return
  wesjetInitialized = true

  await pipe(
    core.getConfigWatch({ configPath }),
    S.tapSkipFirstRight(() => T.log(`wesjet config change detected. Updating type definitions and data...`)),
    S.tapRight((config) => (config.source.options.disableImportAliasWarning ? T.unit : T.fork(core.validateTsconfig))),
    S.chainSwitchMapEitherRight((config) => core.generateDotpkgStream({ config, verbose: false, isDev: true })),
    S.tap(E.fold((error) => T.log(errorToString(error)), core.logGenerateInfo)),
    S.runDrain,
    runMain,
  )
}

export const runWesjetBuild = async ({ configPath }: NextPluginOptions) => {
  if (wesjetInitialized) return
  wesjetInitialized = true

  await pipe(
    core.getConfig({ configPath }),
    T.chain((config) => core.generateDotpkg({ config, verbose: false })),
    T.tap(core.logGenerateInfo),
    OT.withSpan('wesjet-nextjs-plugin:runWesjetBuild'),
    runMain,
  )
}

const runMain = core.runMain({
  tracingServiceName: 'wesjet-nextjs-plugin',
  verbose: process.env.CL_DEBUG !== undefined,
})
