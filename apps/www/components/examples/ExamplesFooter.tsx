import { format } from "date-fns";
import Link from "next/link";
import type { FC } from "react";
import type { Example } from "wesjet/jetpack";
import { Doc } from "wesjet/jetpack";

import { Icon } from "../common/Icon";

const githubBranch = "master";
const githubBaseUrl = `https://github.com/wesbitty/wesjetpkg/blob/${githubBranch}apps/www/_blog/`;

export const ExamplesFooter: FC<{ example: Example }> = ({ example }) => {
  return (
    <>
      <hr />
      <div className="space-y-4 text-sm sm:flex sm:justify-between sm:space-y-0">
        <p className="m-0">
          Was this example helpful to you? <br />{" "}
          <Link href="https://github.com/wesbitty/wesjetpkg/issues">
            <a
              className="inline-flex items-center space-x-1"
              target="_blank"
              rel="noreferrer"
            >
              <span className="inline-block w-4">
                <Icon name="github" />
              </span>
              <span>Provide feedback</span>
            </a>
          </Link>
        </p>
        <p className="m-0 text-right">
          Last edited on{" "}
          {format(new Date(example.last_edited), "MMMM dd, yyyy")}.<br />
          <Link href={githubBaseUrl + example._raw.sourceFilePath}>
            <a
              className="inline-flex items-center space-x-1"
              target="_blank"
              rel="noreferrer"
            >
              <span className="inline-block w-4">
                <Icon name="github" />
              </span>
              <span>Edit this page</span>
            </a>
          </Link>
        </p>
      </div>
    </>
  );
};
