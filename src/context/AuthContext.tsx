import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, FitnessLevel } from '../types/index.js';
import { api } from '../services/api.js';
import { soundFx } from '../utils/audio.js';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, passwordPlain: string) => Promise<void>;
  register: (email: string, passwordPlain: string, name: string, fitnessLevel?: FitnessLevel) => Promise<void>;
  quickDemoLogin: (role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      soundFx.enabled = data.user.soundEnabled ?? true;
    } catch {
      // If session expired or invalid, clear token
      api.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      refreshUser();
    } else {
      // Automatically log into demo user on initial load for immediate frictionless access
      quickDemoLogin('user').catch(() => {
        setLoading(false);
      });
    }
  }, []);

  const login = async (email: string, passwordPlain: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, passwordPlain);
      setUser(res.user);
      soundFx.enabled = res.user.soundEnabled ?? true;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, passwordPlain: string, name: string, fitnessLevel?: FitnessLevel) => {
    setLoading(true);
    try {
      const res = await api.register(email, passwordPlain, name, fitnessLevel);
      setUser(res.user);
      soundFx.enabled = res.user.soundEnabled ?? true;
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role: 'user' | 'admin' = 'user') => {
    setLoading(true);
    try {
      const email = role === 'admin' ? 'admin@spotfit.app' : 'demo@spotfit.app';
      const password = role === 'admin' ? 'admin123' : 'password123';
      const res = await api.login(email, password);
      setUser(res.user);
      soundFx.enabled = res.user.soundEnabled ?? true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
    soundFx.enabled = res.user.soundEnabled ?? true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        quickDemoLogin,
        logout,
        updateProfile,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
