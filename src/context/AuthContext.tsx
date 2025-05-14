import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  providers: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (provider: string) => void;
  logout: () => void;
  getAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthStatus = async (): Promise<boolean> => {
    try {
      const response = await api.get('/auth/status');
      setUser(response.data.user);
      return true;
    } catch (err) {
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  const login = (provider: string) => {
    setIsLoading(true);
    setError(null);

    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/${provider}`;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    getAuthStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}