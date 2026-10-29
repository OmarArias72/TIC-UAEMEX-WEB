import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { solicitudTecnicaService } from '../../../api/services/solicitudTecnicaService';

export default function CrearSolicitudTecnicaModal({ isOpen, onClose, onSuccess, idUsuario }) {
  const [idTipo, setIdTipo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar catálogo de tipos
  const { data: tipos = [] } = useQuery({
    queryKey: ['tipos-solicitud'],
    queryFn: solicitudTecnicaService.obtenerTipos,
    enabled: isOpen,
  });

  // Resetear al abrir
  useEffect(() => {
    if (isOpen && tipos.length > 0) {
      setIdTipo(tipos[0].idTipo.toString());
      setMotivo('');
    }
  }, [isOpen, tipos]);

  if (!isOpen) return null;

  const tipoSeleccionado = tipos.find((t) => t.idTipo.toString() === idTipo);
  const esOtro = tipoSeleccionado?.nombre === 'OTRO';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await solicitudTecnicaService.crearSolicitud(idUsuario, {
        idTipo: Number(idTipo),
        motivo: motivo.trim(),
      });
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900">Nueva Solicitud</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              ¿Qué necesitas? *
            </label>
            <select
              required
              value={idTipo}
              onChange={(e) => setIdTipo(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
            >
              {tipos.map((t) => (
                <option key={t.idTipo} value={t.idTipo}>
                  {t.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Motivo o Detalle {esOtro ? '*' : '(Opcional)'}
            </label>
            <textarea
              required={esOtro}
              rows="4"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Explica brevemente por qué requieres este soporte..."
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Si seleccionaste "Otro", describe tu problema a detalle.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
            <span>⚠️</span>
            <span>Solo puedes tener <strong>3 solicitudes activas</strong> y esperar <strong>24 horas</strong> para pedir otro reinicio del mismo tipo.</span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || tipos.length === 0}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] rounded-xl shadow-md hover:bg-[#3b59c7] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}