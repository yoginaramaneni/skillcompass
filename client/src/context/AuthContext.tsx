import React, { createContext, useState, useEffect } from 'react';
import { AuthState } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('skillcompass_token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('skillcompass_token');
      if (!token) {
        setAuthState((prev) => ({ ...prev, isLoading: false, isAuthenticated: false }));
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.success && response.user) {
          setAuthState({
            user: response.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.token && response.user) {
      localStorage.setItem('skillcompass_token', response.token);
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await authService.register({ email, password, firstName, lastName });
    if (response.success && response.token && response.user) {
      localStorage.setItem('skillcompass_token', response.token);
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('skillcompass_token');
    authService.logout().catch(() => {});
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
