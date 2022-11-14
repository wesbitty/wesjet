import { errorToString } from "@wesjet/utils";
import { Tagged } from "@wesjet/utils/effect";

export class UnknownContentfulError extends Tagged("UnknownContentfulError")<{
  readonly error: unknown;
}> {
  toString = () => `UnknownContentfulError: ${errorToString(this.error)}`;
}
