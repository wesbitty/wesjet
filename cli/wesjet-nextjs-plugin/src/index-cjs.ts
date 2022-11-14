import type { NextConfig } from "next";

import type { NextPluginOptions } from "./plugin.js";

export type { NextConfig };

let devServerStarted = false;

const defaultPluginOptions: NextPluginOptions = {};
module.exports.defaultPluginOptions = defaultPluginOptions;

module.exports.createWesjetPlugin =
  (pluginOptions: NextPluginOptions = defaultPluginOptions) =>
  (nextConfig: Partial<NextConfig> = {}): Partial<NextConfig> => {
    // could be either `next dev` or just `next`
    const isNextDev =
      process.argv.includes("dev") ||
      process.argv.some(
        (_) => _.endsWith("bin/next") || _.endsWith("bin\\next")
      );
    const isBuild = process.argv.includes("build");

    return {
      ...nextConfig,
      // Since Next.js doesn't provide some kind of real "plugin system" we're (ab)using the `redirects` option here
      // in order to hook into and block the `next build` and initial `next dev` run.
      redirects: async () => {
        // TODO move to post-install?
        const { checkConstraints } = await import("./check-constraints.js");
        checkConstraints();

        // NOTE since next.config.js doesn't support ESM yet, this "CJS -> ESM bridge" is needed
        const { runWesjetBuild, runWesjetDev } = await import("./plugin.js");
        if (isBuild) {
          await runWesjetBuild(pluginOptions);
        } else if (isNextDev && !devServerStarted) {
          devServerStarted = true;
          // TODO also block here until first wesjet run is complete
          runWesjetDev(pluginOptions);
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

module.exports.withWesjet =
  module.exports.createWesjetPlugin(defaultPluginOptions);
