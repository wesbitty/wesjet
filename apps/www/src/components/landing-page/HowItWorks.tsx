import { IconName } from '../common/Icon'
import { FC } from 'react'
import { Button } from '../common/Button'
import { CodeWindow } from './CodeWindow'
import { DataTransformation } from './DataTransformation'
import * as Tabs from '@radix-ui/react-tabs'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Heading } from './Heading'
import { Paragraph } from './Paragraph'

export const codeSnippets = {
  howItWorksStep1: [
    {
      file: 'wesjet.config.ts',
      lines: 16,
      content: `\
import { defineDocumentType, makeSource } from 'wesjet/maker'

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: \`**/*.md\`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true }
  },
}))

export default makeSource({
  contentDirPath: 'posts',
  /*              ^^^^^^^ Directory with the Markdown files. */
  documentTypes: [Post]
})\
`,
    },
  ],
  howItWorksStep3: [
    {
      file: 'pages/posts/index.tsx',
      lines: 20,
      content: `\
import { allPosts, type Post } from './assets/wesjet-jetpack'

export function getStaticProps() {
  return { props: { posts: allPosts } }
}

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h1>All posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.url}>
            <a href={post.url}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}\
`,
    },
    {
      file: 'pages/posts/[slug].tsx',
      lines: 21,
      content: `\
import { allPosts, type Post } from './assets/wesjet-jetpack'

export function getStaticPaths() {
  const paths = allPosts.map((post) => post.url)
  return { paths }
}

export function getStaticProps({ params }) {
  const post = allPosts.find((post) => post.url === params.slug)

  return { props: { post } }
}

export default function Post({ post }: { post: Post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </div>
  )
}\
`,
    },
  ],
} as const

export type CodeSnippets = typeof codeSnippets

const codesnippetKey = (k: keyof CodeSnippets) => k

export const localStep2DataTransformation = {
  from: {
    type: 'fileTree',
    data: {
      type: 'folder',
      name: 'posts/',
      children: [
        {
          type: 'file',
          name: 'editing-content.md',
          comment: '',
          tooltip: 'Source file with post content and frontmatter fields.',
        },
        {
          type: 'file',
          name: 'page-support.md',
          comment: '',
          tooltip: 'Source file with post content and frontmatter fields.',
        },
        {
          type: 'file',
          name: 'what-is-wesjet.md',
          comment: '',
          tooltip: 'Source file with post content and frontmatter fields.',
        },
      ],
    },
  },
  /* You can also use an image on either side:

  from: {
    type: 'image',
    data: {
      url: '/images/local-data-transformation.png',
      alt: 'Data transformation',
      width: 561,
      height: 275,
    },
  },
  */
  to: {
    type: 'fileTree',
    data: {
      type: 'folder',
      name: '.wesjet/jetpack/',
      children: [
        {
          type: 'folder',
          name: 'Post/',
          children: [
            // NOTE Commented out to simplify of the narrative
            // { type: 'file', name: '_index.json', comment: '', tooltip: 'Tooltip content' },
            // { type: 'file', name: '_index.mjs', comment: '', tooltip: 'Tooltip content' },
            {
              type: 'file',
              name: 'editing-content.md.json',
              comment: '',
              tooltip: 'Transformed data object representing the post content.',
            },
            {
              type: 'file',
              name: 'page-support.md.json',
              comment: '',
              tooltip: 'Transformed data object representing the post content.',
            },
            {
              type: 'file',
              name: 'what-is-wesjet.md.json',
              comment: '',
              tooltip: 'Transformed data object representing the post content.',
            },
          ],
        },
        {
          type: 'file',
          name: 'index.d.ts',
          // comment: 'Type definitions',
          tooltip: 'Type definitions for Post are exported from this file.',
        },
        {
          type: 'file',
          name: 'index.mjs',
          // comment: 'Exports all data',
          tooltip: 'The primary manifest file that exports all transformed data objects.',
        },
        // NOTE Commented out to simplify of the narrative
        // {
        //   type: 'file',
        //   name: 'types.d.ts',
        //   comment: 'Type definitions',
        //   tooltip: 'Tooltip content',
        // },
      ],
    },
  },
}

const content = {
  heading: 'How Wesjet works with...',
  tabs: [
    {
      title: 'Local files',
      active: true,
      steps: [
        {
          heading: 'Configure your content source',
          text: (
            <p>
              When working with local markdown or MDX files, you tell Contentlayer the expected shape of your data
              (document type definitions).
            </p>
          ),
          cta: {
            label: 'Explore Example',
            theme: 'primary',
            icon: 'github' as IconName,
            url: 'https://github.com/wesbitty/nextjs-with-wesjet',
          },
          codeSnippetsKey: codesnippetKey('howItWorksStep1'),
        },
        {
          heading: 'Your content is transformed into data',
          text: (
            <>
              <p>
                Run Wesjet to process your content. Do this as part of the Next.js dev server, or using the
                Wesjet CLI.
              </p>
              <p>
                This validates the content, then generates types definitions and outputs data objects ready to be
                imported as a ESM module.
              </p>
            </>
          ),
          /* You can also use an image instead of a code snippet or data transformation graphic:

          image: {
            url: '/images/local-data-transformation.png',
            alt: 'Data transformation',
            width: 561,
            height: 275,
          },
          */
          dataTransformation: localStep2DataTransformation,
        },
        {
          heading: 'Import data into your application',
          text: (
            <>
              <p>
                Import the data just like you would any other JavaScript library. Use it to render pages, and pass down
                as props to the components on those pages.
              </p>
              <p>
                Keep the development bundle small with tree-shaking and improve the development experience by using the
                generated type definitions.
              </p>
            </>
          ),
          codeSnippetsKey: codesnippetKey('howItWorksStep3'),
        },
      ],
    },
    {
      title: 'Contentful',
      active: false,
      steps: [],
    },
    {
      title: 'Notion',
      active: false,
      steps: [],
    },
  ],
}

export const HowItWorks: FC<{ codeSnippets: CodeSnippets }> = ({ codeSnippets }) => {
  return (
    <div className="w-full max-w-screen-xl px-4 mx-auto mt-16 md:mt-24 md:px-8 lg:mt-32">
      <Tabs.Root defaultValue={content.tabs[0].title.toLowerCase().replace(/ /g, '-')}>
        <div className="space-y-8 sm:text-center">
          <Heading level={2}>{content.heading}</Heading>
          <Tabs.List
            aria-label="Select content source"
            className="flex flex-nowrap overflow-x-auto py-0.5 sm:justify-center"
          >
            {content.tabs.map(({ title, active }, index) =>
              active ? (
                <Tabs.Trigger
                  key={index}
                  value={title.toLowerCase().replace(/ /g, '-')}
                  disabled={!active}
                  className={`shrink-0 overflow-hidden whitespace-nowrap border font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300 dark:focus:ring-violet-900 ${index == 0 ? 'rounded-l-md' : index == content.tabs.length - 1 ? 'rounded-r-md' : '-mx-px'
                    } border-gray-200 bg-gray-50 py-2 px-4 text-slate-600
              hover:bg-gray-100 radix-state-active:z-20 radix-state-active:border-violet-300 radix-state-active:bg-violet-100 radix-state-active:text-violet-600
              dark:border-gray-800 dark:bg-gray-900 dark:text-slate-300 dark:hover:bg-gray-800 dark:radix-state-active:border-violet-900 dark:radix-state-active:bg-violet-600/20 dark:radix-state-active:text-violet-500`}
                >
                  {title}
                </Tabs.Trigger>
              ) : (
                <Tooltip.Root key={index} delayDuration={100}>
                  <Tooltip.Trigger
                    className={`cursor-default border font-semibold ${index == 0 ? 'rounded-l-md' : index == content.tabs.length - 1 ? 'rounded-r-md' : '-mx-px'
                      } border-gray-200 bg-gray-50 py-2 px-4 text-slate-400 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-500`}
                  >
                    {title}
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    sideOffset={10}
                    className="rounded bg-gray-800 px-3 py-1.5 text-sm text-slate-100 shadow-xl shadow-white dark:bg-violet-200 dark:text-violet-900 dark:shadow-black"
                  >
                    Coming soon
                    <Tooltip.Arrow className="mx-1 text-gray-800 fill-current dark:text-violet-200" />
                  </Tooltip.Content>
                </Tooltip.Root>
              ),
            )}
          </Tabs.List>
        </div>
        {content.tabs
          .filter((t) => t.active)
          .map(({ title, steps }, index) => (
            <Tabs.Content
              key={index}
              value={title.toLowerCase().replace(/ /g, '-')}
              className="relative focus:outline-none"
            >
              <div className="absolute inset-y-0 hidden w-0 border-l border-dashed left-6 border-slate-300 dark:border-slate-600 sm:block" />
              <div className="absolute bottom-0 hidden w-2 left-5 h-96 bg-gradient-to-b from-white/0 via-white/100 to-white/100 dark:from-gray-950/0 dark:via-gray-950/100 dark:to-gray-950/100 sm:block" />
              {steps.map(({ heading, text, cta, codeSnippetsKey, dataTransformation }, index) => (
                <div key={index} className="relative grid grid-cols-1 gap-12 mt-16 md:grid-cols-2 md:gap-16">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 sm:space-x-8">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-100 text-xl font-black text-violet-600 ring-4 ring-white dark:border-violet-900 dark:bg-[#2C1657] dark:text-violet-500 dark:ring-gray-950">
                        {index + 1}
                      </div>
                      <Heading level={3}>{heading}</Heading>
                    </div>
                    <div className="space-y-8 sm:pl-20">
                      <div className="max-w-md leading-relaxed">{text}</div>
                      {cta && (
                        <div className="flex">
                          <Button label={cta.label} href={cta.url} theme="secondary" icon={cta?.icon ?? ''} />
                        </div>
                      )}
                    </div>
                  </div>
                  {dataTransformation && (
                    <div>
                      <DataTransformation from={dataTransformation.from} to={dataTransformation.to} />
                    </div>
                  )}
                  {codeSnippetsKey && (
                    <div>
                      <CodeWindow snippets={codeSnippets[codeSnippetsKey]} />
                    </div>
                  )}
                </div>
              ))}
            </Tabs.Content>
          ))}
      </Tabs.Root>
    </div>
  )
}
