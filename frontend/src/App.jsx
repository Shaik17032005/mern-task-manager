import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { api } from './api';

export default function App() {
  const [page, setPage] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Restore user session on mount if token exists
  useEffect(() => {
    const checkSession = async () => {
      if (api.isAuthenticated()) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          setPage('dashboard');
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          api.logout();
          setPage('login');
        }
      } else {
        setPage('login');
      }
      setInitializing(false);
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setPage('dashboard');
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    setPage('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setPage('login');
  };

  if (initializing) {
    return (
      <div className="loading-wrapper" style={{ height: '100vh' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
          Restoring session...
        </p>
      </div>
    );
  }

  return (
    <>
      {page === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          navigateToRegister={() => setPage('register')} 
        />
      )}
      {page === 'register' && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          navigateToLogin={() => setPage('login')} 
        />
      )}
      {page === 'dashboard' && user && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}
