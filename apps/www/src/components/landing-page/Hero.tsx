import { useRouter } from 'next/router'
import { useState, FC } from 'react'
import Image from 'next/image'
import { Dashed } from './Dashed'
import { Icon } from '../common/Icon'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Heading } from './Heading'
import { Checklist } from './Checklist'
import { Paragraph } from './Paragraph'
import { Video } from './Video'
import Link from 'next/link'

const content = {
  heading: 'Content made easy for developers',
  recentBlogPost: {
    title: 'Introducing Wesjet (Beta): Content Made Easy for Developers',
    url: '/blog/beta',
  },
  text: (
    <>
      Wesjet is a{' '}
      <Dashed
        label="content SDK"
        tooltip="A content SDK simplifies working with structured content as data in your site/application"
      />{' '}
      that validates and transforms your content into{' '}
      <Dashed
        label="type-safe"
        tooltip="Wesjet compiles TypeScript types based on your content document definitions"
      />{' '}
      JSON data you can easily import into your application.
    </>
  ),
  features: ['Lightweight & easy to use', 'Great developer experience', 'Blazing fast build & page performance'],
  primaryAction: { label: 'Get started', url: '/docs/getting-started' },
  secondaryAction: { label: 'Why Wesjet?', url: '/blog/working-with-content-is-hard-for-developers' },
  video: {
    thumbnail: { url: 'https://i.imgur.com/5IKJALH.png', alt: 'Intro to Wesjet Video Thumbnail' },
    youtubeId: '58Pj4a4Us7A',
  },
}

export const Hero: FC = () => {
  const router = useRouter()

  return (
    <div className="w-full space-y-12 pt-8 md:space-y-20 md:pt-16 lg:pt-20">
      <div className="flex w-full justify-start px-4 md:justify-center">
        <div className="flex items-center space-x-2.5 rounded-md border border-slate-200 bg-slate-50 py-3 px-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="rounded-md bg-purple-500 py-1 px-1.5 text-xs font-semibold uppercase text-white dark:bg-purple-800">
            New
          </div>
          <Link href={content.recentBlogPost.url}>
            <a className="text-sm font-semibold text-slate-700 dark:text-slate-100">{content.recentBlogPost.title}</a>
          </Link>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-16 px-4 md:grid-cols-2 md:px-8 ">
        <div className="space-y-8 sm:max-w-md">
          <Heading level={1}>{content.heading}</Heading>
          <Paragraph className="text-lg">{content.text}</Paragraph>
          <Checklist items={content.features} className="text-lg" />
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-col md:space-y-4 md:space-x-0 lg:flex-row lg:space-y-0 lg:space-x-4">
            <Button label={content.primaryAction.label} href={content.primaryAction.url} theme="primary" />
            <Button label={content.secondaryAction.label} href={content.secondaryAction.url} theme="secondary" />
          </div>
        </div>
        <div className="relative flex w-full items-center">
          {/* TODO don't use image as thumbnail if possible */}
          <Video thumbnail={content.video.thumbnail} videoId={content.video.youtubeId} />
        </div>
      </div>
    </div>
  )
}
