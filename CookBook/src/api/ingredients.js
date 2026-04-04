import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

export const getIngredientes = async () => {
  const response = await axios.get(`${API_URL}/api/Ingrediente`);
  return response.data;
};

export const createIngrediente = async (ingrediente) => {
  const response = await axios.post(`${API_URL}/api/Ingrediente`, ingrediente);
  return response.data;
};

export const updateIngrediente = async (id, ingrediente) => {
  const response = await axios.put(`${API_URL}/api/Ingrediente/${id}`, ingrediente);
  return response.data;
};