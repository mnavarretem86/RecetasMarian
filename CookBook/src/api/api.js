import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5090';

// --- FUNCIONES DE PARSEO CORREGIDAS PARA MATCHEAR EL SP ---
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
// --- FIN DE FUNCIONES DE PARSEO ---

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
    const response = await axios.get(`${API_URL}/api/Categoria`, {
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

export const getIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/Ingrediente`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
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
    const response = await axios.get(`${API_URL}/api/Ingrediente/search?nombre=${encodeURIComponent(term.trim())}`);
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
      JsonIngredientes: JSON.stringify(ingredientesArray),
      JsonPasos: JSON.stringify(pasosArray)
    };

    const response = await axios.post(`${API_URL}/api/RECETAS/create`, requestData, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
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
      JsonIngredientes: JSON.stringify(ingredientesArray),
      JsonPasos: JSON.stringify(pasosArray)
    };

    const response = await axios.put(`${API_URL}/api/RECETAS/update`, requestData, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
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
    return handleApiError(error);
  }
};