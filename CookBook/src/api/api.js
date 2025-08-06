import axios from 'axios';
import axiosInstance from './axiosInstance'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

const parsePasosArray = (pasosArray) =>
  pasosArray.map((paso, index) => ({
    NumeroPaso: index + 1,
    Descripcion: paso.descripcion.trim(),
  }));

const parseIngredientesArray = (ingredientesArray) =>
  ingredientesArray.map((ing) => ({
    IngredienteId: ing.id,
    Cantidad: parseFloat(ing.cantidad) || 0,
  }));

const mapDifficultyNameToId = (difficultyName) => {
  switch (difficultyName) {
    case 'Fácil':
      return 1;
    case 'Media':
      return 2;
    case 'Difícil':
    default:
      return 3;
  }
};

const handleApiError = (error) => {
  let errorMessage = 'Error desconocido al contactar el servidor';
  if (axios.isCancel(error)) {
    errorMessage = 'La petición ha sido cancelada.';
  } else if (error.response) {
    errorMessage = error.response.data?.message || error.response.data?.title || 'Error del servidor';
  } else if (error.request) {
    errorMessage = 'No hubo respuesta del servidor. Verifica tu conexión.';
  } else {
    errorMessage = error.message;
  }
  console.error('API Error:', errorMessage, error.response);
  return { success: false, error: errorMessage };
};

export const getRecipes = async () => {
  try {
    const response = await axiosInstance.get('/api/RECETAS/list', {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/api/Categoria', {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getIngredients = async () => {
  try {
    const response = await axiosInstance.get('/api/Ingrediente', {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const searchIngredients = async (term) => {
  try {
    if (!term || term.trim() === '') {
      return { success: false, error: 'Término de búsqueda no puede estar vacío.' };
    }
    const response = await axiosInstance.get(`/api/Ingrediente/search?nombre=${encodeURIComponent(term.trim())}`);
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const pasosArray = parsePasosArray(recipeData.pasos);
    const ingredientesArray = parseIngredientesArray(recipeData.ingredientes);

    const requestData = {
      Titulo: recipeData.nombre.trim(),
      Descripcion: recipeData.descripcion.trim(),
      TiempoPreparacion: parseInt(recipeData.tiempo) || 0,
      UsuarioId: recipeData.usuarioId || 1,
      CategoriaId: recipeData.categoriaId || 1,
      DificultadId: mapDifficultyNameToId(recipeData.dificultad),
      JsonIngredientes: JSON.stringify(ingredientesArray),
      JsonPasos: JSON.stringify(pasosArray)
    };

    const response = await axiosInstance.post('/api/RECETAS/create', requestData, {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateRecipe = async (recipeData) => {
  try {
    const pasosArray = parsePasosArray(recipeData.pasos);
    const ingredientesArray = parseIngredientesArray(recipeData.ingredientes);

    const requestData = {
      RecetaId: recipeData.id,
      Titulo: recipeData.nombre.trim(),
      Descripcion: recipeData.descripcion.trim(),
      TiempoPreparacion: parseInt(recipeData.tiempo) || 0,
      UsuarioId: recipeData.usuarioId || 1,
      CategoriaId: recipeData.categoriaId || 1,
      DificultadId: mapDifficultyNameToId(recipeData.dificultad),
      JsonIngredientes: JSON.stringify(ingredientesArray),
      JsonPasos: JSON.stringify(pasosArray)
    };

    const response = await axiosInstance.put('/api/RECETAS/update', requestData, {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await axiosInstance.delete('/api/RECETAS/delete', {
      params: { id: recipeId },
      timeout: 10000,
      validateStatus: (status) => status < 500
    });
    if (response.status === 200) {
      return { success: true };
    }
    return handleApiError({ response });
  } catch (error) {
    return handleApiError(error);
  }
};