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
import { getIngredientes } from '../../api/ingredients';
import '../../assets/IngredientesList.css';

const ITEMS_PER_PAGE = 20;

const IngredientesList = () => {
  const navigate = useNavigate();

  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const cargarIngredientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getIngredientes();
      setIngredientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los ingredientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIngredientes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const ingredientesFiltrados = useMemo(() => {
    const texto = search.toLowerCase().trim();

    if (!texto) return ingredientes;

    return ingredientes.filter((item) => {
      return (
        item.nombre?.toLowerCase().includes(texto) ||
        item.descripcion?.toLowerCase().includes(texto) ||
        item.unidad?.toLowerCase().includes(texto)
      );
    });
  }, [ingredientes, search]);

  const totalPages = Math.ceil(ingredientesFiltrados.length / ITEMS_PER_PAGE) || 1;

  const ingredientesPaginados = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return ingredientesFiltrados.slice(startIndex, endIndex);
  }, [ingredientesFiltrados, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const startEntry =
    ingredientesFiltrados.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endEntry = Math.min(
    currentPage * ITEMS_PER_PAGE,
    ingredientesFiltrados.length
  );

  return (
    <div className="dashboard ingredientes-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Ingredientes</h1>
          <p className="user-info-text">
            Administra los ingredientes registrados en el sistema
          </p>
        </div>

        <div className="header-right ingredientes-header-actions">
          <button
            onClick={() => navigate('/')}
            className="header-btn secondary"
            type="button"
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <button
            onClick={() => navigate('/ingredientes/crear')}
            className="header-btn primary"
            type="button"
          >
            <PlusLg size={16} />
            Nuevo Ingrediente
          </button>
        </div>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción o unidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="ingredientes-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando ingredientes...</p>
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
            <table className="recipes-table ingredientes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Unidad</th>
                  <th>Estado</th>
                  <th>Fecha creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ingredientesPaginados.length > 0 ? (
                  ingredientesPaginados.map((ingrediente) => (
                    <tr key={ingrediente.ingredienteId}>
                      <td>{ingrediente.ingredienteId}</td>
                      <td>{ingrediente.nombre}</td>
                      <td>{ingrediente.descripcion}</td>
                      <td>{ingrediente.unidad}</td>
                      <td>
                        <span
                          className={`ingrediente-estado-badge ${
                            ingrediente.estadoId === 1 ? 'activo' : 'inactivo'
                          }`}
                        >
                          {ingrediente.estadoId === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {ingrediente.fechaCreacion
                          ? new Date(ingrediente.fechaCreacion).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            type="button"
                            title="Editar ingrediente"
                            onClick={() =>
                              navigate(`/ingredientes/editar/${ingrediente.ingredienteId}`)
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
                    <td colSpan="7" className="ingredientes-empty">
                      No se encontraron ingredientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-row ingredientes-pagination-row">
            <div className="entries-per-page">
              <span>Mostrando</span>
              <strong>{startEntry}</strong>
              <span>a</span>
              <strong>{endEntry}</strong>
              <span>de</span>
              <strong>{ingredientesFiltrados.length}</strong>
              <span>ingredientes</span>
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

export default IngredientesList;