import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { reservaSalasService } from '../../../api/services/reservaSalasService';
import { salaService } from '../../../api/services/salaService';

export default function ApproveRequestModal({ isOpen, onClose, solicitud, idAdmin }) {
  const queryClient = useQueryClient();
  const [idSalaDestino, setIdSalaDestino] = useState(solicitud?.idSala ?? null);
  const [horaInicio, setHoraInicio] = useState(solicitud?.horaInicio ?? '08:00');
  const [horaFin, setHoraFin] = useState(solicitud?.horaFin ?? '10:00');

  const { data: salas = [] } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.listarTodas,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (payload) => reservaSalasService.aprobarSolicitud(payload),
    onSuccess: () => {
      toast.success('Solicitud aprobada y reserva creada');
      queryClient.invalidateQueries({ queryKey: ['solicitudes-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!isOpen || !solicitud) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      idSolicitud: solicitud.idSolicitud,
      idAdmin,
      idSalaDestino,
      horaInicio,
      horaFin,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Aprobar solicitud</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            <strong>{solicitud.profesor}</strong> solicita reservar el{' '}
            <strong>{solicitud.fecha}</strong> de <strong>{solicitud.horaInicio}</strong> a{' '}
            <strong>{solicitud.horaFin}</strong>.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Sala destino *
            </label>
            <select
              required
              value={idSalaDestino ?? ''}
              onChange={(e) => setIdSalaDestino(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-white"
            >
              <option value="">— Selecciona —</option>
              {salas.map((s) => (
                <option key={s.idSala} value={s.idSala}>
                  {s.codigoSala} — {s.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#7AD349] hover:bg-green-600 rounded-xl shadow-md"
            >
              Aprobar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}