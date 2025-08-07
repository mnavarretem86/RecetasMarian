import React from 'react';

const IngredientsStep = ({
 currentRecipe,
 searchTerm,
 setSearchTerm,
 searchResults,
 isSearchLoading,
 searchError,
 ingredientQuantity,
 setIngredientQuantity,
 ingredientUnit,
 setIngredientUnit,
 selectedIngredient,
 setSelectedIngredient,
 units,
 handleAddIngredient,
 handleRemoveIngredient,
 setStep,
 setIsModalOpen,
}) => {
 // Lógica de validación: el botón estará deshabilitado si no hay ingredientes
 const isNextButtonDisabled = !currentRecipe.ingredientes || currentRecipe.ingredientes.length === 0;

 return (
  <>
   <div className="step-2-container">
    <div className="ingredient-search-area">
     <div className="form-group">
      <label>Buscar Ingrediente</label>
      <input
       type="text"
       value={searchTerm}
       onChange={(e) => setSearchTerm(e.target.value)}
       placeholder="Ej: Pollo, Sal..."
      />
      {isSearchLoading && <p className="loading-message">Cargando ingredientes...</p>}
      {searchError && <p className="error-message">{searchError}</p>}
      {searchResults.length > 0 && (
       <ul className="search-results">
        {searchResults.map((ing) => (
         <li key={ing.ingredienteId} onClick={() => {
          setSelectedIngredient(ing);
          setIngredientUnit(ing.unidad);
          setSearchTerm('');
         }}>
          {ing.nombre}
         </li>
        ))}
       </ul>
      )}
     </div>

     {selectedIngredient && (
      <div className="selected-ingredient-form">
       <div className="form-row">
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
       </div>
       <button
        type="button"
        onClick={handleAddIngredient}
        className="add-ingredient-btn"
       >
        Añadir {selectedIngredient.nombre}
       </button>
      </div>
     )}
    </div>

    <div className="added-ingredients-area">
     <label>Ingredientes Añadidos</label>
     <div className="added-ingredients-list">
      {currentRecipe.ingredientes && currentRecipe.ingredientes.length > 0 ? (
       <ul className="styled-ingredients-list">
        {currentRecipe.ingredientes.map((ing) => (
         <li key={ing.id || ing.ingredienteId} className="ingredient-item">
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
   </div>
   
   <div className="form-navigation full-width-align">
    <div className="left-buttons">
     <button type="button" onClick={() => setStep(1)} className="back-btn">
      Volver: Información general
     </button>
    </div>
    <div className="right-buttons">
     <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
      Cancelar
     </button>
     <button type="button" onClick={() => setStep(3)} disabled={isNextButtonDisabled}>
      Siguiente: Pasos
     </button>
    </div>
   </div>
  </>
 );
};

export default IngredientsStep;