import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  checkingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        const isJson = res.headers.get('content-type')?.includes('application/json');

        if (res.ok && isJson) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (_) {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Email ou senha incorretos.');
    }

    setIsAuthenticated(true);
  };

  const logout = async () => {
    const response = await fetch('/auth/logout', { method: 'POST', credentials: 'include' });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.message || 'Erro ao fazer logout. Tente novamente.');
      return;
    }

    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
