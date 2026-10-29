import React from 'react';

export default function AdminUsersHeader({ onCreate }) {
  return (
    <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">
          Módulo de Administración
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Gestión de Usuarios</h1>
      </div>
      <button
        onClick={onCreate}
        className="bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span> Crear Credenciales
      </button>
    </header>
  );
}