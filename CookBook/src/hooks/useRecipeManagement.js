// hooks/useRecipeManagement.js

import { useState, useEffect, useCallback } from 'react';
import { getRecipes, createRecipe, deleteRecipe, getCategories, updateRecipe } from '../api/api';

// FUNCIÓN CORREGIDA para parsear la cadena de ingredientes del API
const parseIngredientsString = (ingredientesString) => {
  if (!ingredientesString) return [];
  try {
    const json = JSON.parse(ingredientesString);
    if (Array.isArray(json)) {
      return json.map(ing => ({
        id: ing.id,
        nombre: ing.nombre || '',
        cantidad: ing.cantidad || 0,
        unidad: ing.unidad || ''
      }));
    }
  } catch (e) {
    console.error("Error al parsear JSON de ingredientes:", e, "Cadena recibida:", ingredientesString);
  }
  return [];
};

// FUNCIÓN CORREGIDA para parsear la cadena de pasos del API
const parsePasosString = (pasosString) => {
  if (!pasosString) return [];
  try {
    const json = JSON.parse(pasosString);
    if (Array.isArray(json)) {
      return json;
    }
  } catch (e) {
    console.error("Error al parsear JSON de pasos:", e, "Cadena recibida:", pasosString);
  }
  return [];
};

const mapApiRecipeToLocal = (apiRecipe) => ({
  id: apiRecipe.recetaId,
  nombre: apiRecipe.titulo,
  ingredientes: parseIngredientsString(apiRecipe.ingredientes), // Parsea aquí
  tiempo: `${apiRecipe.tiempoPreparacion} min`,
  dificultad: apiRecipe.dificultad || "Media",
  categoria: apiRecipe.categoria,
  categoriaId: apiRecipe.categoriaId,
  usuario: apiRecipe.usuario || apiRecipe.nombreCompletoUsuario,
  descripcion: apiRecipe.descripcionReceta || '',
  pasos: parsePasosString(apiRecipe.pasos), // Parsea aquí
});

export const useRecipeManagement = (user) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // Eliminamos los estados separados, ahora todo está en currentRecipe

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [recipesResult, categoriesResult] = await Promise.all([
        getRecipes(),
        getCategories(),
      ]);

      if (!recipesResult.success) throw new Error(recipesResult.error);
      setRecipes(recipesResult.data.map(mapApiRecipeToLocal));

      if (!categoriesResult.success) throw new Error(categoriesResult.error);
      setCategories(categoriesResult.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRecipe = () => {
    setCurrentRecipe({
      id: null,
      nombre: '',
      ingredientes: [], // Ahora es un array vacío
      tiempo: '',
      dificultad: 'Media', // <-- Corrección aquí: valor inicial en string
      categoriaId: categories[0]?.categoriaId || 1,
      usuarioId: user?.id || 1,
      descripcion: '',
      pasos: [], // Ahora es un array vacío
    });
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      tiempo: recipe.tiempo.replace(' min', ''),
    });
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = async (recipe) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await deleteRecipe(recipe.id);
      if (!result.success) throw new Error(result.error);
      setRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      setError(error.message || 'Error desconocido al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!currentRecipe.nombre?.trim()) throw new Error('El nombre de la receta es requerido');

      let result;
      if (currentRecipe.id) {
        result = await updateRecipe(currentRecipe);
      } else {
        result = await createRecipe(currentRecipe);
      }

      if (!result.success) throw new Error(result.error);
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar receta:', error);
      setError(error.message || 'Error al guardar la receta');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    recipes: filteredRecipes,
    categories,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    currentRecipe,
    setCurrentRecipe,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    handleAddRecipe,
    handleEditRecipe,
    handleDeleteRecipe,
    handleSaveRecipe,
    // Eliminamos los estados separados del return
  };
};