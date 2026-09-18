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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-slate-900">
            {initialData ? 'Editar Nombre de Sala' : 'Registrar Nueva Sala'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre / Identificador *</label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ej. L1, A2, C6"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all" 
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] rounded-xl shadow-md hover:bg-[#3b59c7] transition-all"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}