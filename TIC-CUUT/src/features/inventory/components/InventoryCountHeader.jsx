import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InventoryCountHeader() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
          Universidad Autónoma del Estado de México
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          Conteo de Inventario
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Total de equipos agrupados por artículo o modelo, con desglose por estado.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        <button
          onClick={() => navigate('/inventario')}
          className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
        >
          &larr; Volver al inventario
        </button>
      </div>
    </div>
  );
}