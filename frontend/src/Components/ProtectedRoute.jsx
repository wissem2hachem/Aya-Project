import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRoles }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions for the requested route
  if (requiredRoles && !hasPermission(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the child route elements
  return <Outlet />;
};

export default ProtectedRoute; 