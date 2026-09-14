import React, { useState, useEffect } from 'react';

export default function RoomFormModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(initialData ? initialData.name : '');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-uaem-verde">
            {initialData ? 'Editar Nombre de Sala' : 'Registrar Nueva Sala'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre / Identificador de la Sala *</label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ej. L1, A2, C6"
              className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-uaem-verde focus:ring-1 focus:ring-uaem-verde" 
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-uaem-verde rounded hover:bg-green-800">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}