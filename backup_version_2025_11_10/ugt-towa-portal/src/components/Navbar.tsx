import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, signOut, isAdmin, isAffiliate } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-white shadow-md border-b-4 border-red-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/UGT-logo.jpg" 
              alt="UGT Logo" 
              className="h-14 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">UGT Towa</h1>
              <p className="text-xs text-gray-600">Sección Sindical</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-red-600 transition">
              Inicio
            </Link>
            <Link to="/quienes-somos" className="text-gray-700 hover:text-red-600 transition">
              Quiénes Somos
            </Link>
            <Link to="/comunicados" className="text-gray-700 hover:text-red-600 transition">
              Comunicados
            </Link>
            <Link to="/citas" className="text-gray-700 hover:text-red-600 transition">
              Citas
            </Link>
            {user && (
              <Link to="/documentos" className="text-gray-700 hover:text-red-600 transition">
                Documentos
              </Link>
            )}
            <Link to="/encuestas" className="text-gray-700 hover:text-red-600 transition">
              Encuestas
            </Link>
            {user && (
              <Link 
                to="/afiliados/dashboard" 
                className={`${
                  location.pathname.startsWith('/afiliados') 
                    ? 'text-red-600 font-semibold' 
                    : 'text-gray-700 hover:text-red-600 transition'
                }`}
              >
                Afiliados
              </Link>
            )}
            <Link to="/newsletter" className="text-gray-700 hover:text-red-600 transition">
              Newsletter
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
