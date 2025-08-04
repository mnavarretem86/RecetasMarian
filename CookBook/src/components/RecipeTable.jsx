import React from 'react';
import '../assets/RecipeTable.css';

const RecipeTable = ({ recipes, onEdit, user }) => {
  return (
    <div className="recipes-grid">
      {recipes.length > 0 ? (
        recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <div className="card-header">
              <h3 className="card-title">{recipe.nombre}</h3>
              <div className="card-actions">
                <button 
                  onClick={() => onEdit(recipe)}
                  className="action-btn edit-btn"
                  aria-label={`Editar ${recipe.nombre}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="card-detail">
                <strong>Categoría:</strong> <span className="category-tag">{recipe.categoria}</span>
              </p>
              <p className="card-detail">
                <strong>Tiempo:</strong> <span className={`time-badge ${recipe.tiempo.includes('15') ? 'fast' : ''}`}>{recipe.tiempo}</span>
              </p>
              <p className="card-detail">
                <strong>Dificultad:</strong> <span className={`difficulty-badge ${recipe.dificultad.toLowerCase()}`}>
                  {recipe.dificultad}
                </span>
              </p>
              <p className="card-detail card-description">
                <strong>Descripción:</strong> {recipe.descripcion}
              </p>

              {/* Lista de Ingredientes (CORREGIDA) */}
              <div className="card-section">
                <strong>Ingredientes:</strong>
                {recipe.ingredientes && Array.isArray(recipe.ingredientes) && recipe.ingredientes.length > 0 ? (
                  <ul>
                    {recipe.ingredientes.map((ingrediente, index) => (
                      <li key={index}>
                        {ingrediente.nombre} ({ingrediente.cantidad} {ingrediente.unidad})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-data">No especificados</p>
                )}
              </div>

              {/* Lista de Pasos (CORREGIDA) */}
              <div className="card-section">
                <strong>Pasos:</strong>
                {recipe.pasos && Array.isArray(recipe.pasos) && recipe.pasos.length > 0 ? (
                  <ol>
                    {recipe.pasos.map((paso, index) => (
                      <li key={index}>{paso.descripcion}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="no-data">No especificados</p>
                )}
              </div>
              
              <p className="card-detail">
                <strong>Autor:</strong> {recipe.usuario || user?.displayName || 'Anónimo'}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <p>No se encontraron recetas. ¡Empieza a agregar la primera!</p>
        </div>
      )}
    </div>
  );
};

export default RecipeTable;