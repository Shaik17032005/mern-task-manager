import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-wrapper" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          Loading...
        </p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
