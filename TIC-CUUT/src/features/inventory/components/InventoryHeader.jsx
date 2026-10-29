import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InventoryHeader({ onAdd }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
          Universidad Autónoma del Estado de México
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Gestión de Inventario
        </h1>
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <button
          onClick={() => navigate('/inventario/conteo')}
          className="flex-1 md:flex-none bg-[#486AE6]/10 hover:bg-[#486AE6]/20 text-[#486AE6] font-bold py-2 px-5 rounded-xl text-sm transition-colors"
        >
          📊 Ver conteos
        </button>
        <button
          onClick={onAdd}
          className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
        >
          + Nuevo Equipo
        </button>
        <a
          href="/"
          className="flex-1 md:flex-none text-center text-[#486AE6] hover:text-[#3b59c7] transition-colors font-bold text-sm bg-[#486AE6]/10 px-4 py-2 rounded-xl"
        >
          &larr; Volver
        </a>
      </div>
    </div>
  );
}