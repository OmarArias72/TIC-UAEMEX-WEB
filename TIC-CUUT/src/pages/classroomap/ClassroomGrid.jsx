import React from 'react';

export default function ClassroomGrid({ classrooms, onSelect, onEdit }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {classrooms.map((aula) => {
        // Calcular equipos con problemas para mostrar un indicador
        const problemas = aula.computers.filter(c => c.status !== 'Funcionando').length;

        return (
          <div key={aula.id} className="relative group">
            {/* Botón de edición flotante */}
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(aula); }}
              className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded text-gray-400 hover:text-uaem-dorado hover:bg-white z-10 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
              title="Editar nombre"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>

            {/* Tarjeta interactiva */}
            <button
              onClick={() => onSelect(aula.id)}
              className="w-full h-full bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-uaem-dorado transition-all flex flex-col items-center justify-center gap-3"
            >
              <svg className="w-10 h-10 text-gray-400 group-hover:text-uaem-verde transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <span className="text-xl font-bold text-uaem-antracita group-hover:text-uaem-verde">{aula.name}</span>
              
              {problemas > 0 && (
                <span className="absolute bottom-3 text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
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