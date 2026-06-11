import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return <Dashboard user={user} onLogout={logout} />;
};

export default DashboardPage;
