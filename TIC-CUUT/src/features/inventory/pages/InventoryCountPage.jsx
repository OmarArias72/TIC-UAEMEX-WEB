import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../../api/services/inventoryService';

import InventoryCountHeader from '../components/InventoryCountHeader';
import InventoryCountTable from '../components/InventoryCountTable';

const AGRUPACIONES = [
  { key: 'articulo', label: 'Por Artículo' },
  { key: 'modelo',   label: 'Por Modelo'   },
];

const ESTADOS = [
  { key: 'TODOS',         label: 'Todos los estados', color: 'bg-slate-200' },
  { key: 'ALTA',          label: 'Solo ALTA',          color: 'bg-[#7AD349]' },
  { key: 'MANTENIMIENTO', label: 'Solo Mantenimiento', color: 'bg-amber-400' },
  { key: 'BAJA',          label: 'Solo BAJA',          color: 'bg-red-500' },
];

export default function InventoryCountPage() {
  const [agruparPor, setAgruparPor] = useState('articulo');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Resetear búsqueda al cambiar el modo de agrupación
  useEffect(() => {
    setSearchTerm('');
    setAppliedSearch('');
  }, [agruparPor]);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['conteo-inventario', agruparPor],
    queryFn: () =>
      agruparPor === 'modelo'
        ? inventoryService.contarPorModelo()
        : inventoryService.contarPorArticulo(),
  });

  // Filtro por texto (client-side)
  const filteredRows = useMemo(() => {
    const term = appliedSearch.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      (r.categoria || '').toLowerCase().includes(term)
    );
  }, [rows, appliedSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setAppliedSearch('');
  };

  const placeholder =
    agruparPor === 'modelo'
      ? 'Buscar por marca o modelo...'
      : 'Buscar por nombre de artículo...';

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <InventoryCountHeader />

      {/* Filtros */}
      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">

        {/* ── Formulario de búsqueda ── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-slate-100"
        >
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold rounded-xl shadow-md shadow-[#486AE6]/20 transition-all text-sm whitespace-nowrap"
          >
            Buscar
          </button>

          {appliedSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Limpiar
            </button>
          )}
        </form>

        {/* ── Agrupación + Estado ── */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Toggle de agrupación */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Agrupar por:
            </span>
            <div className="inline-flex bg-slate-100 rounded-xl p-1">
              {AGRUPACIONES.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAgruparPor(opt.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    agruparPor === opt.key
                      ? 'bg-white text-[#486AE6] shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="flex flex-wrap items-center gap-2 lg:border-l lg:pl-4 lg:border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estado:
            </span>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map((e) => (
                <button
                  key={e.key}
                  onClick={() => setFiltroEstado(e.key)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    filtroEstado === e.key
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${e.color}`} />
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indicador de resultados cuando hay búsqueda activa */}
        {appliedSearch && (
          <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <span className="text-slate-600">
              Filtrando por: <strong className="text-slate-900">"{appliedSearch}"</strong>
            </span>
            <span className="font-bold text-[#486AE6]">
              {filteredRows.length} de {rows.length} resultados
            </span>
          </div>
        )}
      </div>

      <InventoryCountTable
        rows={filteredRows}
        isLoading={isLoading}
        agruparPor={agruparPor}
        filtroEstado={filtroEstado}
        hasSearchFilter={!!appliedSearch}
        searchTerm={appliedSearch}
      />
    </div>
  );
}