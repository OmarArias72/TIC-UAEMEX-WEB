import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * Envuelve una ruta para exigir autenticación y (opcionalmente) roles.
 *
 * @param {React.ReactNode} children - Página a renderizar.
 * @param {string[]} allowedRoles - Lista de roles permitidos. Si es null/undefined,
 *                                   cualquier usuario autenticado puede acceder.
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. Sin sesión → login (guardamos la ruta de origen para volver luego)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Validación de rol
  if (allowedRoles && allowedRoles.length > 0) {
    const rol = user?.nombreRol;
    if (!rol || !allowedRoles.includes(rol)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}