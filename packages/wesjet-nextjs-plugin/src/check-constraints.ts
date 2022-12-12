import { createRequire } from "module";

export const checkConstraints = () => {
  checkNodeVersion();
  checkWesjetVersionsMatch();
};

const MIN_NODE_VERSION_MAJOR = 14;
const MIN_NODE_VERSION_MINOR = 18;

const checkNodeVersion = () => {
  const [nodeVersionMajor, nodeVersionMinor] = process.versions.node
    .split(".")
    .map((_) => parseInt(_, 10)) as [number, number, number];

  if (
    nodeVersionMajor < MIN_NODE_VERSION_MAJOR ||
    (nodeVersionMajor === MIN_NODE_VERSION_MAJOR &&
      nodeVersionMinor < MIN_NODE_VERSION_MINOR)
  ) {
    throw new Error(
      `wesjet required Node.js version >= ${MIN_NODE_VERSION_MAJOR}.${MIN_NODE_VERSION_MINOR}. (Current version: ${process.versions.node})`
    );
  }
};

const checkWesjetVersionsMatch = () => {
  const wesjetVersion = getPackageVersion("wesjet");
  const nextWesjetVersion = getPackageVersion("wesjet-nextjs-plugin");

  if (wesjetVersion !== nextWesjetVersion) {
    throw new Error(
      `\
The versions of "wesjet" and "wesjet-nextjs-plugin" need to be identical in your "package.json".
Currently used versions: wesjet: "${wesjetVersion}", wesjet-nextjs-plugin: "${nextWesjetVersion}"`
    );
  }
};

const require = createRequire(import.meta.url);

const getPackageVersion = (packageName: string): string =>
  require(`${packageName}/package.json`).version;
