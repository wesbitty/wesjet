import type { Markdown, MDX } from "wesjet/core";
import * as Local from "wesjet/maker";

export { isType } from "wesjet/client";

// export type Image = string
export type { Markdown, MDX };

/** Document types */

export type Post = {
  /** File path relative to `contentDirPath` */
  _id: string;
  _raw: Local.RawDocumentData;
  type: "Post";
  /** The title of the page */
  title: string;
  /** Markdown file body */
  body: Markdown;
  /** The URL path of this page relative to site root. For example, the site root page would be "/", and doc page would be "docs/getting-started/" */
  url: string;
};

/** Nested types */

/** Helper types */

export type AllTypes = DocumentTypes | NestedTypes;
export type AllTypeNames = DocumentTypeNames | NestedTypeNames;

export type DocumentTypes = Post;
export type DocumentTypeNames = "Post";

export type NestedTypes = never;
export type NestedTypeNames = never;

export interface WesjetGenTypes {
  documentTypes: DocumentTypes;
  documentTypeMap: DocumentTypeMap;
  documentTypeNames: DocumentTypeNames;
  nestedTypes: NestedTypes;
  nestedTypeMap: NestedTypeMap;
  nestedTypeNames: NestedTypeNames;
  allTypeNames: AllTypeNames;
}

// declare global {
//   interface WesjetGen extends WesjetGenTypes {}
// }

export type DocumentTypeMap = {
  Post: Post;
};

export type NestedTypeMap = {};
