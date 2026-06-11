import React, { useState } from 'react';
import { LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Navbar({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    onLogout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <h1>Task Manager</h1>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu-desktop">
          {/* Theme Toggle */}
          <button
            className="navbar-icon-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Profile */}
          {user && (
            <div className="navbar-profile">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="navbar-avatar"
                title={user.name}
              />
              <div className="navbar-user-info">
                <p className="navbar-user-name">{user.name}</p>
                <p className="navbar-user-email">{user.email}</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            className="navbar-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="navbar-menu-mobile">
          {/* User Profile Mobile */}
          {user && (
            <div className="navbar-profile-mobile">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="navbar-avatar-mobile"
              />
              <div className="navbar-user-info-mobile">
                <p className="navbar-user-name-mobile">{user.name}</p>
                <p className="navbar-user-email-mobile">{user.email}</p>
              </div>
            </div>
          )}

          <div className="navbar-mobile-actions">
            {/* Theme Toggle Mobile */}
            <button
              className="navbar-mobile-btn"
              onClick={() => {
                toggleTheme();
              }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* Logout Mobile */}
            <button
              className="navbar-mobile-btn navbar-logout-btn-mobile"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
