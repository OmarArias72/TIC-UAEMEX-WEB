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
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
        
        <div className="bg-[#536855] px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Solicitud Extraordinaria de Sala</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold">
            ✕
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-600 mb-5">
            Usa este formulario si necesitas usar una sala en un horario que ya aparece marcado como ocupado. Esta petición será revisada manualmente.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selector dinámico de salas */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar Sala Requerida</label>
              <select
                value={solicitud.id_sala}
                onChange={e => setSolicitud({...solicitud, id_sala: e.target.value})}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-700 font-medium focus:ring-1 focus:ring-[#C89F5C] outline-none"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                <input
                  type="date"
                  required
                  value={solicitud.fecha}
                  onChange={e => setSolicitud({...solicitud, fecha: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#C89F5C] outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">De</label>
                  <input
                    type="time"
                    required
                    value={solicitud.hora_inicio}
                    onChange={e => setSolicitud({...solicitud, hora_inicio: e.target.value})}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hasta</label>
                  <input
                    type="time"
                    required
                    value={solicitud.hora_fin}
                    onChange={e => setSolicitud({...solicitud, hora_fin: e.target.value})}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Justificación del Empalme</label>
              <textarea
                required
                rows="3"
                placeholder="Explica por qué necesitas la sala en este horario específico..."
                value={solicitud.justificacion}
                onChange={e => setSolicitud({...solicitud, justificacion: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#C89F5C] outline-none text-sm resize-none"
              ></textarea>
            </div>

            <div className="pt-4 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md font-medium text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C89F5C] hover:bg-[#b08b4e] text-white rounded-md font-medium text-sm transition-colors"
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