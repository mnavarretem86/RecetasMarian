
import React, { useState, useEffect } from 'react';

const GeneralInfoStep = ({
 currentRecipe,
 categories,
 difficulties = [],
 handleChange,
 setStep,
 setIsModalOpen
}) => {
 const [isFormValid, setIsFormValid] = useState(false);

 useEffect(() => {
  const { nombre, tiempo, dificultad, categoriaId } = currentRecipe;
  if (nombre && tiempo && dificultad && categoriaId) {
   setIsFormValid(true);
  } else {
   setIsFormValid(false);
  }
 }, [currentRecipe]);

 const categoryOptions = categories.map(cat => (
  <option key={cat.categoriaId} value={cat.categoriaId}>
   {cat.nombre}
  </option>
 ));

 const difficultyOptions = difficulties.map(diff => (
  <option key={diff.dificultadId} value={diff.nombre}>
   {diff.nombre}
  </option>
 ));

 return (
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
     <label>Dificultad*</label>
     <select name="dificultad" value={currentRecipe.dificultad || ''} onChange={handleChange} required>
      <option value="" disabled>Seleccionar...</option>
      {difficulties.length > 0 ? difficultyOptions : <option value="" disabled>Cargando dificultades...</option>}
     </select>
    </div>
    <div className="form-group">
     <label>Categoría*</label>
     <select name="categoriaId" value={currentRecipe.categoriaId || ''} onChange={handleChange} required>
      <option value="" disabled>Seleccionar...</option>
      {categories.length > 0 ? categoryOptions : <option value="" disabled>Cargando categorías...</option>}
     </select>
    </div>
   </div>
   <div className="form-navigation full-width-align">
    <div className="left-buttons">
     <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
      Cancelar
     </button>
    </div>
    <div className="right-buttons">
     <button type="button" onClick={() => setStep(2)} disabled={!isFormValid}>
      Siguiente: Ingredientes
     </button>
    </div>
   </div>
  </>
 );
};

export default GeneralInfoStep;