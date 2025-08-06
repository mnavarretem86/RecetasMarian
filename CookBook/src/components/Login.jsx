// src/components/Login.jsx
import React from 'react';
import { useLogin } from '../api/auth';
import '../assets/Login.css';

const Login = ({ onLogin }) => {
  const {
    email,
    password,
    error,
    loading,
    showPassword,
    setEmail,
    setPassword,
    setError,
    setShowPassword,
    handleEmailChange,
    handleEmailKeyDown,
    handleEmailPaste,
    handleSubmit,
  } = useLogin(onLogin);

  return (
    <div className="login-container">
      <h2>CookBook</h2>

      {error && (
        <div className={`error-message ${error.includes('Email o contraseña') ? 'password-error' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
          {error.includes('conexión') && (
            <button onClick={handleSubmit} className="retry-btn">
              Reintentar
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleEmailKeyDown}
            onPaste={handleEmailPaste}
            placeholder="mjarquin@udem.edu.ni"
            required
            aria-invalid={!!error}
            className={error ? 'error-field' : ''}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
              aria-invalid={!!error}
              className={error ? 'error-field' : ''}
              autoComplete="current-password"
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.91 4.24A9.09 9.09 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.94 3.19m-8.49-.66A4 4 0 0 1 8 12.001a4.01 4.01 0 0 1 4-4c.71 0 1.37.2 1.95.55"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </div>
          {error.includes('Email o contraseña') && (
            <p className="hint-message">
              ¿Olvidaste tu contraseña?{' '}
              <a href="/recuperar-contrasena" className="recovery-link">
                Recupérala aquí
              </a>
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Verificando...
            </>
          ) : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;