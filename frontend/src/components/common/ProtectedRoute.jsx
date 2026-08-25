import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Enforces role-based route security across dashboards.
 * 
 * Behavior:
 * 1. Unauthenticated users -> redirected to /login
 * 2. Authenticated users with incorrect role -> redirected to their own role's home dashboard
 * 3. Authenticated users with authorized role -> renders the nested routes (<Outlet />) or children
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and current user's role is not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective role's default dashboard
    const roleDefaultRoutes = {
      ministry: '/ministry/overview',
      mp: '/mp/overview',
      district: '/district/overview',
      state: '/state/overview',
      auditor: '/auditor/queue',
    };

    const targetRoute = roleDefaultRoutes[user.role] || '/login';
    return <Navigate to={targetRoute} replace />;
  }

  return children ? children : <Outlet />;
}
