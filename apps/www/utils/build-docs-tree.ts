import { children } from 'cheerio/lib/api/traversing'
import { Doc } from 'wesjet/jetpack'
import { TreeNode } from 'types/TreeNode'

export const buildDocsTree = (docs: Doc[], parentPathNames: string[] = []): TreeNode[] => {
  const level = parentPathNames.length

  return docs
    .filter(
      (_) =>
        _.pathSegments.length === level + 1 &&
        _.pathSegments
          .map((_: PathSegment) => _.pathName)
          .join('/')
          .startsWith(parentPathNames.join('/')),
    )
    .sort((a, b) => a.pathSegments[level].order - b.pathSegments[level].order)
    .map<TreeNode>((doc) => ({
      nav_title: doc.nav_title ?? null,
      title: doc.title,
      label: doc.label ?? null,
      excerpt: doc.excerpt ?? null,
      urlPath: '/docs/' + doc.pathSegments.map((_: PathSegment) => _.pathName).join('/'),
      collapsible: doc.collapsible ?? null,
      collapsed: doc.collapsed ?? null,
      children: buildDocsTree(
        docs,
        doc.pathSegments.map((_: PathSegment) => _.pathName),
      ),
    }))
}
