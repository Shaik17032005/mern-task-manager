import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

export default function Register({ onRegisterSuccess, navigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const calculatePasswordStrength = (value) => {
    if (!value) return '';
    if (value.length > 12 && /[A-Z]/.test(value) && /[0-9]/.test(value)) return 'Strong';
    if (value.length >= 8) return 'Medium';
    return 'Weak';
  };

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const data = await api.register(name.trim(), email, password);
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="glass-card auth-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to start organizing your schedule</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-container">
              <User className="search-icon" size={18} style={{ left: '0.85rem' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) {
                    setValidationErrors(prev => ({ ...prev, name: '' }));
                  }
                }}
              />
            </div>
            {validationErrors.name && (
              <span className="form-error">
                <AlertCircle size={12} /> {validationErrors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <Mail className="search-icon" size={18} style={{ left: '0.85rem' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
              />
            </div>
            {validationErrors.email && (
              <span className="form-error">
                <AlertCircle size={12} /> {validationErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <Lock className="search-icon" size={18} style={{ left: '0.85rem' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordStrength(calculatePasswordStrength(e.target.value));
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
              />
              <button
                type="button"
                className="action-btn"
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {validationErrors.password && (
              <span className="form-error">
                <AlertCircle size={12} /> {validationErrors.password}
              </span>
            )}
            {passwordStrength && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password strength: {passwordStrength}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-container">
              <Lock className="search-icon" size={18} style={{ left: '0.85rem' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }
                }}
              />
            </div>
            {validationErrors.confirmPassword && (
              <span className="form-error">
                <AlertCircle size={12} /> {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <div className="spinner-sm"></div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <a
            href="#"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              navigateToLogin();
            }}
          >
            Login here
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}
