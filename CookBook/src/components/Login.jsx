import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login({ email, contrasena: password });
      
      if (!result.success) {
  if (result.type === 'CREDENTIALS_ERROR') {
    setError('El correo o la contraseña ingresados son incorrectos.');
    setPassword('');
    document.getElementById('password')?.focus();
  } else {
    setError(result.error);
  }
  return;
}

      
      if (onLogin) onLogin(result.user);
      navigate('/dashboard');
      
    } catch (err) {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
      console.error('Error en el login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      {error && (
        <div className={`error-message ${error.includes('credenciales') ? 'password-error' : ''}`}>
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
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="usuario@ejemplo.com"
            required
            className={error.includes('credenciales') ? 'error-field' : ''}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="••••••••"
            required
            className={error.includes('credenciales') ? 'error-field' : ''}
          />
          {error.includes('credenciales') && (
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