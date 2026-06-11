import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from '../components/Login';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return <Login onLoginSuccess={() => window.location.href = '/dashboard'} navigateToRegister={() => window.location.href = '/register'} />;
};

export default LoginPage;
