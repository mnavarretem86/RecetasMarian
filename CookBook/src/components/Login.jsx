import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/auth';
import {
  ArrowLeft,
  Eye,
  EyeSlash,
  ExclamationCircle,
  ArrowRepeat,
  BoxArrowInRight
} from 'react-bootstrap-icons';

import '../assets/Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const {
    email,
    password,
    error,
    loading,
    showPassword,
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
      <h2>CookBook 2.0</h2>

      {/* VOLVER */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="back-btn"
        style={{ marginBottom: '15px' }}
      >
        <ArrowLeft size={16} />
        Volver a recetas
      </button>

      {error && (
        <div className={`error-message ${error.includes('Email o contraseña') ? 'password-error' : ''}`}>
          <ExclamationCircle size={18} />
          <span>{error}</span>

          {error.includes('conexión') && (
            <button onClick={handleSubmit} className="retry-btn">
              <ArrowRepeat size={16} />
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
              type={showPassword ? 'text' : 'password'}
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
                <EyeSlash size={20} />
              ) : (
                <Eye size={20} />
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
          ) : (
            <>
              <BoxArrowInRight size={16} />
              Ingresar
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;