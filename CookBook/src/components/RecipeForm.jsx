import React, { useState } from 'react';
import GeneralInfoStep from './Pasos/GeneralInfoStep';
import IngredientsStep from './Pasos/IngredientsStep';
import StepsStep from './Pasos/StepsStep';
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
  const [step, setStep] = useState(1);

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

  if (!currentRecipe) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      ingredientes: prev.ingredientes.filter((ing) => (ing.id || ing.ingredienteId) !== id),
    }));
  };

  const handleSortIngredients = (newIngredients) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      ingredientes: newIngredients,
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
  
  const handleSortSteps = (newSteps) => {
    setCurrentRecipe((prev) => ({
      ...prev,
      pasos: newSteps,
    }));
  };

  return (
    <>
      <div className="step-indicator">
        <div className={`step-circle ${step === 1 ? 'active' : ''}`}>1</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step === 2 ? 'active' : ''}`}>2</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step === 3 ? 'active' : ''}`}>3</div>
      </div>
      
      <form>
        {step === 1 && (
          <GeneralInfoStep 
            currentRecipe={currentRecipe}
            categories={categories}
            handleChange={handleChange}
            setStep={setStep}
          />
        )}

        {step === 2 && (
          <IngredientsStep
            currentRecipe={currentRecipe}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            isSearchLoading={isSearchLoading}
            searchError={searchError}
            ingredientQuantity={ingredientQuantity}
            setIngredientQuantity={setIngredientQuantity}
            ingredientUnit={ingredientUnit}
            setIngredientUnit={setIngredientUnit}
            selectedIngredient={selectedIngredient}
            setSelectedIngredient={setSelectedIngredient}
            units={units}
            handleAddIngredient={handleAddIngredient}
            handleRemoveIngredient={handleRemoveIngredient}
            handleSortIngredients={handleSortIngredients}
            setStep={setStep}
          />
        )}
        
        {step === 3 && (
          <StepsStep
            currentRecipe={currentRecipe}
            currentStepText={currentStepText}
            setCurrentStepText={setCurrentStepText}
            handleAddStep={handleAddStep}
            handleRemoveStep={handleRemoveStep}
            handleSortSteps={handleSortSteps}
            setStep={setStep}
            setIsModalOpen={setIsModalOpen}
            handleSaveRecipe={handleSaveRecipe}
            isLoading={isLoading}
          />
        )}
      </form>
    </>
  );
};

export default RecipeForm;