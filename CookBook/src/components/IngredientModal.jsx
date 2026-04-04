import React, { useEffect, useState } from 'react';
import { createIngrediente, updateIngrediente } from '../api/ingredients';
import '../assets/IngredientModal.css';

const IngredientModal = ({
  isOpen,
  onClose,
  onSaved,
  ingredientToEdit = null,
}) => {
  const [form, setForm] = useState({
    ingredienteId: 0,
    nombre: '',
    descripcion: '',
    unidad: '',
    estadoId: 1,
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ingredientToEdit) {
      setForm({
        ingredienteId: ingredientToEdit.ingredienteId || ingredientToEdit.id || 0,
        nombre: ingredientToEdit.nombre || '',
        descripcion: ingredientToEdit.descripcion || '',
        unidad: ingredientToEdit.unidad || '',
        estadoId: ingredientToEdit.estadoId ?? 1,
        fechaCreacion: ingredientToEdit.fechaCreacion || new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      });
    } else {
      setForm({
        ingredienteId: 0,
        nombre: '',
        descripcion: '',
        unidad: '',
        estadoId: 1,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      });
    }

    setError('');
  }, [ingredientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'estadoId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre.trim() || !form.unidad.trim()) {
      setError('Nombre y unidad son obligatorios.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        fechaModificacion: new Date().toISOString(),
      };

      if (ingredientToEdit) {
        await updateIngrediente(payload.ingredienteId, payload);
      } else {
        await createIngrediente(payload);
      }

      if (onSaved) {
        onSaved(payload);
      }

      onClose();
    } catch (err) {
      console.error('Error guardando ingrediente:', err);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.mensaje ||
        'No se pudo guardar el ingrediente.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ingredient-modal-overlay">
      <div className="ingredient-modal">
        <div className="ingredient-modal-header">
          <h3>{ingredientToEdit ? 'Editar ingrediente' : 'Agregar ingrediente'}</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ingredient-form">
          {error && <div className="ingredient-error">{error}</div>}

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Azúcar"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del ingrediente"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Unidad</label>
            <input
              type="text"
              name="unidad"
              value={form.unidad}
              onChange={handleChange}
              placeholder="Ej. gr, ml, unidad"
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select
              name="estadoId"
              value={form.estadoId}
              onChange={handleChange}
            >
              <option value={1}>Activo</option>
              <option value={2}>Inactivo</option>
            </select>
          </div>

          <div className="ingredient-modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Guardando...' : ingredientToEdit ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientModal;