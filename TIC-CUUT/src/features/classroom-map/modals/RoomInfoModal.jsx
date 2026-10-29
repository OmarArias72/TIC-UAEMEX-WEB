import React from 'react';

export default function RoomInfoModal({ isOpen, onClose, room, onViewComputers }) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md">
              {room.codigoSala || 'Sin código'}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {room.nombre || 'Sala sin nombre'}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-red-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Ubicación
            </p>
            <p className="text-sm text-slate-700 flex items-start gap-2">
              <span></span>
              <span>{room.ubicacion || 'No especificada'}</span>
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Descripción
            </p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {room.descripcion || 'Sin descripción registrada.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onViewComputers(room);
              onClose();
            }}
            className="flex-1 bg-[#486AE6] hover:bg-[#3b59c7] text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#486AE6]/20 transition-all"
          >
            Ver equipos
          </button>
        </div>
      </div>
    </div>
  );
}