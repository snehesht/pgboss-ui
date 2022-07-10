import './global.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { AuthGuard } from '../components/auth-guard';
import { AuthProvider } from '../components/auth-provider';

function isAuthRequired(): boolean {
  if (process.env.DISABLE_AUTH === 'true') {
    return false;
  }
  return true;
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps }: AppProps = props;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
          key="viewport"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>PgBoss Dashboard</title>
        <meta
          name="description"
          content="Dashboard for pg-boss"
          key="description"
        />
      </Head>
      <AuthProvider>
        {isAuthRequired() ? (
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </>
  );
}
