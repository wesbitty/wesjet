import highlight from "rehype-highlight";
import { makeSource } from "wesjet/maker";

import * as documentTypes from "./lib/wesjet";
import { contentDirPath } from "./lib/wesjet/utils";

export default makeSource({
  contentDirPath,
  documentTypes,
  mdx: { rehypePlugins: [highlight] },
});
