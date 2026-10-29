import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Guard de rutas
import ProtectedRoute from '../features/auth/ProtectedRoute';

// Página Pública Global
import LandingPage from '../pages/LandingPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import NotFoundPage from '../pages/NotFoundPage';

// Módulo Auth
import LoginPage from '../features/auth/LoginPage';

// Módulo Users
import RegistroUsuarioPage from '../features/users/pages/RegistroUsuarioPage';

// Módulo Inventory
import InventoryPage from '../features/inventory/pages/InventoryPage';
import InventoryCountPage from '../features/inventory/pages/InventoryCountPage';

// Módulo Classroom Map
import ClassroomMapPage from '../features/classroom-map/pages/ClassroomMapPage';

// Módulo Reservations (Salas)
import ReservaSalasPage from '../features/salas/pages/ReservaSalasPage';
import MisSolicitudesPage from '../features/salas/pages/MisSolicitudesPage'; 

// NUEVO Módulo: Solicitudes Técnicas (Mesa de Ayuda)
import MisSolicitudesTecnicasPage from '../features/solicitudes-tecnicas/pages/MisSolicitudesTecnicasPage';
import AdminSolicitudesTecnicasPage from '../features/solicitudes-tecnicas/pages/AdminSolicitudesTecnicasPage';

// Módulo Admin
import AdminUsersPage from '../features/admin/users/pages/AdminUsersPage';
import AdminReservaSalasPage from '../features/admin/pages/AdminReservaSalasPage';
import AdminConfigAgendaPage from '../features/admin/pages/AdminConfigAgendaPage';

// ============================================================
// Roles
// ============================================================
const ROLES = {
  ADMIN: 'Admin',
  OPERADOR: 'Operador-tics',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Estudiante', // <-- Nuevo rol
};

// Agrupaciones por conveniencia
const ROLES_ADMIN_ONLY = [ROLES.ADMIN];
const ROLES_INVENTARIO = [ROLES.ADMIN, ROLES.OPERADOR];
const ROLES_RESERVAS = [ROLES.ADMIN, ROLES.PROFESOR, ROLES.ESTUDIANTE]; // Estudiante puede reservar
const ROLES_MESA_AYUDA = [ROLES.ADMIN, ROLES.OPERADOR, ROLES.PROFESOR, ROLES.ESTUDIANTE]; // Todos pueden solicitar
const ROLES_ATENDER_TICKETS = [ROLES.ADMIN, ROLES.OPERADOR]; // Solo TICS gestiona

export default function AppRoutes() {
  return (
    <Routes>
      {/* ============================================================
          RUTAS PÚBLICAS
      ============================================================ */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroUsuarioPage />} />

      {/* ============================================================
          PÁGINAS DE ERROR
      ============================================================ */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* ============================================================
          RUTAS — INVENTARIO (Admin + Operador)
      ============================================================ */}
      <Route
        path="/inventario"
        element={
          <ProtectedRoute allowedRoles={ROLES_INVENTARIO}>
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventario/conteo"
        element={
          <ProtectedRoute allowedRoles={ROLES_INVENTARIO}>
            <InventoryCountPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          RUTAS — AULAS (todos los autenticados)
      ============================================================ */}
      <Route
        path="/aulas"
        element={
          <ProtectedRoute>
            <ClassroomMapPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          RUTAS — RESERVAS DE SALAS
      ============================================================ */}
      <Route
        path="/reservas"
        element={
          <ProtectedRoute allowedRoles={ROLES_RESERVAS}>
            <ReservaSalasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservas/mis-solicitudes"
        element={
          <ProtectedRoute allowedRoles={ROLES_RESERVAS}>
            <MisSolicitudesPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          NUEVAS RUTAS — MESA DE AYUDA (SOLICITUDES TÉCNICAS)
      ============================================================ */}
      <Route
        path="/solicitudes-tecnicas"
        element={
          <ProtectedRoute allowedRoles={ROLES_MESA_AYUDA}>
            <MisSolicitudesTecnicasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/solicitudes-tecnicas"
        element={
          <ProtectedRoute allowedRoles={ROLES_ATENDER_TICKETS}>
            <AdminSolicitudesTecnicasPage />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
          RUTAS — ADMINISTRACIÓN (solo Admin)
      ============================================================ */}
      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={ROLES_ADMIN_ONLY}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reservas"
        element={
          <ProtectedRoute allowedRoles={ROLES_ADMIN_ONLY}>
            <AdminReservaSalasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/config-agenda"
        element={
          <ProtectedRoute allowedRoles={ROLES_ADMIN_ONLY}>
            <AdminConfigAgendaPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}