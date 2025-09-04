import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you would validate the token with the server
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would make an API call here
      const mockUser = {
        id: '1',
        email,
        name: 'Test User',
        role: 'user'
      };
      
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // In a real app, you would make an API call here
      const mockUser = {
        id: '1',
        email,
        name,
        role: 'user'
      };
      
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 