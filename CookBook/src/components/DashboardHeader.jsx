import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusLg,
  EggFried,
  People,
  BoxArrowRight,
  BoxArrowInRight,
  JournalRichtext
} from 'react-bootstrap-icons';

const DashboardHeader = ({ user, onLogout, onAddRecipe }) => {
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  return (
    <header className="dashboard-header cookbook-header">
      <div className="header-left">
        <div className="header-brand">
          <div className="brand-icon">
            <JournalRichtext size={22} />
          </div>

          <div className="brand-text">
            <h1>CookBook 2.0</h1>
            <p className="user-info-text">
              {isAuthenticated ? (
                <>
                  Hola, <span className="username">{user?.displayName || 'Usuario'}</span>
                </>
              ) : (
                'Descubre nuestras deliciosas recetas'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="header-right header-actions">
        {isAuthenticated ? (
          <>
            <button
              onClick={onAddRecipe}
              className="header-btn primary"
              type="button"
            >
              <PlusLg size={16} />
              <span>Nueva Receta</span>
            </button>

            <button
              onClick={() => navigate('/ingredientes')}
              className="header-btn secondary"
              type="button"
            >
              <EggFried size={16} />
              <span>Ingredientes</span>
            </button>

            <button
              onClick={() => navigate('/usuarios')}
              className="header-btn secondary"
              type="button"
            >
              <People size={16} />
              <span>Usuarios</span>
            </button>

            <button
              onClick={onLogout}
              className="header-btn danger-outline"
              type="button"
            >
              <BoxArrowRight size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="header-btn primary"
            type="button"
          >
            <BoxArrowInRight size={16} />
            <span>Iniciar Sesión</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;