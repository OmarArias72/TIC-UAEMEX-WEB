import React from 'react';

export default function InventoryFiltersBar({
  searchType, setSearchType,
  searchTerm, setSearchTerm,
  clearMainSearch,
  filterStartDate, setFilterStartDate,
  filterEndDate, setFilterEndDate,
  clearTableDates,
  hasActiveFilters, onClearAll,
  selectedEquipos, bulkState, setBulkState,
  onApplyBulk, isApplying,
}) {
  return (
    <div className="max-w-7xl mx-auto mb-4 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full xl:w-auto min-w-0">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="w-full sm:w-auto min-w-0 border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#486AE6] bg-white"
        >
          <option value="global">Búsqueda Global</option>
          <option value="serie">Por Número de Serie</option>
          <option value="articulo">Por Artículo</option>
          <option value="marca">Por Marca</option>
          <option value="modelo">Por Modelo</option>
        </select>

        <div className="relative w-full sm:w-64 min-w-0">
          <input
            type="text"
            placeholder={`Buscar por ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-xl pl-4 pr-9 py-2.5 text-sm outline-none focus:border-[#486AE6]"
          />
          {searchTerm && (
            <button
              onClick={clearMainSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:border-l sm:pl-3 sm:border-slate-200 w-full sm:w-auto">
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="flex-1 sm:flex-none min-w-0 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#486AE6]"
            title="Buscar desde..."
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="flex-1 sm:flex-none min-w-0 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#486AE6]"
            title="Buscar hasta..."
          />
          {(filterStartDate || filterEndDate) && (
            <button
              onClick={clearTableDates}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100"
              title="Limpiar fechas"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={onClearAll}
          disabled={!hasActiveFilters}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border whitespace-nowrap ${
            hasActiveFilters
              ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:border-rose-300'
              : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          Limpiar Todo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto bg-amber-50 p-2 rounded-xl border border-amber-200">
        <span className="text-xs font-bold text-amber-700 whitespace-nowrap px-2">
          Acción Masiva ({selectedEquipos.length}):
        </span>
        <select
          value={bulkState}
          onChange={(e) => setBulkState(e.target.value)}
          className="flex-1 sm:flex-none min-w-0 border border-amber-300 rounded-lg px-3 py-1.5 text-sm outline-none bg-white"
        >
          <option value="">Seleccionar Estado...</option>
          <option value="MANTENIMIENTO">MANTENIMIENTO</option>
          <option value="BAJA">BAJA</option>
        </select>
        <button
          onClick={onApplyBulk}
          disabled={isApplying}
          className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-1.5 px-4 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          {isApplying ? 'Aplicando...' : 'Aplicar'}
        </button>
      </div>
    </div>
  );
}