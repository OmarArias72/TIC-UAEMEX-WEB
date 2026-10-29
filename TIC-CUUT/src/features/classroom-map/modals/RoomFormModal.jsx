import React, { useState, useEffect } from 'react';

const EMPTY_FORM = {
  codigoSala: '',
  nombre: '',
  ubicacion: '',
  descripcion: '',
};

export default function RoomFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        codigoSala: initialData.codigoSala || '',
        nombre: initialData.nombre || '',
        ubicacion: initialData.ubicacion || '',
        descripcion: initialData.descripcion || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enviamos el payload tal cual lo espera SalaDTO
    const payload = {
      codigoSala: (formData.codigoSala || '').trim(),
      nombre: (formData.nombre || '').trim() || null,
      ubicacion: (formData.ubicacion || '').trim() || null,
      descripcion: formData.descripcion || '',
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 my-auto">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-slate-900">
            {initialData ? 'Editar Sala' : 'Registrar Nueva Sala'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 font-bold transition-colors"
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Código de Sala *
            </label>
            <input
              required
              type="text"
              name="codigoSala"
              value={formData.codigoSala || ''}
              onChange={handleChange}
              placeholder="Ej. L1, A2, C6"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              placeholder="Ej. Laboratorio de Redes"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion || ''}
              onChange={handleChange}
              placeholder="Ej. Edificio A, Piso 2"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Detalles adicionales de la sala..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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