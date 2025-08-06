// src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { verifySession, logout } from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await verifySession();
        setUser(userData);
      } catch (err) {
        console.error('Error verifying session:', err);
        toast.warn('Sesión no válida o expirada');
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
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              user 
                ? <Navigate to="/dashboard" /> 
                : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user 
                ? <Dashboard user={user} onLogout={handleLogout} /> 
                : <Navigate to="/" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;