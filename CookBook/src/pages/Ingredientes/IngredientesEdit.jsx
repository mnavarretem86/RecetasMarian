import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, XCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { getIngredientes, updateIngrediente } from '../../api/ingredients';
import './../../assets/CSS/Ingredientes/IngredientesForm.css';

const UNIDADES = ['unidad', 'rebanada', 'ml', 'gramos'];

const IngredientesEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    ingredienteId: 0,
    nombre: '',
    descripcion: '',
    unidad: '',
    estadoId: 1,
    fechaCreacion: '',
    fechaModificacion: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarIngrediente = async () => {
      try {
        setLoadingData(true);
        setError('');

        const data = await getIngredientes();
        const ingrediente = Array.isArray(data)
          ? data.find((item) => String(item.ingredienteId) === String(id))
          : null;

        if (!ingrediente) {
          setError('No se encontró el ingrediente.');
          toast.error('No se encontró el ingrediente');
          return;
        }

        setForm({
          ingredienteId: ingrediente.ingredienteId,
          nombre: ingrediente.nombre || '',
          descripcion: ingrediente.descripcion || '',
          unidad: ingrediente.unidad || '',
          estadoId: ingrediente.estadoId ?? 1,
          fechaCreacion: ingrediente.fechaCreacion || '',
          fechaModificacion: ingrediente.fechaModificacion || '',
        });
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el ingrediente.');
        toast.error('No se pudo cargar el ingrediente');
      } finally {
        setLoadingData(false);
      }
    };

    cargarIngrediente();
  }, [id]);

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

      await updateIngrediente(form.ingredienteId, {
        ingredienteId: form.ingredienteId,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        unidad: form.unidad,
        estadoId: form.estadoId,
        fechaCreacion: form.fechaCreacion || new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      });

      toast.success('Ingrediente actualizado correctamente');

      setTimeout(() => {
        navigate('/ingredientes');
      }, 900);
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el ingrediente.');
      toast.error('No se pudo actualizar el ingrediente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="dashboard ingrediente-form-page">
        <div className="ingredientes-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando ingrediente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard ingrediente-form-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Editar Ingrediente</h1>
          <p className="user-info-text">
            Modifica la información del ingrediente seleccionado
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
                  Actualizar Ingrediente
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientesEdit;