import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, XCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { createIngrediente } from '../../api/ingredients';
import './../../assets/CSS//Ingredientes/IngredientesForm.css';

const UNIDADES = ['unidad', 'rebanada', 'ml', 'gramos'];

const IngredientesCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    unidad: '',
    estadoId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'estadoId' ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!form.nombre.trim()) {
      return 'El nombre es obligatorio.';
    }

    if (!form.descripcion.trim()) {
      return 'La descripción es obligatoria.';
    }

    if (!form.unidad) {
      return 'La unidad es obligatoria.';
    }

    if (!form.estadoId) {
      return 'El estado es obligatorio.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.warning(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createIngrediente({
        ingredienteId: 0,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        unidad: form.unidad,
        estadoId: form.estadoId,
        fechaModificacion: new Date().toISOString(),
        fechaCreacion: new Date().toISOString(),
      });

      toast.success('Ingrediente guardado correctamente');

      setTimeout(() => {
        navigate('/ingredientes');
      }, 900);
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el ingrediente.');
      toast.error('No se pudo guardar el ingrediente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard ingrediente-form-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Nuevo Ingrediente</h1>
          <p className="user-info-text">
            Completa la información para registrar un nuevo ingrediente
          </p>
        </div>

        <div className="header-right ingrediente-form-header-actions">
          <button
            type="button"
            className="header-btn secondary"
            onClick={() => navigate('/ingredientes')}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      <div className="ingrediente-form-card">
        {error && (
          <div className="error-message">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="ingrediente-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Huevo"
              value={form.nombre}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Ej: Huevo de gallina"
              value={form.descripcion}
              onChange={handleChange}
              rows="4"
              maxLength={250}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="unidad">Unidad</label>
              <select
                id="unidad"
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
              >
                <option value="">Seleccione una unidad</option>
                {UNIDADES.map((unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estadoId">Estado</label>
              <select
                id="estadoId"
                name="estadoId"
                value={form.estadoId}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="ingrediente-form-actions">
            <button
              type="button"
              className="header-btn secondary"
              onClick={() => navigate('/ingredientes')}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`header-btn primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Ingrediente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientesCreate;