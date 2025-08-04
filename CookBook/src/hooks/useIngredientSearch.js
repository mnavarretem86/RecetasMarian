// src/hooks/useIngredientSearch.js
import { useState, useEffect, useCallback } from 'react';
import { getIngredients } from '../api/api';

export const useIngredientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allIngredients, setAllIngredients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState(null);

  // Carga todos los ingredientes una sola vez al montar el componente
  useEffect(() => {
    const fetchAllIngredients = async () => {
      setIsLoading(true);
      setSearchError(null);
      try {
        const result = await getIngredients();
        if (result.success) {
          setAllIngredients(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        console.error('Error al cargar todos los ingredientes:', err);
        setSearchError('Error al cargar la lista de ingredientes. Por favor, recarga la página.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllIngredients();
  }, []);

  // Filtra los ingredientes localmente cada vez que cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) { // Puedes ajustar la longitud mínima
      setSearchResults([]);
      return;
    }

    const filtered = allIngredients.filter(ing =>
      ing.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchTerm, allIngredients]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    searchError,
  };
};