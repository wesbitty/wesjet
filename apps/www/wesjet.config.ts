import { makeSource } from "wesjet/maker";
import highlight from "rehype-highlight";
import { contentDirPath } from "./lib/wesjet/utils";

import * as documentTypes from "./lib/wesjet";

export default makeSource({
  contentDirPath,
  documentTypes,
  mdx: { rehypePlugins: [highlight] },
});
