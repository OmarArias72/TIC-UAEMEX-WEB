import React, { useState } from 'react';

export default function AdminConfigAgenda() {
  const [sistemaActivo, setSistemaActivo] = useState(true);

  return (
    <div className="p-6 bg-slate-100 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-lg w-full text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Control de Disponibilidad del Sistema</h1>
          <p className="text-sm text-slate-500">
            Habilita o inhabilita el módulo de reservas de salas para todos los usuarios.
          </p>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-5 rounded-lg border border-slate-200">
          <div className="text-left">
            <span className="block text-sm font-bold text-slate-800">
              {sistemaActivo ? 'Módulo Habilitado' : 'Módulo Inhabilitado'}
            </span>
            <span className="text-xs text-slate-500">
              {sistemaActivo 
                ? 'Los usuarios pueden ver salas y agendar reservas.' 
                : 'El acceso a nuevas reservas está bloqueado.'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSistemaActivo(!sistemaActivo)}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
              sistemaActivo ? 'bg-[#536855]' : 'bg-slate-300'
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