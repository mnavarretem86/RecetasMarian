// components/RecipeForm.jsx

import React, { useState } from 'react';
import { useIngredientSearch } from '../hooks/useIngredientSearch';
import { units } from '../api/units';
import '../assets/RecipeForm.css';

const RecipeForm = ({ 
  currentRecipe, 
  setCurrentRecipe, 
  categories, 
  handleSaveRecipe, 
  setIsModalOpen, 
  isLoading 
}) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading: isSearchLoading,
    searchError,
  } = useIngredientSearch();

  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  
  const [currentStepText, setCurrentStepText] = useState('');
  const [step, setStep] = useState(1);

  if (!currentRecipe) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // La dificultad ahora se maneja como string, no como número
    const newValue = name === 'tiempo' || name === 'categoriaId' ? Number(value) : value; 
    setCurrentRecipe((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddIngredient = () => {
    if (selectedIngredient && ingredientQuantity && ingredientUnit) {
      const newIngredient = {
        ...selectedIngredient,
        id: selectedIngredient.ingredienteId,
        cantidad: Number(ingredientQuantity),
        unidad: ingredientUnit,
      };
      
      setCurrentRecipe((prev) => ({
        ...prev,
        ingredientes: [...(prev.ingredientes || []), newIngredient],
      }));

      setSearchTerm('');
      setSelectedIngredient(null);
      setIngredientQuantity('');
      setIngredientUnit('');
    }
  };

  const handleRemoveIngredient = (id) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((ing) => ing.id !== id),
    }));
  };

  const handleAddStep = () => {
    if (currentStepText.trim()) {
      const newStep = { descripcion: currentStepText };
      setCurrentRecipe((prev) => ({
        ...prev,
        pasos: [...(prev.pasos || []), newStep],
      }));
      setCurrentStepText('');
    }
  };

  const handleRemoveStep = (indexToRemove) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      pasos: prev.pasos.filter((_, index) => index !== indexToRemove),
    }));
  };
  
  const categoryOptions = categories.map(cat => (
    <option key={cat.categoriaId} value={cat.categoriaId}>
      {cat.nombre}
    </option>
  ));

  return (
    <>
      <div className="step-indicator">
        <div className={`step-circle ${step === 1 ? 'active' : ''}`}>1</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step === 2 ? 'active' : ''}`}>2</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step === 3 ? 'active' : ''}`}>3</div>
      </div>
    
      {/* Paso 1: Datos generales */}
      {step === 1 && (
        <>
          <div className="form-group">
            <label>Nombre*</label>
            <input type="text" name="nombre" value={currentRecipe.nombre || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={currentRecipe.descripcion || ''} onChange={handleChange} rows="3" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tiempo (minutos)*</label>
              <input type="number" name="tiempo" value={currentRecipe.tiempo || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Dificultad</label>
              <select name="dificultad" value={currentRecipe.dificultad || ''} onChange={handleChange}>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div className="form-group">
              <label>Categoría</label>
              <select name="categoriaId" value={currentRecipe.categoriaId || ''} onChange={handleChange}>
                {categories.length > 0 ? categoryOptions : <option value="" disabled>Cargando categorías...</option>}
              </select>
            </div>
          </div>
          <div className="form-navigation">
            <button type="button" onClick={() => setStep(2)}>
              Siguiente: Ingredientes
            </button>
          </div>
        </>
      )}

      {/* Paso 2: Ingredientes */}
      {step === 2 && (
        <>
          <div className="form-group ingredients-section">
            <label>Ingredientes</label>
            <div className="ingredient-search-container">
              <div className="form-row">
                <div className="form-group">
                  <label>Buscar Ingrediente</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: Pollo, Sal..."
                  />
                  {isSearchLoading && <p>Cargando ingredientes...</p>}
                  {searchError && <p className="error-message">{searchError}</p>}
                  {searchResults.length > 0 && (
                    <ul className="search-results">
                      {searchResults.map((ing) => (
                        <li key={ing.ingredienteId} onClick={() => {
                          setSelectedIngredient(ing);
                          setIngredientUnit(ing.unidad);
                        }}>
                          {ing.nombre}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedIngredient && (
                  <>
                    <div className="form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        value={ingredientQuantity}
                        onChange={(e) => setIngredientQuantity(e.target.value)}
                        placeholder="Cantidad"
                      />
                    </div>
                    <div className="form-group">
                      <label>Unidad</label>
                      <select 
                        value={ingredientUnit} 
                        onChange={(e) => setIngredientUnit(e.target.value)}
                      >
                        <option value="">Selecciona unidad</option>
                        {units.map((unit, index) => (
                          <option key={index} value={unit.nombre}>
                            {unit.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              {selectedIngredient && (
                <button type="button" onClick={handleAddIngredient} className="add-ingredient-btn">
                  Añadir {selectedIngredient.nombre}
                </button>
              )}
            </div>
            <div className="added-ingredients-list">
              {currentRecipe.ingredientes && currentRecipe.ingredientes.length > 0 ? (
                <ul>
                  {currentRecipe.ingredientes.map((ing) => (
                    <li key={ing.id || ing.ingredienteId}>
                      {ing.nombre} - {ing.cantidad} {ing.unidad}
                      <button type="button" onClick={() => handleRemoveIngredient(ing.id || ing.ingredienteId)} className="remove-ingredient-btn">
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aún no has añadido ingredientes.</p>
              )}
            </div>
          </div>
          <div className="form-navigation">
            <button type="button" onClick={() => setStep(1)} className="back-btn">
              Volver: Información general
            </button>
            <button type="button" onClick={() => setStep(3)}>
              Siguiente: Pasos
            </button>
          </div>
        </>
      )}

      {/* Paso 3: Pasos */}
      {step === 3 && (
        <>
          <div className="form-group steps-section">
            <label>Pasos de preparación</label>
            <div className="steps-list">
              {currentRecipe.pasos && currentRecipe.pasos.length > 0 ? (
                <ol>
                  {currentRecipe.pasos.map((paso, index) => (
                    <li key={index}>
                      {paso.descripcion}
                      <button type="button" onClick={() => handleRemoveStep(index)} className="remove-step-btn">
                        X
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Aún no has añadido pasos.</p>
              )}
            </div>
            <div className="step-input-container">
              <input 
                type="text"
                value={currentStepText}
                onChange={(e) => setCurrentStepText(e.target.value)}
                placeholder="Ej: Cocinar el pollo en una sartén..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
              />
              <button type="button" onClick={handleAddStep} className="add-step-btn">
                + Añadir Paso
              </button>
            </div>
          </div>
          <div className="form-navigation">
            <button type="button" onClick={() => setStep(2)} className="back-btn">
              Volver: Ingredientes
            </button>
            <div className="modal-actions">
                <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                    Cancelar
                </button>
                <button onClick={handleSaveRecipe} className="save-btn" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RecipeForm;