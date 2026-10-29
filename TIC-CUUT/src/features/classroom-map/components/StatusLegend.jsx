import React from 'react';

const LEGEND = [
  { color: 'bg-[#7AD349]', label: 'Funcionando' },
  { color: 'bg-orange-500', label: 'Requiere revisión' },
  { color: 'bg-[#486AE6]', label: 'Requiere Mantenimiento' },
  { color: 'bg-red-500', label: 'No funciona' },
];

export default function StatusLegend() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <h4 className="text-[11px] font-extrabold text-slate-400 uppercase mb-4 tracking-widest">
        Leyenda de Estados
      </h4>
      <div className="flex flex-col gap-3 text-sm font-medium text-slate-700">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shadow-sm ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}