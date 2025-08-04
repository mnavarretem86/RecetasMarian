import React, { useState } from 'react';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import '../assets/IngredientManager.css';

const IngredientManager = ({ formIngredients, setFormIngredients }) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    searchError,
  } = useIngredientSearch();

  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const handleAddIngredient = () => {
    if (selectedIngredient && ingredientQuantity && ingredientUnit) {
      const newIngredient = {
        ...selectedIngredient,
        id: selectedIngredient.ingredienteId,
        cantidad: Number(ingredientQuantity),
        unidad: ingredientUnit,
      };
      setFormIngredients((prev) => [...prev, newIngredient]);
      setSearchTerm('');
      setSelectedIngredient(null);
      setIngredientQuantity('');
      setIngredientUnit('');
    }
  };

  const handleRemoveIngredient = (id) => {
    setFormIngredients((prev) => prev.filter((ing) => ing.id !== id));
  };

  return (
    <>
      <div className="ingredients-container">
        {/* Formulario agregar ingredientes */}
        <div className="ingredient-form">
          <label>Agregar Ingrediente</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ingrediente..."
          />
          {isLoading && <p>Cargando ingredientes...</p>}
          {searchError && <p className="error-message">{searchError}</p>}
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((ing) => (
                <li key={ing.ingredienteId} onClick={() => setSelectedIngredient(ing)}>
                  {ing.nombre}
                </li>
              ))}
            </ul>
          )}

          {selectedIngredient && (
            <>
              <div className="input-group">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                  placeholder="Cantidad"
                />
              </div>
              <div className="input-group">
                <label>Unidad</label>
                <input
                  type="text"
                  value={ingredientUnit}
                  onChange={(e) => setIngredientUnit(e.target.value)}
                  placeholder="Ej: Gramos"
                />
              </div>
              <button type="button" className="add-ingredient-btn" onClick={handleAddIngredient}>
                Añadir {selectedIngredient.nombre}
              </button>
            </>
          )}
        </div>

        {/* Lista ingredientes añadidos */}
        <div className="ingredients-list">
          <label>Ingredientes Añadidos</label>
          {formIngredients.length > 0 ? (
            formIngredients.map((ing) => (
              <div key={ing.id} className="ingredient-item">
                <div>
                  <strong>{ing.nombre}</strong> — {ing.cantidad} {ing.unidad}
                </div>
                <button
                  type="button"
                  className="remove-ingredient-btn"
                  onClick={() => handleRemoveIngredient(ing.id)}
                  title="Quitar ingrediente"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <p>Aún no has añadido ingredientes.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default IngredientManager;