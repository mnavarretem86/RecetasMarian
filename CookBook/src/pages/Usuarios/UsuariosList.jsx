import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusLg,
  PencilSquare,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'react-bootstrap-icons';
import { getUsuarios } from '../../api/users';
import './../../assets/CSS/Usuarios/UsuariosList.css';

const ITEMS_PER_PAGE = 20;

const UsuariosList = () => {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const usuariosFiltrados = useMemo(() => {
    const texto = search.toLowerCase().trim();

    if (!texto) return usuarios;

    return usuarios.filter((item) => {
      return (
        item.usuario?.toLowerCase().includes(texto) ||
        item.primerNombre?.toLowerCase().includes(texto) ||
        item.primerApellido?.toLowerCase().includes(texto) ||
        item.nombreCompletoUsuario?.toLowerCase().includes(texto) ||
        item.email?.toLowerCase().includes(texto) ||
        item.dni?.toLowerCase().includes(texto)
      );
    });
  }, [usuarios, search]);

  const totalPages = Math.ceil(usuariosFiltrados.length / ITEMS_PER_PAGE) || 1;

  const usuariosPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return usuariosFiltrados.slice(startIndex, endIndex);
  }, [usuariosFiltrados, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const startEntry =
    usuariosFiltrados.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, usuariosFiltrados.length);

  return (
    <div className="dashboard usuarios-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Usuarios</h1>
          <p className="user-info-text">
            Administra los usuarios registrados en el sistema
          </p>
        </div>

        <div className="header-right usuarios-header-actions">
          <button
            onClick={() => navigate('/')}
            className="header-btn secondary"
            type="button"
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <button
            onClick={() => navigate('/usuarios/crear')}
            className="header-btn primary"
            type="button"
          >
            <PlusLg size={16} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por usuario, nombre, correo o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="usuarios-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="recipes-table-container">
            <table className="recipes-table usuarios-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>DNI</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.length > 0 ? (
                  usuariosPaginados.map((usuario) => (
                    <tr key={usuario.usuarioID}>
                      <td>{usuario.usuarioID}</td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.nombreCompletoUsuario}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.dni}</td>
                      <td>
                        <span
                          className={`usuario-estado-badge ${
                            usuario.estadoID === 1 ? 'activo' : 'inactivo'
                          }`}
                        >
                          {usuario.estadoID === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {usuario.fechaCreacion
                          ? new Date(usuario.fechaCreacion).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            type="button"
                            title="Editar usuario"
                            onClick={() =>
                              navigate(`/usuarios/editar/${usuario.usuarioID}`)
                            }
                          >
                            <PencilSquare size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="usuarios-empty">
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-row usuarios-pagination-row">
            <div className="entries-per-page">
              <span>Mostrando</span>
              <strong>{startEntry}</strong>
              <span>a</span>
              <strong>{endEntry}</strong>
              <span>de</span>
              <strong>{usuariosFiltrados.length}</strong>
              <span>usuarios</span>
            </div>

            <div className="pagination">
              <button
                className="page-btn arrow-btn"
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              <span className="page-info">
                Página {currentPage} de {totalPages}
              </span>

              <button
                className="page-btn arrow-btn"
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsuariosList;