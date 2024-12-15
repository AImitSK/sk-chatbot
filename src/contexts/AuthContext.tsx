'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  username: string;
  email: string;
  role: string;
  profileImage: string | null;
}

interface AuthContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Beim ersten Laden prüfen wir den Auth-Status
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
