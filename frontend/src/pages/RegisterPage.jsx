import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Register from '../components/Register';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <Register
      onRegisterSuccess={() => {
        // Show success message and redirect to login
        alert('✅ Registration successful! Please login with your credentials.');
        window.location.href = '/login';
      }}
      navigateToLogin={() => window.location.href = '/login'}
    />
  );
};

export default RegisterPage;
