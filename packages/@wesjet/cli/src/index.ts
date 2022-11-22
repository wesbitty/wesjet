import "@wesjet/utils/effect/Tracing/Enable";

import process from "node:process";

import { provideDummyTracing } from "@wesjet/utils";
import { pipe, T } from "@wesjet/utils/effect";
import { getWesjetVersion } from "@wesjet/utils/node";
import { Builtins, Cli } from "clipanion";

import { BuildCommand } from "./commands/BuildCommand.js";
import { DefaultCommand } from "./commands/DefaultCommand.js";
import { DevCommand } from "./commands/DevCommand.js";
import { PostInstallCommand } from "./commands/PostInstallCommand.js";

export const run = async () => {
  const [node, app, ...args] = process.argv;

  const wesjetVersion = await pipe(
    getWesjetVersion(),
    provideDummyTracing,
    T.runPromise
  );

  const cli = new Cli({
    binaryLabel: `wesjet CLI`,
    binaryName: process.env["CL_DEBUG"] ? `${node} ${app}` : "wesjet",
    binaryVersion: wesjetVersion,
  });

  cli.register(DefaultCommand);
  cli.register(DevCommand);
  cli.register(BuildCommand);
  cli.register(PostInstallCommand);
  cli.register(Builtins.HelpCommand);
  cli.register(Builtins.VersionCommand);

  // Run the CLI
  await cli.runExit(args, Cli.defaultContext);
};
