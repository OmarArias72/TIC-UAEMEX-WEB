import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { reservaSalasService } from '../../../api/services/reservaSalasService';

const todayStr = () => new Date().toISOString().split('T')[0];

/**
 * Modo de envío:
 *  - 'directa'    → POST /reservas-salas/reservar
 *  - 'solicitud'  → POST /reservas-salas/solicitud-extra
 */
export default function RoomReservationModal({
  isOpen,
  onClose,
  sala,
  idUsuario,
}) {
  const queryClient = useQueryClient();

  const [fecha, setFecha] = useState(todayStr());
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('10:00');
  const [proposito, setProposito] = useState('');
  const [justificacion, setJustificacion] = useState('');

  const [modo, setModo] = useState('directa');       // 'directa' | 'solicitud'
  const [forzarSolicitud, setForzarSolicitud] = useState(false); // tras conflicto

  // Agenda del día
  const { data: agenda = [], isLoading: isLoadingAgenda } = useQuery({
    queryKey: ['agenda', sala?.idSala, fecha],
    queryFn: () => reservaSalasService.obtenerAgenda(sala.idSala, fecha),
    enabled: !!sala && !!fecha && isOpen,
  });

  // Resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setModo('directa');
      setForzarSolicitud(false);
      setProposito('');
      setJustificacion('');
    }
  }, [isOpen]);

  // ============ Mutaciones ============
  const directMutation = useMutation({
    mutationFn: (payload) => reservaSalasService.registrarReservaDirecta(payload),
    onSuccess: () => {
      toast.success('Reserva confirmada');
      queryClient.invalidateQueries({ queryKey: ['agenda', sala.idSala, fecha] });
      onClose();
    },
    onError: (err) => {
      // Si hay conflicto, sugerimos automáticamente cambiar a modo solicitud
      setForzarSolicitud(true);
      setModo('solicitud');
      toast.error(err.message || 'No se pudo reservar directamente. Puedes enviar una solicitud al admin.');
    },
  });

  const extraMutation = useMutation({
    mutationFn: (payload) => reservaSalasService.registrarSolicitudExtra(payload),
    onSuccess: () => {
      toast.success('Solicitud enviada al administrador');
      onClose();
    },
    onError: (err) => toast.error(err.message || 'No se pudo enviar la solicitud'),
  });

  if (!isOpen || !sala) return null;

  const basePayload = {
    idSala: sala.idSala,
    idUsuario,
    fecha,
    horaInicio,
    horaFin,
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modo === 'directa') {
      directMutation.mutate({ ...basePayload, proposito });
    } else {
      if (!justificacion.trim()) {
        toast.error('La justificación es obligatoria para enviar una solicitud');
        return;
      }
      extraMutation.mutate({ ...basePayload, justificacion });
    }
  };

  const isPending = directMutation.isPending || extraMutation.isPending;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Reservar Sala</h2>
            <p className="text-xs text-slate-500 mt-1">
              {sala.nombre} · {sala.codigoSala}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Agenda del día */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-3">
              Agenda del día ({fecha})
            </h3>
            {isLoadingAgenda ? (
              <p className="text-sm text-slate-400">Cargando...</p>
            ) : agenda.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No hay reservas registradas para este día.
              </p>
            ) : (
              <div className="space-y-2">
                {agenda.map((u) => (
                  <div
                    key={u.idUso}
                    className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm"
                  >
                    <div>
                      <span className="font-bold text-slate-700">
                        {u.horaInicio} – {u.horaFin}
                      </span>
                      <span className="text-slate-500 ml-2">· {u.profesor}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md">
                      {u.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ============ SELECTOR DE MODO ============ */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-3">
              ¿Qué deseas hacer?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción: Reserva directa */}
              <button
                type="button"
                onClick={() => setModo('directa')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  modo === 'directa'
                    ? 'border-[#486AE6] bg-[#486AE6]/5 shadow-md shadow-[#486AE6]/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    modo === 'directa' ? 'border-[#486AE6]' : 'border-slate-300'
                  }`}>
                    {modo === 'directa' && (
                      <span className="w-2 h-2 rounded-full bg-[#486AE6]" />
                    )}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    Reservar ahora
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Si el horario está libre, la reserva se confirma al instante.
                </p>
              </button>

              {/* Opción: Solo enviar solicitud */}
              <button
                type="button"
                onClick={() => setModo('solicitud')}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  modo === 'solicitud'
                    ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    modo === 'solicitud' ? 'border-orange-500' : 'border-slate-300'
                  }`}>
                    {modo === 'solicitud' && (
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    Enviar solicitud al admin
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Envía una petición sin modificar la agenda. Requiere aprobación.
                </p>
              </button>
            </div>
          </section>

          {/* Aviso cuando se forzó el cambio por conflicto */}
          {forzarSolicitud && modo === 'solicitud' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-800 flex items-start gap-2">
              <span>⚠️</span>
              <span>
                El horario elegido entra en conflicto con una reserva existente.
                Envía una <strong>solicitud extraordinaria</strong> para que el administrador la revise.
              </span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  required
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Hora inicio *
                </label>
                <input
                  type="time"
                  required
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Hora fin *
                </label>
                <input
                  type="time"
                  required
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>
            </div>

            {/* Propósito (solo reserva directa) */}
            {modo === 'directa' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Propósito
                </label>
                <input
                  type="text"
                  value={proposito}
                  onChange={(e) => setProposito(e.target.value)}
                  placeholder="Ej. Clase de Programación"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>
            )}

            {/* Justificación (solo solicitud) */}
            {modo === 'solicitud' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Justificación *
                </label>
                <textarea
                  required
                  rows="3"
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  placeholder="Explica por qué necesitas este horario y sala"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all disabled:opacity-50 ${
                  modo === 'solicitud'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-[#486AE6] hover:bg-[#3b59c7]'
                }`}
              >
                {isPending
                  ? 'Enviando...'
                  : modo === 'solicitud'
                  ? 'Enviar solicitud al admin'
                  : 'Reservar ahora'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}