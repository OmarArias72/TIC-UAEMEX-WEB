import React from 'react';

export default function ClassroomGrid({ classrooms, onSelect, onEdit }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {classrooms.map((aula) => {
        const problemas = aula.computers?.filter(c => c.status !== 'Funcionando').length || 0;

        return (
          <div key={aula.id} className="relative group">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(aula); }}
              className="absolute top-3 right-3 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-[#486AE6] hover:bg-blue-50 z-10 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
              title="Editar nombre"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>

            <button
              onClick={() => onSelect(aula.id)}
              className="w-full h-full bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-[#486AE6]/10 hover:border-[#486AE6]/40 transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-[#486AE6]/10 transition-colors">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-[#486AE6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <span className="text-lg font-extrabold text-slate-800 group-hover:text-[#486AE6] transition-colors">{aula.name}</span>
              
              {problemas > 0 && (
                <span className="absolute bottom-4 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full shadow-sm">
                  {problemas} con problemas
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}