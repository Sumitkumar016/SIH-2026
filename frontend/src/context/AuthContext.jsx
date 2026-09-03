import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import { setAuthToken } from '../api/apiClient';

const AuthContext = createContext(null);

const ROLE_DEFAULT_PATHS = {
  ministry: '/ministry/overview',
  mp: '/mp/overview',
  district: '/district/overview',
  state: '/state/overview',
  auditor: '/auditor/queue',
};

/**
 * Enriches the backend user payload with UI route defaults
 */
const enrichUser = (userProfile) => {
  if (!userProfile) return null;
  return {
    ...userProfile,
    defaultPath: ROLE_DEFAULT_PATHS[userProfile.role] || '/ministry/overview',
  };
};

/**
 * AuthProvider Component
 * Manages in-memory authentication state for the MPLADS platform.
 * Persists purely in React memory without localStorage / sessionStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // If in-memory token exists on mount/refresh, verify session with backend
  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((userData) => {
          setUser(enrichUser(userData));
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  /**
   * Log in with email and password via backend REST API
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      setAuthToken(res.token);
      const enriched = enrichUser(res.user);
      setUser(enriched);
      return { success: true, user: enriched, token: res.token };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quick demo switcher: calls real backend login with demo user credentials
   * @param {{ email: string, password: string }} demoUser
   */
  const loginAsRole = async (demoUser) => {
    if (demoUser?.email && demoUser?.password) {
      return await login(demoUser.email, demoUser.password);
    }
    return { success: false, error: 'Demo user credentials missing.' };
  };

  /**
   * Log out session and clear all in-memory tokens
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    loginAsRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext throughout the application
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
