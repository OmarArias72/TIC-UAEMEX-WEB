import React, { useState } from 'react';

export default function AdminConfigAgendaPage() {
  const [sistemaActivo, setSistemaActivo] = useState(true);

  return (
    <div className="p-6 bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl max-w-lg w-full text-center space-y-6">
        <div>
          <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">Módulo de Administración</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Control de Agenda</h1>
          <p className="text-sm text-slate-500 mt-1">
            Habilita o inactiva las reservas de salas para usuarios finales.
          </p>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="text-left">
            <span className="block text-sm font-bold text-slate-800">
              {sistemaActivo ? 'Módulo Activo' : 'Módulo Inactivo'}
            </span>
            <span className="text-xs text-slate-500">
              {sistemaActivo 
                ? 'Los usuarios pueden agendar salas.' 
                : 'Se han pausado nuevas agendas.'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSistemaActivo(!sistemaActivo)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors cursor-pointer ${
              sistemaActivo ? 'bg-[#486AE6]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                sistemaActivo ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}