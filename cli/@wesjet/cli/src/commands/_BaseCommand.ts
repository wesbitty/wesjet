import type { HasCwd } from '@wesjet/core'
import * as core from '@wesjet/core'
import type { HasClock, HasConsole, OT } from '@wesjet/utils/effect'
import { pipe, T } from '@wesjet/utils/effect'
import { fs } from '@wesjet/utils/node'
import { Command, Option } from 'clipanion'
import * as t from 'typanion'

export abstract class BaseCommand extends Command {
  configPath = Option.String('-c,--config', {
    description: 'Path to the config (default: wesjet.config.ts/js)',
    validator: t.isString(),
    required: false,
  })

  clearCache = Option.Boolean('--clearCache', false, {
    description: 'Whether to clear the cache before running the command',
  })

  verbose = Option.Boolean('--verbose', false, {
    description: 'More verbose logging and error stack traces',
  })

  abstract executeSafe: () => T.Effect<OT.HasTracer & HasClock & HasCwd & HasConsole, unknown, void>

  execute = () =>
    pipe(
      this.executeSafe(),
      core.runMain({
        tracingServiceName: 'wesjet-cli',
        verbose: this.verbose || process.env.CL_DEBUG !== undefined,
      })
    )

  clearCacheIfNeeded = () => {
    const { clearCache } = this

    return T.gen(function* ($) {
      if (clearCache) {
        const cwd = yield* $(core.getCwd)
        const artifactsDir = core.ArtifactsDir.getDirPath({ cwd })
        yield* $(fs.rm(artifactsDir, { recursive: true, force: true }))
        yield* $(T.log('Cache cleared successfully'))
      }
    })
  }
}
