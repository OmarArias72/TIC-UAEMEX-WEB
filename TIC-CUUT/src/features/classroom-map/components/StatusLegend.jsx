import React from 'react';

export default function StatusLegend() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase mb-4 tracking-widest">Leyenda de Estados</h4>
      <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#7AD349] rounded-full shadow-sm" /> <span>Funcionando</span></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" /> <span>No funciona</span></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm" /> <span>Requiere revisión</span></div>
        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#486AE6] rounded-full shadow-sm" /> <span>Mantenimiento</span></div>
      </div>
    </div>
  );
}