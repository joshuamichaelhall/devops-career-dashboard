import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

/**
 * Protected route component that redirects to login page if user is not authenticated
 * Can also require admin access if adminRequired prop is true
 */
const ProtectedRoute = ({ children, adminRequired = false }) => {
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  
  // If admin access is required, check if user is admin
  if (adminRequired && !isAdmin()) {
    return <Navigate to="/unauthorized" />;
  }
  
  // If not authenticated, redirect to login page
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  
  // User is authenticated, render children
  return children;
};

export default ProtectedRoute;