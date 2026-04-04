// src/api/api.js
import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

const DEFAULT_TIMEOUT = 10000;

const parsePasosArray = (pasosArray = []) =>
  pasosArray.map((paso, index) => ({
    NumeroPaso: index + 1,
    Descripcion: paso.descripcion.trim(),
  }));

const parseIngredientesArray = (ingredientesArray = []) =>
  ingredientesArray.map((ing) => ({
    IngredienteId: ing.id,
    Cantidad: parseFloat(ing.cantidad) || 0,
  }));

const cleanMessage = (msg) => {
  if (!msg) return 'Error desconocido al contactar el servidor';
  return String(msg).replace(/^Error:\s*/i, '').trim();
};

const handleApiError = (error) => {
  let errorMessage = 'Error desconocido al contactar el servidor';

  if (axios.isCancel(error)) {
    errorMessage = 'La petición ha sido cancelada.';
  } else if (error.response) {
    errorMessage =
      error.response.data?.message ||
      error.response.data?.title ||
      'Error del servidor';
  } else if (error.request) {
    errorMessage = 'No hay Recetas :(';
  } else {
    errorMessage = error.message;
  }

  errorMessage = cleanMessage(errorMessage);

  console.error('API Error:', errorMessage, error.response);
  return { success: false, error: errorMessage };
};

const apiRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

const buildRecipePayload = (recipeData) => {
  const pasosArray = parsePasosArray(recipeData.pasos);
  const ingredientesArray = parseIngredientesArray(recipeData.ingredientes);

  return {
    Titulo: recipeData.nombre.trim(),
    Descripcion: recipeData.descripcion.trim(),
    TiempoPreparacion: parseInt(recipeData.tiempo) || 0,
    UsuarioId: recipeData.usuarioId || 1,
    CategoriaId: recipeData.categoriaId || 1,
    DificultadId: recipeData.dificultadId,
    JsonIngredientes: JSON.stringify(ingredientesArray),
    JsonPasos: JSON.stringify(pasosArray),
  };
};

export const getRecipes = () =>
  apiRequest(() =>
    axiosInstance.get('/api/RECETAS/list', {
      timeout: DEFAULT_TIMEOUT,
    })
  );

export const getCategories = () =>
  apiRequest(() =>
    axiosInstance.get('/api/Categoria', {
      timeout: DEFAULT_TIMEOUT,
    })
  );

export const getIngredients = () =>
  apiRequest(() =>
    axiosInstance.get('/api/Ingrediente', {
      timeout: DEFAULT_TIMEOUT,
    })
  );

export const getDifficulties = () =>
  apiRequest(() =>
    axiosInstance.get('/api/Dificultad', {
      timeout: DEFAULT_TIMEOUT,
    })
  );

export const searchIngredients = async (term) => {
  if (!term || term.trim() === '') {
    return {
      success: false,
      error: 'Término de búsqueda no puede estar vacío.',
    };
  }

  return apiRequest(() =>
    axiosInstance.get(
      `/api/Ingrediente/search?nombre=${encodeURIComponent(term.trim())}`,
      {
        timeout: DEFAULT_TIMEOUT,
      }
    )
  );
};

export const createRecipe = (recipeData) => {
  const requestData = buildRecipePayload(recipeData);

  return apiRequest(() =>
    axiosInstance.post('/api/RECETAS/create', requestData, {
      timeout: DEFAULT_TIMEOUT,
    })
  );
};

export const updateRecipe = (recipeData) => {
  const requestData = {
    RecetaId: recipeData.id,
    ...buildRecipePayload(recipeData),
  };

  return apiRequest(() =>
    axiosInstance.put('/api/RECETAS/update', requestData, {
      timeout: DEFAULT_TIMEOUT,
    })
  );
};

export const deleteRecipe = async (recipeId) => {
  try {
    const response = await axiosInstance.delete('/api/RECETAS/delete', {
      params: { id: recipeId },
      timeout: DEFAULT_TIMEOUT,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 200) {
      return { success: true };
    }

    return handleApiError({ response });
  } catch (error) {
    return handleApiError(error);
  }
};