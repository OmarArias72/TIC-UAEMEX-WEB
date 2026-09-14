import React from 'react';

export default function ComputerDetails({ computer, onEdit, onDelete }) {
  if (!computer) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
        Selecciona un equipo para ver sus detalles.
      </div>
    );
  }

  const statusColors = {
    'Funcionando': 'bg-green-500',
    'No funciona': 'bg-red-500',
    'Requiere revision': 'bg-yellow-500 text-gray-900',
    'Requiere Mantenimiento': 'bg-blue-500'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-uaem-dorado">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-uaem-verde">Ubicación: {computer.name}</h3>
          <p className="text-xs text-gray-500 font-mono mt-1">ID: {computer.inventario}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm text-white ${statusColors[computer.status] || 'bg-gray-500'}`}>
          {computer.status}
        </span>
      </div>
      
      <div className="space-y-3 text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded border">
        <p><strong>Hardware:</strong> {computer.especificaciones_hardware}</p>
        <p><strong>OS:</strong> {computer.sistema_operativo}</p>
        <p><strong>Software:</strong> {computer.software_instalado}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t text-xs">
          <p>⌨️ Teclado: {computer.estado_teclado}</p>
          <p>🖱️ Mouse: {computer.estado_mouse}</p>
          <p>🖥️ Monitor: {computer.estado_monitor}</p>
          <p>🔌 Red: {computer.estado_cable_ethernet}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onEdit(computer)}
          className="flex-1 bg-uaem-dorado hover:bg-yellow-600 text-white py-2 rounded text-sm font-medium transition-colors"
        >
          ✏️ Actualizar
        </button>
        <button 
          onClick={() => onDelete(computer.id_equipo_computo)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors"
        >
          🗑️ Borrar
        </button>
      </div>
    </div>
  );
}