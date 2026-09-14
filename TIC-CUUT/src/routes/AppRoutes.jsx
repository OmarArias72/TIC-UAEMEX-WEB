import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Página Pública Global
import LandingPage from '../pages/LandingPage';

// Módulo Auth
import LoginPage from '../features/auth/LoginPage';

// Módulo Users
import RegistroUsuarioPage from '../features/users/pages/RegistroUsuarioPage';

// Módulo Inventory
import InventoryPage from '../features/inventory/pages/InventoryPage';

// Módulo Classroom Map
import ClassroomMapPage from '../features/classroom-map/pages/ClassroomMapPage';

// Módulo Reservations
import ReservaSalasPage from '../features/reservations/pages/ReservaSalasPage';

// Módulo Admin
import AdminUsersPage from '../features/admin/pages/AdminUsersPage';
import AdminReservaSalasPage from '../features/admin/pages/AdminReservaSalasPage';
import AdminConfigAgendaPage from '../features/admin/pages/AdminConfigAgendaPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroUsuarioPage />} />

      {/* Rutas de Usuario */}
      <Route path="/inventario" element={<InventoryPage />} />
      <Route path="/aulas" element={<ClassroomMapPage />} />
      <Route path="/reservas" element={<ReservaSalasPage />} />

      {/* Rutas de Administración */}
      <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      <Route path="/admin/reservas" element={<AdminReservaSalasPage />} />
      <Route path="/admin/config-agenda" element={<AdminConfigAgendaPage />} />
    </Routes>
  );
}