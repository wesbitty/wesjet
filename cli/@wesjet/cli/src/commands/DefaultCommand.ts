import { OT, pipe, T } from '@wesjet/utils/effect'
import { Command } from 'clipanion'

import { BaseCommand } from './_BaseCommand.js'

export class DefaultCommand extends BaseCommand {
  static paths = [Command.Default]

  executeSafe = () =>
    pipe(
      T.succeedWith(() => console.log(this.cli.usage())),
      OT.withSpan('@wesjet/cli/commands/DefaultCommand:executeSafe', { attributes: { cwd: process.cwd() } })
    )
}
