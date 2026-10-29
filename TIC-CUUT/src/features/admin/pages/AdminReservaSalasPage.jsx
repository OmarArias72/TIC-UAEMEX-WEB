import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import AdminReservationsPage from '../../salas/pages/AdminReservationsPage';

/**
 * Wrapper administrativo.
 * Delega a la página completa de gestión de reservas usando el idAdmin del usuario logueado.
 */
export default function AdminReservaSalasPage() {
  const idAdmin = useAuthStore((s) => s.user?.idUsuario) ?? null;

  if (!idAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-red-600 font-bold">
        No se pudo determinar el usuario administrador.
      </div>
    );
  }

  return <AdminReservationsPage idAdmin={idAdmin} />;
}