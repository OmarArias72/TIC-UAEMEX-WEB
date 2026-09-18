import React, { useState, useEffect } from 'react';

export default function ComputerFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    inventario: '', especificaciones_hardware: '', sistema_operativo: '',
    software_instalado: '', estado_teclado: 'Bueno', estado_mouse: 'Bueno',
    estado_cable_ethernet: 'Conectado', estado_monitor: 'Bueno', status: 'Funcionando'
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({
      inventario: '', especificaciones_hardware: '', sistema_operativo: '', software_instalado: '', 
      estado_teclado: 'Bueno', estado_mouse: 'Bueno', estado_cable_ethernet: 'Conectado', estado_monitor: 'Bueno', status: 'Funcionando'
    });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-900">
            {initialData ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold transition-colors">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">No. Inventario *</label>
              <input required type="text" name="inventario" value={formData.inventario} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado General</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-white outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20">
                <option value="Funcionando">Funcionando</option>
                <option value="No funciona">No funciona</option>
                <option value="Requiere revision">Requiere revisión</option>
                <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hardware</label>
              <textarea name="especificaciones_hardware" value={formData.especificaciones_hardware} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20" rows="2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Software Instalado</label>
              <textarea name="software_instalado" value={formData.software_instalado} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20" rows="2" />
            </div>
            {/* ... (Otros campos mantienen la misma clase que los inputs anteriores) ... */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Sistema Operativo</label>
              <input type="text" name="sistema_operativo" value={formData.sistema_operativo} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado Monitor</label>
              <input type="text" name="estado_monitor" value={formData.estado_monitor} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20" />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] rounded-xl shadow-md hover:bg-[#3b59c7] transition-all">Guardar Equipo</button>
          </div>
        </form>
      </div>
    </div>
  );
}