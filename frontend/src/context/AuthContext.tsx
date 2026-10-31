import { useQueryClient } from '@tanstack/react-query';
import { hydrateDemoRecords } from '../services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { DEMO_ENABLED, sessionValue } from '../services/session';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  login: (token: string, user: User, remember?: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  demoLogin: (role: Role) => void;
}

const DEMO_USERS: Record<Role, User> = {
  CUSTOMER: {
    id: 2,
    fullName: 'Kamal Perera',
    email: 'customer@lankaease.lk',
    phone: '+94772345678',
    role: 'CUSTOMER',
    preferredLanguage: 'en',
    profileImage: '/images/avatars/person-5.svg',
    isEmailVerified: true,
    createdAt: '2026-01-15T00:00:00Z',
  },
  PROVIDER: {
    id: 3,
    fullName: 'Kasun Fernando',
    email: 'kasun@lankaease.lk',
    phone: '+94773456789',
    role: 'PROVIDER',
    preferredLanguage: 'si',
    profileImage: '/images/avatars/person-1.svg',
    isEmailVerified: true,
    createdAt: '2026-02-10T00:00:00Z',
  },
  ADMIN: {
    id: 1,
    fullName: 'System Admin',
    email: 'admin@lankaease.lk',
    phone: '+94771234567',
    role: 'ADMIN',
    preferredLanguage: 'en',
    profileImage: '/images/avatars/person-1.svg',
    isEmailVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionValue('lankaease_user');
    if (!saved) return null;
    try {
      const candidate = JSON.parse(saved);
      const token = sessionValue('lankaease_token');
      if (!token || !candidate || !['CUSTOMER', 'PROVIDER', 'ADMIN'].includes(candidate.role) || typeof candidate.id !== 'number') return null;
      if (token.startsWith('demo-token-')) return DEMO_ENABLED ? candidate : null;
      const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return claims.exp * 1000 > Date.now() ? candidate : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return sessionValue('lankaease_token') || null;
  });

  const [remember, setRemember] = useState(() => !!localStorage.getItem('lankaease_token'));
  useEffect(() => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem('lankaease_user'); storage.removeItem('lankaease_token');
    }
    if (user && token) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('lankaease_user', JSON.stringify(user)); storage.setItem('lankaease_token', token);
    }
  }, [user, token, remember]);

  const login = (newToken: string, newUser: User, persist = true) => {
    for (const storage of [localStorage, sessionStorage]) { storage.removeItem('lankaease_user'); storage.removeItem('lankaease_token'); }
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem('lankaease_user', JSON.stringify(newUser)); storage.setItem('lankaease_token', newToken);
    if (newToken.startsWith('demo-token-')) hydrateDemoRecords();
    queryClient.clear();
    setRemember(persist); setToken(newToken); setUser(newUser);
  };

  const logout = () => {
    queryClient.clear();
    setToken(null);
    setUser(null);
    localStorage.removeItem('lankaease_user');
    localStorage.removeItem('lankaease_token');
    sessionStorage.removeItem('lankaease_user'); sessionStorage.removeItem('lankaease_token');
  };

  const updateUser = (partial: Partial<User>) => {
    setUser(previous => previous ? { ...previous, ...partial } : null);
  };

  const demoLogin = (role: Role) => {
    if (!DEMO_ENABLED) throw new Error("Demo sign-in is disabled for this deployment.");
    login(`demo-token-${role.toLowerCase()}`, DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user && !!token, isDemo: !!user && DEMO_ENABLED && !!token?.startsWith('demo-token-'), login, logout, updateUser, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
