// src/components/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { useRecipeManagement } from '../hooks/useRecipeManagement';
import RecipeForm from './RecipeForm';
import RecipeTable from './RecipeTable';
import '../assets/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const {
    recipes,
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
  } = useRecipeManagement(user);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage, setRecipesPerPage] = useState(8);

  const filteredAndSearchedRecipes = useMemo(() => {
    let filtered = recipes;

    if (selectedCategory) {
      filtered = filtered.filter((r) => r.categoria === selectedCategory);
    }
    
    if (selectedDifficulty) {
      filtered = filtered.filter((r) => r.dificultad === selectedDifficulty);
    }

    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [recipes, searchTerm, selectedCategory, selectedDifficulty]);

  const totalRecipes = filteredAndSearchedRecipes.length;
  const indexOfLast = currentPage * recipesPerPage;
  const indexOfFirst = indexOfLast - recipesPerPage;
  const currentRecipes = filteredAndSearchedRecipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
    setCurrentPage(1);
  };
  const handleRecipesPerPageChange = (e) => {
    setRecipesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setRecipesPerPage(8);
    setCurrentPage(1);
  };

  if (isLoading) return <div className="loading">Cargando recetas y categorías...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Bienvenido a CookBook</h1>
          <p className="user-info-text">
            Hola, <span className="username">{user?.displayName || 'Usuario'}</span>
          </p>
        </div>
        <div className="header-right">
          <button onClick={handleAddRecipe} className="add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Receta
          </button>
          <button onClick={onLogout} className="logout-btn">Cerrar Sesión</button>
        </div>
      </header>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre de receta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-controls">
          <div className="filter-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 3H2l8 9.46V19l4 3v-10.54L22 3z" />
            </svg>
            <span>Filtros:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.categoriaId} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            className="filter-select"
          >
            <option value="">Todas las dificultades</option>
            {difficulties.map((diff) => (
              <option key={diff.dificultadId} value={diff.nombre}>
                {diff.nombre}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleClearFilters} className="clear-filters-btn">Limpiar filtros</button>
      </div>

      <RecipeTable
        recipes={currentRecipes}
        user={user}
        onEdit={handleEditRecipe}
        onDelete={(recipe) => {
          setCurrentRecipe(recipe);
          setIsDeleteConfirmOpen(true);
        }}
      />

      <div className="pagination-row">
        <div className="entries-per-page">
          <span>Mostrar</span>
          <select
            value={recipesPerPage}
            onChange={handleRecipesPerPageChange}
            className="entries-select"
          >
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entradas</span>
        </div>
        <div className="pagination">
          <button
            className="page-btn arrow-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="page-btn arrow-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{currentRecipe?.id ? 'Editar Receta' : 'Agregar Receta'}</h3>
            <RecipeForm
              currentRecipe={currentRecipe}
              setCurrentRecipe={setCurrentRecipe}
              categories={categories}
              difficulties={difficulties}
              handleSaveRecipe={handleSaveRecipe}
              setIsModalOpen={setIsModalOpen}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
      {isDeleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>¿Eliminar receta?</h3>
            <p>¿Estás seguro que deseas eliminar "{currentRecipe?.nombre}"? Esta acción no se puede deshacer.</p>
            <div className="modal-actions">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="cancel-btn">Cancelar</button>
              <button onClick={() => handleDeleteRecipe(currentRecipe)} className="delete-btn" disabled={isLoading}>
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;