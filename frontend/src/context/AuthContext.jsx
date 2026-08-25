import React, { createContext, useContext, useState } from 'react';
import { login as mockAuthLogin, getMockUserByRole } from '../auth/mockAuth';

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages in-memory authentication state for the MPLADS platform.
 * Persists purely in React state without localStorage/sessionStorage.
 */
export function AuthProvider({ children }) {
  // In-memory user state (defaulting to null so user logs in via /login or quick login)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Log in with email and password
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userProfile = await mockAuthLogin(email, password);
      setUser(userProfile);
      return { success: true, user: userProfile };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quick demo switcher: directly log in as a specific role or user object
   */
  const loginAsRole = (roleOrUser) => {
    if (typeof roleOrUser === 'string') {
      const matched = getMockUserByRole(roleOrUser);
      if (matched) {
        setUser(matched);
        return matched;
      }
    } else if (roleOrUser && typeof roleOrUser === 'object') {
      setUser(roleOrUser);
      return roleOrUser;
    }
    return null;
  };

  /**
   * Log out session
   */
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
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
