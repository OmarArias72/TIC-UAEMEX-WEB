import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function NavBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-uaem-verde text-uaem-blanco shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-xl text-uaem-dorado hover:text-uaem-dorado-hover transition-colors">
              Sistema de Inventario
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-uaem-blanco hover:text-uaem-dorado transition-colors font-medium text-sm">Inicio</Link>
            
            {user ? (
              <>
                <Link to="/aulas" className="text-uaem-blanco hover:text-uaem-dorado transition-colors font-medium text-sm">Mapa de Aulas</Link>
                <Link to="/inventario" className="text-uaem-blanco hover:text-uaem-dorado transition-colors font-medium text-sm">Inventario Total</Link>
                <Link to="/reservas" className="text-uaem-blanco hover:text-uaem-dorado transition-colors font-medium text-sm">Reserva de Salas</Link>
                
                {/* Sección exclusiva para el usuario Administrador */}
                {user.role === 'admin' && (
                  <div className="flex space-x-2 items-center border-l border-uaem-dorado/30 pl-4 ml-2">
                    <Link to="/admin/usuarios" className="text-uaem-dorado font-bold text-xs bg-white bg-opacity-10 hover:bg-opacity-20 transition px-2.5 py-1 rounded">
                      Usuarios
                    </Link>
                    <Link to="/admin/reservas" className="text-uaem-dorado font-bold text-xs bg-white bg-opacity-10 hover:bg-opacity-20 transition px-2.5 py-1 rounded">
                      Control Reservas
                    </Link>
                    <Link to="/admin/config-agenda" className="text-uaem-dorado font-bold text-xs bg-white bg-opacity-10 hover:bg-opacity-20 transition px-2.5 py-1 rounded">
                      Apertura / Cierre
                    </Link>
                  </div>
                )}
                
                <button onClick={handleLogout} className="text-red-300 hover:text-red-100 font-bold text-sm ml-4 border-l border-gray-400 pl-4 transition-colors">
                  Cerrar Sesión ({user.name})
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-uaem-dorado hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}