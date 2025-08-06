import React from 'react';
import { ReactSortable } from 'react-sortablejs';

const StepsStep = ({
  currentRecipe,
  currentStepText,
  setCurrentStepText,
  handleAddStep,
  handleRemoveStep,
  handleSortSteps,
  setStep,
  setIsModalOpen,
  handleSaveRecipe,
  isLoading,
}) => {
  return (
    <>
      <div className="form-group steps-section">
        <label>Pasos de preparación (arrastra para reordenar)</label>
        <div className="steps-list">
          {currentRecipe.pasos && currentRecipe.pasos.length > 0 ? (
            <ReactSortable 
              tag="ol"
              list={currentRecipe.pasos}
              setList={handleSortSteps}
              className="styled-steps-list"
              animation={200}
            >
              {currentRecipe.pasos.map((paso, index) => (
                <li key={index} className="step-item">
                  <span>{paso.descripcion}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="remove-step-btn"
                    title="Eliminar paso"
                  >
                    Eliminar paso
                  </button>
                </li>
              ))}
            </ReactSortable>
          ) : (
            <p>Aún no has añadido pasos.</p>
          )}
        </div>

        <div className="step-input-container-vertical">
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
          <button
            type="button"
            onClick={handleAddStep}
            className="add-step-btn"
          >
            + Añadir Paso
          </button>
        </div>
      </div>

      <div className="form-navigation full-width-align">
        <div className="left-buttons">
          <button type="button" onClick={() => setStep(2)} className="back-btn">
            Volver: Ingredientes
          </button>
        </div>
        <div className="right-buttons">
          <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">
            Cancelar
          </button>
          <button type="button" onClick={handleSaveRecipe} className="save-btn" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  );
};

export default StepsStep;