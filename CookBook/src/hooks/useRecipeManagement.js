// src/hooks/useRecipeManagement.js
import { useState, useEffect, useCallback } from 'react';
import { getRecipes, createRecipe, deleteRecipe, getCategories, updateRecipe, getDifficulties } from '../api/api';

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

const mapApiRecipeToLocal = (apiRecipe, categories) => {
 const categoriaObj = categories.find(cat => cat.nombre === apiRecipe.categoria);
 const categoriaId = categoriaObj ? categoriaObj.categoriaId : apiRecipe.categoriaId || 1;

 return {
  id: apiRecipe.recetaId,
  nombre: apiRecipe.titulo,
  ingredientes: parseIngredientsString(apiRecipe.ingredientes),
  tiempo: apiRecipe.tiempoPreparacion,
  dificultad: apiRecipe.dificultad || "Media",
  categoria: apiRecipe.categoria,
  categoriaId: categoriaId,
  usuario: apiRecipe.usuario || apiRecipe.nombreCompletoUsuario,
  descripcion: apiRecipe.descripcionReceta || '',
  pasos: parsePasosString(apiRecipe.pasos),
 };
};

export const useRecipeManagement = (user) => {
 const [recipes, setRecipes] = useState([]);
 const [categories, setCategories] = useState([]);
 const [difficulties, setDifficulties] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState(null);
 const [searchTerm, setSearchTerm] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentRecipe, setCurrentRecipe] = useState(null);
 const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

 const loadData = useCallback(async () => {
  try {
   setIsLoading(true);
   const [recipesResult, categoriesResult, difficultiesResult] = await Promise.all([
    getRecipes(),
    getCategories(),
    getDifficulties(),
   ]);

   if (!recipesResult.success) throw new Error(recipesResult.error);
   if (!categoriesResult.success) throw new Error(categoriesResult.error);
   if (!difficultiesResult.success) throw new Error(difficultiesResult.error);

   const fetchedCategories = categoriesResult.data;
   const fetchedDifficulties = difficultiesResult.data;
   const mappedRecipes = recipesResult.data.map(recipe => mapApiRecipeToLocal(recipe, fetchedCategories));
   
   setRecipes(mappedRecipes);
   setCategories(fetchedCategories);
   setDifficulties(fetchedDifficulties);
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
   ingredientes: [],
   tiempo: '',
   dificultad: '', 
   categoriaId: '',
   usuarioId: user?.id || 1,
   descripcion: '',
   pasos: [],
  });
  setIsModalOpen(true);
 };

 const handleEditRecipe = (recipe) => {
  setCurrentRecipe({
   ...recipe,
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
   
   const dificultad = difficulties.find(d => d.nombre === currentRecipe.dificultad);
   if (!dificultad) throw new Error('Dificultad no encontrada.');

   let result;
   if (currentRecipe.id) {
    result = await updateRecipe({ ...currentRecipe, dificultadId: dificultad.dificultadId });
   } else {
    result = await createRecipe({ ...currentRecipe, dificultadId: dificultad.dificultadId });
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
  difficulties,
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