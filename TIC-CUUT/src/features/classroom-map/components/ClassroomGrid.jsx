import React from 'react';

export default function ClassroomGrid({ classrooms, roomSummary = {}, onSelect, onEdit, onView }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {classrooms.map((aula) => {
        const s = roomSummary[aula.idSala] || {
          total: 0,
          funcionando: 0,
          revision: 0,
          mantenimiento: 0,
          noFunciona: 0,
          problemas: 0,
        };

        const hasIssues = s.revision > 0 || s.mantenimiento > 0 || s.noFunciona > 0;

        return (
          <div key={aula.idSala} className="relative group">
            {/* Botón editar (esquina superior) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(aula);
              }}
              className="absolute top-3 right-3 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-[#486AE6] hover:bg-blue-50 z-10 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              title="Editar sala"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-[#486AE6]/10 hover:border-[#486AE6]/40 transition-all p-6 flex flex-col h-full">
              {/* Encabezado: icono + nombre + código */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-[#486AE6]/10 transition-colors">
                  <svg
                    className="w-8 h-8 text-slate-400 group-hover:text-[#486AE6] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-base font-extrabold text-slate-800 group-hover:text-[#486AE6] transition-colors leading-tight">
                    {aula.nombre || aula.codigoSala || 'Sin nombre'}
                  </h3>
                  {aula.codigoSala && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md">
                      {aula.codigoSala}
                    </span>
                  )}
                </div>
              </div>

              {/* Info resumida: solo ubicación */}
              <div className="text-xs text-slate-600 mb-4 flex-1">
                <div className="flex items-start gap-2">

                  <span className="line-clamp-2" title={aula.ubicacion || ''}>
                    {aula.ubicacion || 'Sin ubicación'}
                  </span>
                </div>
              </div>

              {/* Badges de conteo por estado crítico */}
              {hasIssues && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.revision > 0 && (
                    <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                      🟠 {s.revision} por revisar
                    </span>
                  )}
                  {s.mantenimiento > 0 && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      🔵 {s.mantenimiento} en mant.
                    </span>
                  )}
                  {s.noFunciona > 0 && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      🔴 {s.noFunciona} no funciona
                    </span>
                  )}
                </div>
              )}

              {/* Total (opcional, info pequeña) */}
              <div className="mb-3 text-[10px] font-semibold text-slate-400 text-center">
                {s.total} {s.total === 1 ? 'equipo' : 'equipos'} en total
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => onView(aula)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Ver
                </button>
                <button
                  onClick={() => onSelect(aula.idSala)}
                  className="flex-1 bg-[#486AE6] hover:bg-[#3b59c7] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-[#486AE6]/20 transition-all"
                >
                  Ver equipos
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}