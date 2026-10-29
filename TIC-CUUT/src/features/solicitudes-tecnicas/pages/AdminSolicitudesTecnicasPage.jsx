import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { solicitudTecnicaService } from '../../../api/services/solicitudTecnicaService';

import SolicitudAdminModal from '../modals/SolicitudAdminModal';

const FILTROS = [
  { key: 'PENDIENTES', label: 'Pendientes de Aprobar' },
  { key: 'SIN_ID', label: 'Listas para Ticket' },
  { key: 'TODAS', label: 'Todas las Solicitudes' },
];

export default function AdminSolicitudesTecnicasPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [filtro, setFiltro] = useState('PENDIENTES');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['admin-solicitudes-tecnicas', filtro],
    queryFn: () => solicitudTecnicaService.panelAdmin(filtro),
    enabled: !!user?.idUsuario,
    refetchInterval: 30000, // Refresco automático cada 30 seg
  });

  // Helper para colores de estado
  const renderEstadoBadge = (estado) => {
    const map = {
      PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
      APROBADA: 'bg-blue-100 text-blue-700 border-blue-200',
      FORMULARIO_ENVIADO: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      ESPERA_TICKET: 'bg-slate-200 text-slate-700 border-slate-300',
      TICKET_CREADO: 'bg-purple-100 text-purple-700 border-purple-200',
      RESUELTO: 'bg-green-100 text-green-700 border-green-200',
      RECHAZADA: 'bg-red-100 text-red-700 border-red-200',
      CANCELADA: 'bg-slate-100 text-slate-500 border-slate-200',
      CERRADA: 'bg-slate-800 text-white border-slate-900',
    };
    const cls = map[estado] || 'bg-slate-100 text-slate-600';
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${cls}`}>
        {estado.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-6">
          <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
            Panel de Administración
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Mesa de Ayuda TICS
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona las solicitudes de alumnos y genera los tickets externos.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {FILTROS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFiltro(t.key)}
              className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
                filtro === t.key
                  ? 'text-[#486AE6] border-[#486AE6]'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold w-16">ID</th>
                  <th className="py-4 px-6 font-semibold">Alumno</th>
                  <th className="py-4 px-6 font-semibold">Tipo</th>
                  <th className="py-4 px-6 font-semibold">Fecha</th>
                  <th className="py-4 px-6 font-semibold text-center">Estado</th>
                  <th className="py-4 px-6 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-[#486AE6] font-bold animate-pulse">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No hay solicitudes en esta bandeja.
                    </td>
                  </tr>
                ) : (
                  solicitudes.map((s) => (
                    <tr key={s.idSolicitud} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-400">
                        #{s.idSolicitud}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900">{s.nombreUsuario}</p>
                        <p className="text-xs text-slate-500">{s.correoUsuario}</p>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {s.tipoNombre.replace(/_/g, ' ')}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {new Date(s.fechaSolicitud).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {renderEstadoBadge(s.estado)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setSelectedSolicitud(s)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-[#486AE6] hover:bg-[#3b59c7] rounded-lg shadow-sm transition-colors"
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal de Gestión (El que hace toda la magia) */}
      <SolicitudAdminModal
        isOpen={!!selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
        solicitud={selectedSolicitud}
        idAdmin={user?.idUsuario}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['admin-solicitudes-tecnicas'] })}
      />
    </div>
  );
}