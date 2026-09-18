import React from 'react';

export default function ComputerDetails({ computer, onEdit, onDelete }) {
  if (!computer) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500 text-sm">
        Selecciona un equipo para ver sus detalles.
      </div>
    );
  }

  const statusColors = {
    'Funcionando': 'bg-[#7AD349] text-slate-900',
    'No funciona': 'bg-red-500 text-white',
    'Requiere revision': 'bg-yellow-500 text-slate-900',
    'Requiere Mantenimiento': 'bg-[#486AE6] text-white'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-[#486AE6]/5 border border-[#486AE6]/20">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Ubicación: {computer.name}</h3>
          <p className="text-xs text-slate-500 font-mono mt-1">ID: {computer.inventario}</p>
        </div>
        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-sm ${statusColors[computer.status] || 'bg-slate-500 text-white'}`}>
          {computer.status}
        </span>
      </div>
      
      <div className="space-y-3 text-sm text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p><strong className="text-slate-900">Hardware:</strong> {computer.especificaciones_hardware}</p>
        <p><strong className="text-slate-900">OS:</strong> {computer.sistema_operativo}</p>
        <p><strong className="text-slate-900">Software:</strong> {computer.software_instalado}</p>
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs font-medium">
          <p className="flex items-center gap-1">⌨️ {computer.estado_teclado}</p>
          <p className="flex items-center gap-1">🖱️ {computer.estado_mouse}</p>
          <p className="flex items-center gap-1">🖥️ {computer.estado_monitor}</p>
          <p className="flex items-center gap-1">🔌 {computer.estado_cable_ethernet}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onEdit(computer)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          Actualizar
        </button>
        <button 
          onClick={() => onDelete(computer.id_equipo_computo)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          🗑️ Borrar
        </button>
      </div>
    </div>
  );
}