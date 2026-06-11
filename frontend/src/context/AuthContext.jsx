import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      if (api.isAuthenticated()) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          setError(null);
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          api.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.login(email, password, rememberMe);

      // Login should authenticate the user
      setUser(data.user);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.register(name, email, password);

      // DO NOT LOGIN USER AFTER REGISTRATION
      // No setUser() here

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};