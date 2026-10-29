import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { reservaSalasService } from '../../../api/services/reservaSalasService';
import { useAuthStore } from '../../../store/authStore';

import SolicitudCard from '../components/SolicitudCard';
import SolicitudDetailModal from '../modals/SolicitudDetailModal';

const FILTROS = [
  { key: 'TODAS',      label: 'Todas' },
  { key: 'Pendiente',  label: '⏳ Pendientes' },
  { key: 'Aprobada',   label: '✅ Aprobadas' },
  { key: 'Rechazada',  label: '🚫 Rechazadas' },
  { key: 'Cancelada',  label: '⚪ Canceladas' },
];

export default function MisSolicitudesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [filtro, setFiltro] = useState('TODAS');
  const [detalle, setDetalle] = useState(null);

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['mis-solicitudes', user?.idUsuario],
    queryFn: () => reservaSalasService.misSolicitudes(user.idUsuario),
    enabled: !!user?.idUsuario,
  });

  const visibles = useMemo(() => {
    if (filtro === 'TODAS') return solicitudes;
    return solicitudes.filter((s) => s.estado === filtro);
  }, [solicitudes, filtro]);

  // Conteo por estado (para mostrar en los tabs)
  const conteos = useMemo(() => {
    return solicitudes.reduce(
      (acc, s) => ({ ...acc, [s.estado]: (acc[s.estado] || 0) + 1 }),
      {}
    );
  }, [solicitudes]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">

        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
              Módulo de Reservas
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Mis Solicitudes
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Historial de solicitudes que has enviado al administrador.
            </p>
          </div>
          <button
            onClick={() => navigate('/reservas')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
          >
            &larr; Volver a reservas
          </button>
        </header>

        {/* Tabs de filtro */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTROS.map((f) => {
            const count = f.key === 'TODAS'
              ? solicitudes.length
              : conteos[f.key] || 0;
            const activo = filtro === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activo
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] font-extrabold px-1.5 rounded ${
                  activo ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-white py-12 rounded-2xl text-center text-[#486AE6] font-bold animate-pulse border border-slate-200">
              Cargando solicitudes...
            </div>
          ) : visibles.length === 0 ? (
            <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
              {filtro === 'TODAS'
                ? 'Aún no has enviado ninguna solicitud.'
                : `No tienes solicitudes en estado "${filtro}".`}
            </div>
          ) : (
            visibles.map((s) => (
              <SolicitudCard
                key={s.idSolicitud}
                solicitud={s}
                onView={setDetalle}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal de detalle */}
      <SolicitudDetailModal
        isOpen={!!detalle}
        onClose={() => setDetalle(null)}
        solicitud={detalle}
      />
    </div>
  );
}