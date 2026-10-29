import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import { solicitudTecnicaService } from '../../../api/services/solicitudTecnicaService';

import SolicitudTecnicaCard from '../components/SolicitudTecnicaCard';
import CrearSolicitudTecnicaModal from '../modals/CrearSolicitudTecnicaModal';
import DetalleSolicitudAlumnoModal from '../modals/DetalleSolicitudAlumnoModal';

export default function MisSolicitudesTecnicasPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ['mis-solicitudes-tecnicas', user?.idUsuario],
    queryFn: () => solicitudTecnicaService.misSolicitudes(user?.idUsuario),
    enabled: !!user?.idUsuario,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
              Mesa de Ayuda
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              Mis Solicitudes Técnicas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestiona tus solicitudes de contraseña, autenticador o soporte técnico.
            </p>
          </div>
          
          <button
            onClick={() => setIsCrearOpen(true)}
            className="bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all text-sm"
          >
            + Nueva Solicitud
          </button>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white py-12 rounded-2xl text-center text-[#486AE6] font-bold animate-pulse">
              Cargando solicitudes...
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="bg-white py-16 rounded-2xl text-center border-2 border-dashed border-slate-200">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-slate-500 font-medium">No tienes solicitudes registradas.</p>
              <p className="text-xs text-slate-400 mt-1">Haz clic en "Nueva Solicitud" si necesitas asistencia.</p>
            </div>
          ) : (
            solicitudes.map((solicitud) => (
              <SolicitudTecnicaCard
                key={solicitud.idSolicitud}
                solicitud={solicitud}
                onView={setSelectedSolicitud}
              />
            ))
          )}
        </div>

      </div>

      {/* Modal para Crear Solicitud */}
      <CrearSolicitudTecnicaModal
        isOpen={isCrearOpen}
        onClose={() => setIsCrearOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['mis-solicitudes-tecnicas'] });
          setIsCrearOpen(false);
          toast.success('Solicitud enviada exitosamente');
        }}
        idUsuario={user?.idUsuario}
      />

      {/* Modal de Detalle (Llenar formulario, ver historial, cancelar) */}
      <DetalleSolicitudAlumnoModal
        isOpen={!!selectedSolicitud}
        onClose={() => setSelectedSolicitud(null)}
        solicitud={selectedSolicitud}
        idUsuario={user?.idUsuario}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['mis-solicitudes-tecnicas'] })}
      />

    </div>
  );
}