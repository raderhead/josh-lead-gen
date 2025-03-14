
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'agent' | 'admin';
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login request - in a real app, this would be an API call
    setIsLoading(true);
    try {
      // In a real application, validate credentials with a backend
      // For now, we'll simulate successful login for any non-empty credentials
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Create a mock user
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        role: 'user',
      };

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real application, send data to a backend API
      // For now, we'll simulate successful signup
      if (!email || !name || !password) {
        throw new Error('All fields are required');
      }

      // Create a new user
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: 'user',
      };

      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
