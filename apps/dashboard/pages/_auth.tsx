import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

import Auth from './auth';

export const withPasswordProtect = (App: any) => {
  const ProtectedApp = ({ Component, pageProps, ...props }: AppProps) => {
    const [isAuthenticated, setAuthenticated] = useState<undefined | boolean>(
      undefined
    );
    const checkIfLoggedIn = async () => {
      try {
        const res = await fetch('/api/check-password', {
          credentials: 'include',
        });

        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (e) {
        setAuthenticated(false);
      }
    };

    useEffect(() => {
      checkIfLoggedIn();
    }, []);

    if (isAuthenticated === undefined) {
      return null;
    }

    const bypassProtection = process.env.DISABLE_AUTH === 'true';
    if (isAuthenticated || bypassProtection) {
      return <App Component={Component} pageProps={pageProps} {...props} />;
    }

    return <Auth />;
  };

  return ProtectedApp;
};
