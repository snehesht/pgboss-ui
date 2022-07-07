import { AppProps } from 'next/app';
import Head from 'next/head';
import './global.css';
import { withPasswordProtect } from './_auth';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to dashboard!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default withPasswordProtect(CustomApp);
