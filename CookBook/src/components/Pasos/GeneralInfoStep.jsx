import React from 'react';

const GeneralInfoStep = ({ currentRecipe, categories, handleChange, setStep }) => {
  const categoryOptions = categories.map(cat => (
    <option key={cat.categoriaId} value={cat.categoriaId}>
      {cat.nombre}
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
  );
};

export default GeneralInfoStep;