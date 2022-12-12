import path from "node:path";

import type { AbsolutePosixFilePath } from "@wesjet/utils";
import { filePathJoin } from "@wesjet/utils";
import { Chunk, O, OT, pipe, T, Tagged } from "@wesjet/utils/effect";
import { fs } from "@wesjet/utils/node";
import { parse as parseJsonc } from "comment-json";

import { getCwd } from "./cwd.js";

export const validateTsconfig = pipe(
  T.gen(function* ($) {
    const cwd = yield* $(getCwd);

    const possibleFileNames = ["tsconfig.json", "jsconfig.json"].map((_) =>
      filePathJoin(cwd, _)
    );

    const tsconfigOption = yield* $(
      pipe(
        possibleFileNames,
        T.forEachPar(tryParseFile),
        T.map(Chunk.toArray),
        T.map((_) => O.getFirst(..._))
      )
    );

    const warningMessage = (msg: string) =>
      T.log(`\
wesjet (Warning): Importing from \`wesjet\/jetpack\` might not work.
${msg}

For more information see https://www.wesbitty.com/docs/wesjet/getting-started
To disable this warning you can set \`disableImportAliasWarning: true\` in your wesjet config.
`);

    if (O.isNone(tsconfigOption)) {
      yield* $(warningMessage(`No tsconfig.json or jsconfig.json file found`));

      return;
    }

    const { config, fileName } = tsconfigOption.value;

    if (config.compilerOptions?.baseUrl === undefined) {
      yield* $(
        warningMessage(
          `Config option \`compilerOptions.baseUrl\` not found in "${fileName}".`
        )
      );
      return;
    }

    if (config.compilerOptions?.paths === undefined) {
      yield* $(
        warningMessage(
          `Config option \`compilerOptions.paths\` not found in "${fileName}".`
        )
      );
      return;
    }

    const paths = Object.values(
      config.compilerOptions.paths
    ).flat() as string[];
    if (!paths.some((_) => _.includes("./.wesjet/jetpack"))) {
      yield* $(
        warningMessage(
          `No path alias found for "wesjet/jetpack" via \`compilerOptions.paths\` in "${fileName}".`
        )
      );
    }
  }),
  OT.withSpan("validateTsconfig")
);

const tryParseFile = (filePath: AbsolutePosixFilePath) =>
  pipe(
    fs.readFile(filePath),
    T.chain((contents) =>
      T.tryCatch(
        () => parseJsonc(contents, undefined, true),
        (error) => new InvalidTsconfigError({ error })
      )
    ),
    T.map((config: any) => ({ fileName: path.basename(filePath), config })),
    T.tapError((error) =>
      T.succeedWith(() => {
        if (
          error._tag === "InvalidTsconfigError" ||
          error._tag === "node.fs.ReadFileError"
        ) {
          console.log(
            `wesjet: Invalid jsconfig/tsconfig file found: ${filePath}`
          );
        }
      })
    ),
    T.option
  );

export class InvalidTsconfigError extends Tagged("InvalidTsconfigError")<{
  readonly error: any;
}> {}
