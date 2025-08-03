// src/hooks/useRecipeManagement.js
import { useState, useEffect, useCallback } from 'react';
import { getRecipes, createRecipe, deleteRecipe, getCategories } from '../api/api';

const mapApiRecipeToLocal = (apiRecipe) => ({
  id: apiRecipe.recetaId,
  nombre: apiRecipe.titulo,
  ingredientes: apiRecipe.ingredientes || apiRecipe.descripcionReceta || '',
  tiempo: `${apiRecipe.tiempoPreparacion} min`,
  dificultad: "Media", 
  categoria: apiRecipe.categoria,
  categoriaId: apiRecipe.categoriaId, // Asegúrate de tener este campo
  usuario: apiRecipe.usuario || apiRecipe.nombreCompletoUsuario,
  descripcion: apiRecipe.descripcionReceta || '',
  pasos: apiRecipe.pasos || ''
});

export const useRecipeManagement = (user) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]); // Nuevo estado para categorías
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [recipesResult, categoriesResult] = await Promise.all([
        getRecipes(),
        getCategories()
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
      ingredientes: '',
      tiempo: '',
      dificultad: 'Media',
      categoriaId: categories[0]?.categoriaId || 1,
      usuarioId: user?.id || 1,
      descripcion: '',
      pasos: ''
    });
    setIsModalOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      tiempo: recipe.tiempo.replace(' min', '')
    });
    setIsModalOpen(true);
  };

  const handleDeleteRecipe = async (recipe) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await deleteRecipe(recipe.id);
      if (!result.success) throw new Error(result.error);
      setRecipes(prev => prev.filter(r => r.id !== recipe.id));
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
      const result = await createRecipe(currentRecipe);
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

  const filteredRecipes = recipes.filter(recipe =>
    recipe.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    recipes: filteredRecipes,
    categories, // ¡Ahora esto está disponible!
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
  };
};