import React from 'react';

const ROLE_STYLES = {
  Admin: 'bg-[#A65D8B]/10 text-[#A65D8B] border-[#A65D8B]/20',
  'Operador-tics': 'bg-amber-100 text-amber-700 border-amber-200',
  Profesor: 'bg-[#486AE6]/10 text-[#486AE6] border-[#486AE6]/20',
};

export default function AdminUsersTable({
  users, isLoading, currentUserId,
  onEdit, onDelete, onToggleStatus, isTogglingStatus,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Nombre Completo</th>
              <th className="py-4 px-6 font-semibold">Correo</th>
              <th className="py-4 px-6 font-semibold text-center">Rol</th>
              <th className="py-4 px-6 font-semibold text-center">Estado</th>
              <th className="py-4 px-6 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500 font-bold animate-pulse">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">
                  No se encontraron usuarios con esos criterios.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.idUsuario === currentUserId;
                return (
                  <tr key={u.idUsuario} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.nombre} {u.apellidos}
                      {isSelf && (
                        <span className="ml-2 text-[10px] font-bold uppercase bg-[#486AE6]/10 text-[#486AE6] px-2 py-0.5 rounded-md">
                          Tú
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{u.correo}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                          ROLE_STYLES[u.nombreRol] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.nombreRol}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.activo
                            ? 'bg-[#7AD349]/20 text-[#68b83e]'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {u.activo ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => onEdit(u)}
                          className="text-[#486AE6] hover:text-[#3b59c7] font-bold text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onToggleStatus(u)}
                          disabled={isSelf || isTogglingStatus}
                          className={`font-bold text-xs transition-colors ${
                            u.activo
                              ? 'text-amber-600 hover:text-amber-800'
                              : 'text-green-600 hover:text-green-800'
                          } disabled:opacity-30 disabled:cursor-not-allowed`}
                        >
                          {u.activo ? 'Suspender' : 'Activar'}
                        </button>
                        <button
                          onClick={() => onDelete(u)}
                          disabled={isSelf}
                          className="text-red-500 hover:text-red-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}