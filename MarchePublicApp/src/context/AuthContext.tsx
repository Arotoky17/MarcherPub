import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// Lightweight storage shim using globalThis for environments without AsyncStorage
const store: { auth?: string } = {};
const AsyncStorage = {
  async getItem(key: string) {
    return store[key as keyof typeof store] ?? null;
  },
  async setItem(key: string, value: string) {
    // @ts-ignore
    store[key] = value;
  },
  async removeItem(key: string) {
    // @ts-ignore
    delete store[key];
  },
};
import { setAuthToken } from '../api/client';

type UserRole = 'entreprise' | 'ministere' | 'admin' | 'ministerepublique' | 'user' | string;

type AuthUser = {
  id?: number;
  username?: string;
  email?: string;
  role?: UserRole;
  companyName?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: { token: string; user: AuthUser }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user || null);
          setToken(parsed.token || null);
          setAuthToken(parsed.token || undefined);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async ({ token, user }: { token: string; user: AuthUser }) => {
    setToken(token);
    setUser(user);
    setAuthToken(token);
    await AsyncStorage.setItem('auth', JSON.stringify({ token, user }));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setAuthToken(undefined);
    await AsyncStorage.removeItem('auth');
  }, []);

  const value = useMemo(() => ({ user, token, isLoading, login, logout }), [user, token, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


