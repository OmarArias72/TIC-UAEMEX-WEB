import React from 'react';

const ROLES = [
  { value: '', label: 'Todos los roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Operador-tics', label: 'Operador-tics' },
  { value: 'Profesor', label: 'Profesor' },
];

export default function AdminUsersFilters({
  searchTerm, setSearchTerm,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter,
  onClear, hasFilters,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-6">
      {/* Búsqueda */}
      <div className="relative w-full lg:w-72">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-slate-300 rounded-xl pl-4 pr-9 py-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filtro por rol */}
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="w-full lg:w-48 border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#486AE6] bg-white"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>

      {/* Filtro por estado */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full lg:w-40 border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#486AE6] bg-white"
      >
        <option value="">Todos los estados</option>
        <option value="activo">Activos</option>
        <option value="inactivo">Suspendidos</option>
      </select>

      {/* Limpiar */}
      <button
        onClick={onClear}
        disabled={!hasFilters}
        className={`lg:ml-auto w-full lg:w-auto px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors whitespace-nowrap ${
          hasFilters
            ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
            : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
        }`}
      >
        Limpiar filtros
      </button>
    </div>
  );
}