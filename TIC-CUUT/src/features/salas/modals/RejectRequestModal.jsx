import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { reservaSalasService } from '../../../api/services/reservaSalasService';

export default function RejectRequestModal({ isOpen, onClose, solicitud, idAdmin }) {
  const queryClient = useQueryClient();
  const [motivo, setMotivo] = useState('');

  const mutation = useMutation({
    mutationFn: (payload) => reservaSalasService.rechazarSolicitud(payload),
    onSuccess: () => {
      toast.success('Solicitud rechazada');
      queryClient.invalidateQueries({ queryKey: ['solicitudes-pendientes'] });
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
      motivoRechazo: motivo,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Rechazar solicitud</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Rechazarás la solicitud de <strong>{solicitud.profesor}</strong>.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Motivo de rechazo *
            </label>
            <textarea
              required
              rows="3"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica el motivo"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm"
            />
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-md"
            >
              Rechazar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}