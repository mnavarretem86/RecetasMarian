import React from 'react';
import '../assets/RecipeTable.css';


const RecipeTable = ({ recipes, onEdit, onDelete, user }) => {
  return (
    <div className="recipes-table-container">
      {recipes.length > 0 ? (
        <table className="recipes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Tiempo</th>
              <th>Dificultad</th>
              <th>Categoría</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(recipe => (
              <tr key={recipe.id}>
                <td>{recipe.nombre}</td>
                <td>{recipe.ingredientes || recipe.descripcion}</td>
                <td>
                  <span className={`time-badge ${recipe.tiempo.includes('15') ? 'fast' : ''}`}>
                    {recipe.tiempo}
                  </span>
                </td>
                <td>
                  <span className={`difficulty-badge ${recipe.dificultad.toLowerCase()}`}>
                    {recipe.dificultad}
                  </span>
                </td>
                <td>
                  <span className="category-tag">
                    {recipe.categoria}
                  </span>
                </td>
                <td>
                  {recipe.usuario || user?.displayName || 'Anónimo'}
                </td>
                <td className="actions-cell">
                  <button 
                    onClick={() => onEdit(recipe)}
                    className="action-btn edit-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(recipe)}
                    className="action-btn delete-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <p>No se encontraron recetas. ¡Empieza a agregar la primera!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeTable;