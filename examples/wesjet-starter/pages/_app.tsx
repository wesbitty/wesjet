import '../styles/globals.css'
import Head from 'next/head'
import { Header } from '../components/Header'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Create Wesjet App</title>
        <link rel="icon" type="image/x-icon" href="/favicon.png" />
      </Head>

      <Header />

    <Component {...pageProps} />
    </>
  )
}