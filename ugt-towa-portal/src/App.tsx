import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuienesSomosPage from './pages/QuienesSomosPage';
import ComunicadosPage from './pages/ComunicadosPage';
import ComunicadoDetailPage from './pages/ComunicadoDetailPage';
import CitasPage from './pages/CitasPage';
import EncuestasPage from './pages/EncuestasPage';
import NewsletterPage from './pages/NewsletterPage';
import DocumentosPage from './pages/DocumentosPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuienesSomos from './pages/admin/AdminQuienesSomos';
import AdminComunicados from './pages/admin/AdminComunicados';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminCitas from './pages/admin/AdminCitas';
import AdminDisponibilidad from './pages/admin/AdminDisponibilidad';
import AdminEncuestas from './pages/admin/AdminEncuestas';
import AdminComentarios from './pages/admin/AdminComentarios';
import AdminDocumentos from './pages/admin/AdminDocumentos';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/quienes-somos" element={<QuienesSomosPage />} />
          <Route path="/comunicados" element={<ComunicadosPage />} />
          <Route path="/comunicados/:id" element={<ComunicadoDetailPage />} />
          <Route path="/encuestas" element={<EncuestasPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/citas"
            element={
              <PrivateRoute>
                <CitasPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/documentos"
            element={
              <PrivateRoute>
                <DocumentosPage />
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quienes-somos"
            element={
              <AdminRoute>
                <AdminQuienesSomos />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/comunicados"
            element={
              <AdminRoute>
                <AdminComunicados />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <AdminRoute>
                <AdminCategorias />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/citas"
            element={
              <AdminRoute>
                <AdminCitas />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/disponibilidad"
            element={
              <AdminRoute>
                <AdminDisponibilidad />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/encuestas"
            element={
              <AdminRoute>
                <AdminEncuestas />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/comentarios"
            element={
              <AdminRoute>
                <AdminComentarios />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/documentos"
            element={
              <AdminRoute>
                <AdminDocumentos />
              </AdminRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
