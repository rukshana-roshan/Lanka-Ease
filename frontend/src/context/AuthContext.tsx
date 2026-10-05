import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
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
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
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
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
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
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    isEmailVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lankaease_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.CUSTOMER; // Default demo customer
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('lankaease_token') || 'demo-jwt-token-2026';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lankaease_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lankaease_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('lankaease_token', token);
    } else {
      localStorage.removeItem('lankaease_token');
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('lankaease_user');
    localStorage.removeItem('lankaease_token');
  };

  const updateUser = (partial: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...partial });
    }
  };

  const demoLogin = (role: Role) => {
    login(`demo-token-${role.toLowerCase()}`, DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, updateUser, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
