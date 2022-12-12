import type { NextConfig } from "next";

import { checkConstraints } from "./check-constraints.js";
import {
  type NextPluginOptions,
  runWesjetBuild,
  runWesjetDev,
} from "./plugin.js";

export type { NextConfig };

let devServerStarted = false;

export const defaultPluginOptions: NextPluginOptions = {};

export const createWesjetPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes("dev") ||
      process.argv.some(
        (_) => _.endsWith("bin/next") || _.endsWith("bin\\next")
      );
    const isBuild = process.argv.includes("build");

    const { configPath } = pluginOptions;

    return {
      ...nextConfig,
      // Since Next.js doesn't provide some kind of real "plugin system" we're (ab)using the `redirects` option here
      // in order to hook into and block the `next build` and initial `next dev` run.
      redirects: async () => {
        if (isBuild) {
          checkConstraints();
          await runWesjetBuild({ configPath });
        } else if (isNextDev && !devServerStarted) {
          devServerStarted = true;
          // TODO also block here until first wesjet run is complete
          runWesjetDev({ configPath });
        }

        return nextConfig.redirects?.() ?? [];
      },
      onDemandEntries: {
        maxInactiveAge: 60 * 60 * 1000, // extend `maxInactiveAge` to 1 hour (from 15 sec by default)
        ...nextConfig.onDemandEntries, // use existing onDemandEntries config if provided by user
      },
      webpack(config: any, options: any) {
        config.watchOptions = {
          ...config.watchOptions,
          // ignored: /node_modules([\\]+|\/)+(?!\.wesjet)/,
          ignored: ["**/node_modules/!(.wesjet)/**/*"],
        };

        // NOTE workaround for https://github.com/vercel/next.js/issues/17806#issuecomment-913437792
        // https://github.com/wesbitty/wesjet/issues/121
        config.module.rules.push({
          test: /\.m?js$/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        });

        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    };
  };

export const withWesjet = createWesjetPlugin(defaultPluginOptions);
