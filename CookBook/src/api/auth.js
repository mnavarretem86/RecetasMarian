import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

export const ERROR_TYPES = {
NETWORK_ERROR: 'NETWORK_ERROR',
SERVER_ERROR: 'SERVER_ERROR',
CREDENTIALS_ERROR: 'CREDENTIALS_ERROR',
UNKNOWN_ERROR: 'UNKNOWN_ERROR'
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
 const response = await axios.post(`${API_URL}/api/Usuario/IniciarSesion`, { email, contrasena }, { timeout: 10000, validateStatus: (status) => status < 500 });
 
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
 
 if (!parsedData || typeof parsedData !== 'object') {
  throw new Error('Datos de usuario inválidos');
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