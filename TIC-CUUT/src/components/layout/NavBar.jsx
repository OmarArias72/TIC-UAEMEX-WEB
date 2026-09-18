import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore, { ROLES } from '../../store/authStore';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-slate-900 text-white w-full sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* LADO IZQUIERDO: Botón Hamburguesa (Solo con sesión activa) y Logo */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
                  aria-label="Abrir Menú"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <Link to="/" className="font-extrabold text-lg text-white hover:text-[#486AE6] transition-colors tracking-tight flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#486AE6]"></div>
                Control<span className="text-[#486AE6]">Tech</span>
              </Link>
            </div>

            {/* LADO DERECHO: Botones de Autenticación (Solo SIN sesión activa) */}
            {!isAuthenticated && (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-slate-300 hover:text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-800 transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE TIPO DRAWER / PANEL RECTANGULAR LATERAL IZQUIERDO */}
      {isAuthenticated && isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Fondo obscuro translúcido con cierre al hacer clic fuera */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel Lateral Rectangular */}
          <div className="relative w-80 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 border-r border-slate-200">
            
            {/* Cabecera del Menú con Botón X de Cierre */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#7AD349]"></div>
                <span className="font-extrabold text-sm tracking-wide">Menú del Sistema</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Indicador de Usuario Activo */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Usuario Activo</span>
              <p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#486AE6]/10 text-[#486AE6] uppercase border border-[#486AE6]/20">
                {user?.role}
              </span>
            </div>

            {/* Enlaces de Navegación del Sistema */}
            <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              <div className="py-2">
                <Link 
                  to="/" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-6 py-3 hover:bg-slate-50 hover:text-[#486AE6] transition-colors"
                >
                  Inicio
                </Link>
                <Link 
                  to="/aulas" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-6 py-3 hover:bg-slate-50 hover:text-[#486AE6] transition-colors"
                >
                  Mapa de Aulas
                </Link>
                <Link 
                  to="/inventario" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-6 py-3 hover:bg-slate-50 hover:text-[#486AE6] transition-colors"
                >
                  Inventario Total
                </Link>
                <Link 
                  to="/reservas" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-6 py-3 hover:bg-slate-50 hover:text-[#486AE6] transition-colors"
                >
                  Reserva de Salas
                </Link>
              </div>

              {/* Opciones Especiales para ADMIN y PERSONAL_TIC */}
              {(user?.role === ROLES.ADMIN || user?.role === ROLES.PERSONAL_TIC) && (
                <div className="py-2 bg-slate-50/50">
                  <span className="block px-6 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A65D8B]">
                    Administración TIC
                  </span>
                  {user?.role === ROLES.ADMIN && (
                    <Link 
                      to="/admin/usuarios" 
                      onClick={() => setIsOpen(false)} 
                      className="block px-6 py-2.5 hover:bg-slate-100 hover:text-[#486AE6] transition-colors text-xs"
                    >
                      Gestión de Usuarios
                    </Link>
                  )}
                  <Link 
                    to="/admin/reservas" 
                    onClick={() => setIsOpen(false)} 
                    className="block px-6 py-2.5 hover:bg-slate-100 hover:text-[#486AE6] transition-colors text-xs"
                  >
                    Control de Reservas
                  </Link>
                  <Link 
                    to="/admin/config-agenda" 
                    onClick={() => setIsOpen(false)} 
                    className="block px-6 py-2.5 hover:bg-slate-100 hover:text-[#486AE6] transition-colors text-xs"
                  >
                    Apertura / Cierre Agenda
                  </Link>
                </div>
              )}
            </div>

            {/* Pie del Menú con Botón de Cierre de Sesión */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Cerrar Sesión
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}