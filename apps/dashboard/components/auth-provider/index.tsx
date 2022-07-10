import {
  useEffect,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';
import Cookie from 'cookie-universal';

export const AuthContext = createContext<
  | {
      initializing: boolean;
      authenticated: boolean;
      error: { message: string };
      setAuthenticated: Dispatch<SetStateAction<boolean>>;
      setInitializing: Dispatch<SetStateAction<boolean>>;
      setError: Dispatch<SetStateAction<{ message: string }>>;
    }
  | undefined
>(undefined);

AuthContext.displayName = 'AuthContext';

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return auth;
}

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [initializing, setInitializing] = useState(true);
  const cookie = Cookie();

  useEffect(() => {
    setInitializing(true);
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
      } catch (error) {
        setAuthenticated(false);
        if (error) {
          setError(error);
        }
      } finally {
        setInitializing(false);
      }
    };

    const token = cookie.get('token');
    if (!token || token === '') {
      setAuthenticated(false);
    }
    checkIfLoggedIn().catch((error) => {
      setError(error);
    });
  }, []);

  const value = {
    error,
    initializing,
    authenticated,
    setAuthenticated,
    setInitializing,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
