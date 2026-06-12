import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { loginUser, registerUser } from '../services/mockData';
import type { AuthUser } from '../types';

const AUTH_KEY = 'marlbtime_auth_user';

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isPlatformAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const persistUser = useCallback((authUser: AuthUser | null) => {
    if (authUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
    setUser(authUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const authUser = loginUser(email, password);
    if (!authUser) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }
    persistUser(authUser);
    return { success: true };
  }, [persistUser]);

  const register = useCallback(
    async (data: { name: string; email: string; password: string; phone: string }) => {
      await new Promise((r) => setTimeout(r, 400));
      const result = registerUser(data);
      if (!result.success || !result.user) {
        return { success: false, error: result.error };
      }
      persistUser(result.user);
      return { success: true };
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isPlatformAdmin: user?.role === 'platform_admin',
    }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
