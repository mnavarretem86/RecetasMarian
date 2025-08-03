import React from 'react';
import '../assets/RecipeForm.css'; // CLAVE: Importa los estilos CSS del formulario.

const RecipeForm = ({ currentRecipe, setCurrentRecipe, categories }) => {
  if (!currentRecipe) return null;

  // Manejador genérico para actualizar el estado de la receta
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convierte el valor a número si el nombre del campo es 'tiempo' o 'categoriaId'
    const newValue = (name === 'tiempo' || name === 'categoriaId') ? Number(value) : value;

    setCurrentRecipe(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <>
      <div className="form-group">
        <label>Nombre*</label>
        <input
          type="text"
          name="nombre"
          value={currentRecipe.nombre || ''}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Ingredientes* (uno por línea)</label>
        <textarea
          name="ingredientes"
          value={currentRecipe.ingredientes || ''}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={currentRecipe.descripcion || ''}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <div className="form-group">
        <label>Pasos de preparación (uno por línea)</label>
        <textarea
          name="pasos"
          value={currentRecipe.pasos || ''}
          onChange={handleChange}
          rows="3"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Tiempo (minutos)*</label>
          <input
            type="number"
            name="tiempo"
            value={currentRecipe.tiempo || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Dificultad</label>
          <select
            name="dificultad"
            value={currentRecipe.dificultad || ''}
            onChange={handleChange}
          >
            <option value="Fácil">Fácil</option>
            <option value="Media">Media</option>
            <option value="Difícil">Difícil</option>
          </select>
        </div>
        <div className="form-group">
          <label>Categoría</label>
          <select
            name="categoriaId"
            value={currentRecipe.categoriaId || ''}
            onChange={handleChange}
          >
            {categories.length > 0 ? (
              categories.map(cat => (
                <option key={cat.categoriaId} value={cat.categoriaId}>
                  {cat.nombre}
                </option>
              ))
            ) : (
              <option value="" disabled>Cargando categorías...</option>
            )}
          </select>
        </div>
      </div>
    </>
  );
};

export default RecipeForm;