import Head from "next/head";
import { format, parseISO } from "date-fns";
import { allPosts, Post } from "wesjet/jetpack";
import styles from '../../styles/Home.module.css'

export async function getStaticPaths() {
  const paths: string[] = allPosts.map((post) => post.url);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post: Post = allPosts.find(
    (post) => post._raw.flattenedPath === params.slug
  );
  return {
    props: {
      post,
    },
  };
}

const PostLayout = ({ post }: { post: Post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <div className={styles.container}>
      <main className={styles.main}>
      <article className="max-w-xl mx-auto py-8">
        <div className="text-center mb-8">
          <time dateTime={post.date} className="text-xs text-gray-600 mb-1">
            {format(parseISO(post.date), "LLLL d, yyyy")}
          </time>
          <h2>{post.title}</h2>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
      </article>

      </main>
      </div>
    </>
  );
};

export default PostLayout;