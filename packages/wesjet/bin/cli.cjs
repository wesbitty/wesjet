#!/usr/bin/env node

const main = async () => {
  const { run } = await import("@wesjet/cli");
  await run();
};

main().catch((e) => console.log(e));
