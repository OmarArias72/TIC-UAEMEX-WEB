import React, { useState } from 'react';

export default function SolicitudExtra({ onClose, salasDisponibles = [], salaInicialId }) {
  const [solicitud, setSolicitud] = useState({
    id_sala: salaInicialId || (salasDisponibles[0]?.id_sala || ''),
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    justificacion: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando petición a los administradores:', solicitud);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-extrabold text-base">Solicitud Extraordinaria de Sala</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Usa este formulario si necesitas usar una sala en un horario ocupado. Esta petición será revisada por la administración.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sala Requerida</label>
              <select
                value={solicitud.id_sala}
                onChange={e => setSolicitud({...solicitud, id_sala: e.target.value})}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm font-medium focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
              >
                {salasDisponibles.length > 0 ? (
                  salasDisponibles.map(sala => (
                    <option key={sala.id_sala} value={sala.id_sala}>
                      {sala.codigo_sala} - {sala.nombre}
                    </option>
                  ))
                ) : (
                  <option value="">No hay salas configuradas</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Fecha</label>
              <input
                type="date"
                required
                value={solicitud.fecha}
                onChange={e => setSolicitud({...solicitud, fecha: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={solicitud.hora_inicio}
                  onChange={e => setSolicitud({...solicitud, hora_inicio: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Fin</label>
                <input
                  type="time"
                  required
                  value={solicitud.hora_fin}
                  onChange={e => setSolicitud({...solicitud, hora_fin: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Justificación</label>
              <textarea
                required
                rows="3"
                placeholder="Explica por qué necesitas la sala..."
                value={solicitud.justificacion}
                onChange={e => setSolicitud({...solicitud, justificacion: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none text-sm resize-none"
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3 justify-end border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#486AE6] hover:bg-[#3b59c7] text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}