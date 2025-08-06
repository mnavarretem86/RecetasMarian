import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CREDENTIALS_ERROR: 'CREDENTIALS_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

const handleApiError = (error) => {
  let errorMessage = 'Error desconocido';
  let errorType = ERROR_TYPES.UNKNOWN_ERROR;
  if (error.code === 'ECONNABORTED') {
    errorMessage = 'El servidor no responde. Por favor, intente más tarde';
    errorType = ERROR_TYPES.NETWORK_ERROR;
  } else if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      errorMessage = error.response.data?.message || 'Credenciales incorrectas';
      errorType = ERROR_TYPES.CREDENTIALS_ERROR;
    } else if (status >= 500) {
      errorMessage = 'Error interno del servidor';
      errorType = ERROR_TYPES.SERVER_ERROR;
    } else {
      errorMessage = error.response.data?.message || 'Error en la solicitud';
    }
  } else if (error.request) {
    errorMessage = 'No se pudo conectar al servidor. Verifique su conexión a internet';
    errorType = ERROR_TYPES.NETWORK_ERROR;
  }
  return { success: false, error: errorMessage, type: errorType };
};

export const login = async ({ email, contrasena }) => {
  try {
    const response = await axios.post(`${API_URL}/api/Auth/login`, { email, contrasena }, { timeout: 10000, validateStatus: (status) => status < 500 });
    if (response.status !== 200 || !response.data) {
      return handleApiError({ response });
    }
    sessionStorage.setItem('userData', JSON.stringify(response.data));
    const userData = { ...response.data, displayName: response.data.nombreCompletoUsuario || email.split('@')[0] };
    return { success: true, user: userData };
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifySession = async () => {
  try {
    const userData = sessionStorage.getItem('userData');
    if (!userData) return null;
    const parsedData = JSON.parse(userData);
    if (!parsedData || typeof parsedData !== 'object' || !parsedData.token) {
      throw new Error('Datos de usuario o token inválidos');
    }
    return parsedData;
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    sessionStorage.removeItem('userData');
    return null;
  }
};

export const logout = () => {
  sessionStorage.removeItem('userData');
};
export const useLogin = (onLogin) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
    setEmail(valueWithoutSpaces);
    setError('');
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
    }
  };

  const handleEmailPaste = (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    if (/\s/.test(paste)) {
      e.preventDefault();
    }
  };

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
          setError('Email o contraseña no válidos.');
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

  return {
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
  };
};