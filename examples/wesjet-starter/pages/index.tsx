import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'wesjet/jetpack'
import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const posts: Post[] = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })
  return { props: { posts } }
}

function PostCard(post: Post) {
  return (
    <div className={styles.grid}>
    <div className={styles.card}>
        <Link legacyBehavior
          href={post.url}>
          <h2>{post.title}</h2>
        </Link>
      <time dateTime={post.date}>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      </div>
    </div>
  );
}

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <div className={styles.container}>
    <main className={styles.main}>
        <p className={styles.description}>
          Welcome to wesjet! |{' '}
          <code className={styles.code}>Wesbitty, Inc</code>
        </p>

      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}

    </main>
    </div>
  )
}
