import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { reservaSalasService } from '../../../api/services/reservaSalasService';
import { salaService } from '../../../api/services/salaService';

const extractDate = (fechaISO) => (fechaISO ? fechaISO.split('T')[0] : '');

export default function ReassignReservationModal({ isOpen, onClose, reserva, idAdmin }) {
  const queryClient = useQueryClient();
  const [idSalaDestino, setIdSalaDestino] = useState(reserva?.idSala ?? null);
  const [fecha, setFecha] = useState(extractDate(reserva?.fechaInicio) || '');
  const [horaInicio, setHoraInicio] = useState(reserva?.horaInicio ?? '08:00');
  const [horaFin, setHoraFin] = useState(reserva?.horaFin ?? '10:00');

  const { data: salas = [] } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.listarTodas,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: (payload) => reservaSalasService.reasignarReserva(payload),
    onSuccess: () => {
      toast.success('Reserva reasignada');
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!isOpen || !reserva) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      idUso: reserva.idUso,
      idAdmin,
      idSalaDestino,
      fecha,
      horaInicio,
      horaFin,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Reasignar reserva</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100">
            <p>
              <strong>Actual:</strong> {reserva.codigoSala} · {extractDate(reserva.fechaInicio)} ·{' '}
              {reserva.horaInicio}–{reserva.horaFin}
            </p>
            <p className="mt-1">
              <strong>Profesor:</strong> {reserva.profesor}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Nueva sala *
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] hover:bg-[#3b59c7] rounded-xl shadow-md"
            >
              Reasignar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}