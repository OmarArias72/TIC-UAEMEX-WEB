import React from 'react';

export default function StatusLegend() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Leyenda de Estados</h4>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /> <span>Funcionando</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /> <span>No funciona</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full" /> <span>Requiere revisión</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> <span>Requiere Mantenimiento</span></div>
      </div>
    </div>
  );
}