import React from 'react';

export default function ReportFiltersBar({
  repStartDate, setRepStartDate,
  repEndDate, setRepEndDate,
  filterArticulo, setFilterArticulo,
  onClear, onDownload,
}) {
  const hasFilters = repStartDate || repEndDate || filterArticulo;

  return (
    <div className="max-w-7xl mx-auto mb-6 bg-slate-900 p-4 rounded-2xl shadow-md flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto text-white min-w-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 w-full sm:w-auto">
          Filtros para Reportes:
        </span>
        <input
          type="date"
          value={repStartDate}
          onChange={(e) => setRepStartDate(e.target.value)}
          className="flex-1 sm:flex-none min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none text-slate-200 focus:border-[#486AE6]"
          title="Fecha Inicio"
        />
        <span className="text-slate-500">-</span>
        <input
          type="date"
          value={repEndDate}
          onChange={(e) => setRepEndDate(e.target.value)}
          className="flex-1 sm:flex-none min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none text-slate-200 focus:border-[#486AE6]"
          title="Fecha Fin"
        />
        <input
          type="text"
          placeholder="Tipo Artículo (Ej. Laptop)"
          value={filterArticulo}
          onChange={(e) => setFilterArticulo(e.target.value)}
          className="w-full sm:w-48 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm outline-none text-slate-200 focus:border-[#486AE6]"
        />
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-white font-bold text-sm w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-700"
            title="Limpiar filtros de reporte"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
        <button
          onClick={() => onDownload('pdf')}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow-sm transition-all text-sm whitespace-nowrap"
        >
          Bajar PDF
        </button>
        <button
          onClick={() => onDownload('csv')}
          className="flex-1 bg-[#7AD349] hover:bg-[#68b83e] text-white font-bold py-2 px-6 rounded-xl shadow-sm transition-all text-sm whitespace-nowrap"
        >
          Bajar Excel (CSV)
        </button>
      </div>
    </div>
  );
}