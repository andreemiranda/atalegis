
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createAuth0Client, Auth0Client, User } from '@auth0/auth0-spa-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const domain = process.env.AUTH0_DOMAIN;
      const clientId = process.env.AUTH0_CLIENT_ID;

      if (!domain || !clientId) {
        console.warn("Configurações Auth0 ausentes. Verifique as variáveis de ambiente.");
        setLoading(false);
        return;
      }

      try {
        const client = await createAuth0Client({
          domain: domain,
          clientId: clientId,
          authorizationParams: {
            redirect_uri: window.location.origin,
            scope: 'openid profile email offline_access'
          },
          cacheLocation: 'localstorage',
          useRefreshTokens: true
        });

        setAuth0Client(client);

        const params = new URLSearchParams(window.location.search);
        if (params.has("code") && params.has("state")) {
          await client.handleRedirectCallback();
          window.history.replaceState({}, document.title, window.location.origin);
        }

        const isAuth = await client.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          const userProfile = await client.getUser();
          setUser(userProfile || null);
        }
      } catch (error) {
        console.error("Auth0 Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth0();
  }, []);

  const signIn = async () => {
    if (!auth0Client) return;
    try {
      await auth0Client.loginWithRedirect();
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const signOut = () => {
    if (!auth0Client) return;
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
