import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

export const getUsuarios = async () => {
  const res = await axios.get(`${API_URL}/api/Usuario`);
  return res.data;
};

export const createUsuario = async (data) => {
  const res = await axios.post(`${API_URL}/api/Usuario`, data);
  return res.data;
};

export const updateUsuario = async (id, data) => {
  const res = await axios.put(`${API_URL}/api/Usuario/${id}`, data);
  return res.data;
};