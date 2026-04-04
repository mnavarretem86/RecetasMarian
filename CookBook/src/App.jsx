import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IngredientesList from './pages/Ingredientes/IngredientesList';
import IngredientesCreate from './pages/Ingredientes/IngredientesCreate';
import IngredientesEdit from './pages/Ingredientes/IngredientesEdit';
import UsuariosList from './pages/Usuarios/UsuariosList';
import UsuariosCreate from './pages/Usuarios/UsuariosCreate';
import UsuariosEdit from './pages/Usuarios/UsuariosEdit';
import { verifySession, logout } from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await verifySession();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Error verifying session:', err);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    toast.success('Inicio de sesión exitoso');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.info('Sesión cerrada');
  };

  if (loadingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />

        <Routes>
          <Route
            path="/"
            element={<Dashboard user={user} onLogout={handleLogout} />}
          />

          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />

          <Route
            path="/ingredientes"
            element={
              user ? <IngredientesList /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/ingredientes/crear"
            element={
              user ? <IngredientesCreate /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/ingredientes/editar/:id"
            element={
              user ? <IngredientesEdit /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/usuarios"
            element={
              user ? <UsuariosList /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/usuarios/crear"
            element={
              user ? <UsuariosCreate /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/usuarios/editar/:id"
            element={
              user ? <UsuariosEdit /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/dashboard"
            element={<Navigate to="/" />}
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;