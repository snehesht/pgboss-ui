import { useAuth } from '../auth-provider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { authenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing) {
      if (!authenticated) {
        router.push('/auth');
      }
    }
  }, [initializing, router, authenticated]);

  if (initializing) {
    return null;
  }
  if (!initializing) {
    return <>{children}</>;
  }
  return null;
}
