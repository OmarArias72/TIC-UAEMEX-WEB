import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-8 text-center">
        <p className="text-7xl font-extrabold text-[#486AE6] mb-3">404</p>
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">
          Página no encontrada
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          La ruta que buscas no existe o fue movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2.5 rounded-xl shadow-md transition-all"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}