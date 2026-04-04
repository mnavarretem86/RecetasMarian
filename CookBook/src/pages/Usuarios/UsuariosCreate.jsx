import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, XCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { createUsuario } from '../../api/users';
import './../../assets/CSS/Usuarios/UsuariosForm.css';

const UsuariosCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: '',
    primerNombre: '',
    primerApellido: '',
    email: '',
    dni: '',
    contrasena: '',
    estadoID: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'estadoID' ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!form.usuario.trim()) return 'El usuario es obligatorio.';
    if (!form.primerNombre.trim()) return 'El primer nombre es obligatorio.';
    if (!form.primerApellido.trim()) return 'El primer apellido es obligatorio.';
    if (!form.email.trim()) return 'El correo es obligatorio.';
    if (!form.dni.trim()) return 'El DNI es obligatorio.';
    if (!form.contrasena.trim()) return 'La contraseña es obligatoria.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) return 'El correo no es válido.';

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

      await createUsuario({
        usuarioID: 0,
        usuario: form.usuario.trim(),
        primerNombre: form.primerNombre.trim(),
        primerApellido: form.primerApellido.trim(),
        email: form.email.trim(),
        dni: form.dni.trim(),
        contrasena: form.contrasena,
        estadoID: form.estadoID,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString(),
      });

      toast.success('Usuario guardado correctamente');

      setTimeout(() => {
        navigate('/usuarios');
      }, 900);
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el usuario.');
      toast.error('No se pudo guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard usuario-form-page">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Nuevo Usuario</h1>
          <p className="user-info-text">
            Completa la información para registrar un nuevo usuario
          </p>
        </div>

        <div className="header-right usuario-form-header-actions">
          <button
            type="button"
            className="header-btn secondary"
            onClick={() => navigate('/usuarios')}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </div>

      <div className="usuario-form-card">
        {error && (
          <div className="error-message">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="usuario-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ej: mjarquin"
                value={form.usuario}
                onChange={handleChange}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                id="dni"
                name="dni"
                type="text"
                placeholder="Ej: 12345678900000"
                value={form.dni}
                onChange={handleChange}
                maxLength={20}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primerNombre">Primer Nombre</label>
              <input
                id="primerNombre"
                name="primerNombre"
                type="text"
                placeholder="Ej: Marian"
                value={form.primerNombre}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="primerApellido">Primer Apellido</label>
              <input
                id="primerApellido"
                name="primerApellido"
                type="text"
                placeholder="Ej: Jarquin"
                value={form.primerApellido}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ej: usuario@udem.edu.ni"
              value={form.email}
              onChange={handleChange}
              maxLength={150}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                name="contrasena"
                type="password"
                placeholder="Ingrese la contraseña"
                value={form.contrasena}
                onChange={handleChange}
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estadoID">Estado</label>
              <select
                id="estadoID"
                name="estadoID"
                value={form.estadoID}
                onChange={handleChange}
              >
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
              </select>
            </div>
          </div>

          <div className="usuario-form-actions">
            <button
              type="button"
              className="header-btn secondary"
              onClick={() => navigate('/usuarios')}
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
                  Guardar Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuariosCreate;