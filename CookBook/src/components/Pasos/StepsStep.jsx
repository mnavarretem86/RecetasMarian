import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Trash3Fill, GripVertical } from 'react-bootstrap-icons';
import '../../assets/CSS/StepsStep.css';

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
  const isSaveButtonDisabled =
    !currentRecipe.pasos || currentRecipe.pasos.length === 0 || isLoading;

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
                  <div className="step-item-left">
                    <span className="step-drag-handle" title="Arrastrar paso">
                      <GripVertical size={16} />
                    </span>

                    <div className="step-content">
                      <span className="step-number">{index + 1}.</span>
                      <span className="step-text">{paso.descripcion}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="remove-step-btn"
                    title="Eliminar paso"
                    aria-label={`Eliminar paso ${index + 1}`}
                  >
                    <Trash3Fill size={15} />
                  </button>
                </li>
              ))}
            </ReactSortable>
          ) : (
            <p className="empty-steps-message">Aún no has añadido pasos.</p>
          )}
        </div>

        <div className="step-input-container-vertical">
          <input
            type="text"
            value={currentStepText}
            onChange={(e) => setCurrentStepText(e.target.value)}
            placeholder="Ej: Cocinar el pollo en una sartén..."
            onKeyDown={(e) => {
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
          <button
            type="button"
            onClick={() => setStep(2)}
            className="back-btn"
          >
            Ingredientes
          </button>
        </div>

        <div className="right-buttons">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="cancel-btn"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSaveRecipe}
            className="save-btn"
            disabled={isSaveButtonDisabled}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  );
};

export default StepsStep;