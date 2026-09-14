import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes estructurales
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Páginas existentes
import LandingPage from './pages/LandingPage';
import InventoryPage from './pages/InventoryPage';
import ClassroomMap from './pages/classroomap/ClassroomMap';
import LoginPage from './pages/auth/LoginPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Páginas de Usuario
import RegistroUsuario from './pages/user/RegistroUsuario';
import ReservaSalas from './pages/ReservaSalas';

// Nuevas Páginas de Administración de Salas
import AdminReservaSalas from './pages/admin/AdminReservaSalas';
import AdminConfigAgenda from './pages/admin/AdminConfigAgenda';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar />

        <main className="flex-grow flex flex-col">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroUsuario />} />
            
            {/* Rutas de Usuario */}
            <Route path="/inventario" element={<InventoryPage />} />
            <Route path="/aulas" element={<ClassroomMap />} />
            <Route path="/reservas" element={<ReservaSalas />} />
            
            {/* Rutas del Panel de Administración */}
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/reservas" element={<AdminReservaSalas />} />
            <Route path="/admin/config-agenda" element={<AdminConfigAgenda />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}