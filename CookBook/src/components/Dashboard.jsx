import React from 'react';
import { useRecipeManagement } from '../hooks/useRecipeManagement';
import RecipeForm from '../components/RecipeForm';
import RecipeTable from '../components/RecipeTable';
import '../assets/Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const {
    recipes,
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
  } = useRecipeManagement(user);

  if (isLoading) return <div className="loading">Cargando recetas y categorías...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Bienvenido a CookBook</h1>
        </div>
        <div className="header-right">
          <p className="user-info-text">
            Hola, <span className="username">{user?.displayName || 'Usuario'}</span>
          </p>
          <button onClick={onLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {error && <div className="error-message">Error: {error}</div>}

      <div className="dashboard-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button onClick={handleAddRecipe} className="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar Receta
        </button>
      </div>

      <RecipeTable
        recipes={recipes}
        user={user}
        onEdit={handleEditRecipe}
        onDelete={(recipe) => {
          setCurrentRecipe(recipe);
          setIsDeleteConfirmOpen(true);
        }}
      />

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{currentRecipe?.id ? 'Editar Receta' : 'Agregar Receta'}</h3>
            <RecipeForm
              currentRecipe={currentRecipe}
              setCurrentRecipe={setCurrentRecipe}
              categories={categories}
            />
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancelar</button>
              <button onClick={handleSaveRecipe} className="save-btn" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
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