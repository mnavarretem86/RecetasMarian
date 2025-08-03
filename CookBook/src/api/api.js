// src/api/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:44317';

const parseIngredientes = (ingredientesRaw) =>
  ingredientesRaw.split('\n').filter(i => i.trim()).map((ing, index) => ({
    IngredienteId: 0,
    orden: index + 1,
    nombre: ing.trim(),
    cantidad: 0,
    unidad: ""
  }));

const parsePasos = (pasosRaw) =>
  pasosRaw.split('\n').filter(p => p.trim()).map((paso, index) => ({
    NumeroPaso: index + 1,
    descripcion: paso.trim()
  }));

const handleApiError = (error) => {
  let errorMessage = 'Error desconocido al contactar el servidor';
  if (error.response) {
    errorMessage = error.response.data?.message || 'Error del servidor';
  } else if (error.request) {
    errorMessage = 'No hubo respuesta del servidor.';
  }
  return { success: false, error: errorMessage };
};

export const getRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/RECETAS/list`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Categoria/Categorias`, {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const ingredientesArray = parseIngredientes(recipeData.ingredientes);
    const pasosArray = parsePasos(recipeData.pasos);
    const requestData = {
      recetaId: 0,
      titulo: recipeData.nombre.trim(),
      descripcion: recipeData.descripcion.trim(),
      tiempoPreparacion: parseInt(recipeData.tiempo) || 0,
      usuarioId: recipeData.usuarioId || 1,
      categoriaId: recipeData.categoriaId || 1,
      jsonIngredientes: JSON.stringify(ingredientesArray),
      jsonPasos: JSON.stringify(pasosArray)
    };
    const response = await axios.post(`${API_URL}/api/RECETAS/create`, requestData, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error en createRecipe:', error);
    return handleApiError(error);
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/RECETAS/delete`, {
      params: { id: recipeId },
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    if (response.status === 200) {
      return { success: true };
    }
    return handleApiError({ response });
  } catch (error) {
    console.error('Error en deleteRecipe:', { response: error.response?.data });
    return handleApiError(error);
  }
};