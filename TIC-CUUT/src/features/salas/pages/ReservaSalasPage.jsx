import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { salaService } from '../../../api/services/salaService';
import { reservaSalasService } from '../../../api/services/reservaSalasService';
import { useAuthStore } from '../../../store/authStore';

import RoomReservationModal from '../components/RoomReservationModal';

import { useNavigate } from 'react-router-dom';

const todayStr = () => new Date().toISOString().split('T')[0];

/* ============================================================
 * InfoTooltip
 * ------------------------------------------------------------
 * Icono de información con tooltip accesible.
 * - Se muestra al pasar el cursor (hover).
 * - También al enfocar con teclado (Tab) o al hacer click en móvil.
 * - Se oculta al hacer click fuera.
 * ============================================================ */
function InfoTooltip({ text, tone = 'blue', position = 'bottom-right' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Cerrar al hacer click fuera (útil para móvil / touch)
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  const toneClasses =
    tone === 'pink'
      ? 'text-[#A65D8B] hover:bg-[#A65D8B]/10 focus:ring-[#A65D8B]/30'
      : 'text-[#486AE6] hover:bg-[#486AE6]/10 focus:ring-[#486AE6]/30';

  const positionClasses =
    position === 'bottom-right'
      ? 'right-0 mt-2'
      : position === 'bottom-left'
      ? 'left-0 mt-2'
      : 'right-0 mt-2';

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={text}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors outline-none focus:ring-2 ${toneClasses}`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M12 8h.01M11 12h1v5h1" />
        </svg>
      </button>

      {open && (
        <span
          role="tooltip"
          className={`absolute ${positionClasses} z-30 w-72 max-w-[85vw] bg-slate-900 text-white text-xs leading-relaxed rounded-xl px-4 py-3 shadow-xl border border-slate-700 pointer-events-none`}
        >
          {text}
          <span className="block absolute -top-1.5 right-4 w-3 h-3 bg-slate-900 rotate-45 border-l border-t border-slate-700" />
        </span>
      )}
    </span>
  );
}

export default function ReservaSalasPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const esProfesor = user?.nombreRol === 'Profesor';

  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [fecha, setFecha] = useState(todayStr());
  const [reservingRoom, setReservingRoom] = useState(null);

  // ==== Queries ====
  const { data: salas = [], isLoading: loadingSalas } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.listarTodas,
  });

  // Selección inicial: primera sala disponible
  useEffect(() => {
    if (!selectedSalaId && salas.length > 0) {
      setSelectedSalaId(salas[0].idSala);
    }
  }, [salas, selectedSalaId]);

  const { data: agenda = [], isLoading: loadingAgenda } = useQuery({
    queryKey: ['agenda', selectedSalaId, fecha],
    queryFn: () => reservaSalasService.obtenerAgenda(selectedSalaId, fecha),
    enabled: !!selectedSalaId && !!fecha,
  });

  const salaSeleccionada = salas.find((s) => s.idSala === selectedSalaId) || null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8 flex flex-col md:flex-row gap-6">
      <Toaster position="top-right" />

      {/* Modal de reserva (directa o extraordinaria) */}
      {reservingRoom && (
        <RoomReservationModal
          isOpen={!!reservingRoom}
          onClose={() => setReservingRoom(null)}
          sala={reservingRoom}
          idUsuario={user?.idUsuario ?? null}
        />
      )}

      {/* Sidebar - Listado de Salas */}
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 h-fit space-y-4">
        <div>
          <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">
            Infraestructura
          </span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">Salas Disponibles</h3>
        </div>
        {esProfesor && (
          <button
            onClick={() => navigate('/reservas/mis-solicitudes')}
            className="w-full text-left bg-[#A65D8B]/10 hover:bg-[#A65D8B]/20 border border-[#A65D8B]/30 rounded-xl px-4 py-3 transition-colors"
          >
            <span className="block font-bold text-xs uppercase tracking-wider text-[#A65D8B]">
              Solicitudes
            </span>
            <span className="block font-semibold text-sm text-slate-800 mt-0.5">
              Ver mis solicitudes
            </span>
          </button>
        )}

        {loadingSalas ? (
          <p className="text-xs text-slate-400 animate-pulse">Cargando salas...</p>
        ) : salas.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No hay salas registradas.</p>
        ) : (
          <div className="space-y-2">
            {salas.map((sala) => (
              <button
                key={sala.idSala}
                onClick={() => setSelectedSalaId(sala.idSala)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  selectedSalaId === sala.idSala
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="block font-bold text-xs uppercase tracking-wider opacity-90">
                  {sala.codigoSala}
                </span>
                <span className="block font-semibold text-sm mt-0.5">
                  {sala.nombre || 'Sin nombre'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#486AE6] font-semibold text-xs uppercase tracking-wider">
                    Disponibilidad de Agenda
                  </span>

                  {/* Icono "¿Para qué sirve esta sección?" — SOLO Profesor */}
                  {esProfesor && (
                    <InfoTooltip
                      tone="pink"
                      position="bottom-left"
                      text="¿Para qué sirve esta sección? Es para reservar el acceso a salas en periodo de exámenes ordinario, extraordinario y título. Con esto, el área de tecnologías tiene información sobre el uso, se facilita la comunicación y se le da acceso a la sala."
                    />
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {salaSeleccionada
                    ? salaSeleccionada.nombre || salaSeleccionada.codigoSala
                    : 'Selecciona una sala'}
                </h2>
                {salaSeleccionada?.ubicacion && (
                  <p className="text-xs text-slate-500 mt-1"> {salaSeleccionada.ubicacion}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
              {/* Input de fecha + icono de ayuda */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
                <InfoTooltip
                  text="La fecha que selecciones muestra las reservaciones que tiene esta sala para ese día. Cambia la fecha para consultar otro día."
                  position="bottom-right"
                />
              </div>

              <button
  disabled={!salaSeleccionada}
  onClick={() => setReservingRoom(salaSeleccionada)}
  className="..."
  title="Puedes reservar directamente o enviar una solicitud al administrador"
>
  + Nueva reserva / solicitud
</button>
            </div>
          </div>

          {/* Tabla de horarios ocupados */}
          <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold text-left">Horario</th>
                  <th className="px-6 py-4 font-semibold text-left">Profesor / Responsable</th>
                  <th className="px-6 py-4 font-semibold text-left">Propósito</th>
                  <th className="px-6 py-4 font-semibold text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {loadingAgenda ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-[#486AE6] font-bold animate-pulse"
                    >
                      Cargando agenda...
                    </td>
                  </tr>
                ) : !salaSeleccionada ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500 italic"
                    >
                      Selecciona una sala para ver su agenda.
                    </td>
                  </tr>
                ) : agenda.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500 italic"
                    >
                      No hay reservas registradas para esta fecha. ¡Todos los horarios están
                      disponibles!
                    </td>
                  </tr>
                ) : (
                  agenda.map((u) => (
                    <tr key={u.idUso} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {u.horaInicio} - {u.horaFin}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{u.profesor}</td>
                      <td className="px-6 py-4 text-slate-600">{u.proposito || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            u.estado === 'Confirmada'
                              ? 'bg-green-50 text-green-700 border-green-100'
                              : u.estado === 'Cancelada'
                              ? 'bg-red-50 text-red-600 border-red-100'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}