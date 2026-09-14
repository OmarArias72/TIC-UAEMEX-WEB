import React, { useState, useEffect } from 'react';

export default function ComputerFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    inventario: '',
    especificaciones_hardware: '',
    sistema_operativo: '',
    software_instalado: '',
    estado_teclado: 'Bueno',
    estado_mouse: 'Bueno',
    estado_cable_ethernet: 'Conectado',
    estado_monitor: 'Bueno',
    status: 'Funcionando'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        inventario: '', especificaciones_hardware: '', sistema_operativo: '',
        software_instalado: '', estado_teclado: 'Bueno', estado_mouse: 'Bueno',
        estado_cable_ethernet: 'Conectado', estado_monitor: 'Bueno', status: 'Funcionando'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-uaem-verde">
            {initialData ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">No. Inventario *</label>
              <input required type="text" name="inventario" value={formData.inventario} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Estado General</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm bg-white">
                <option value="Funcionando">Funcionando</option>
                <option value="No funciona">No funciona</option>
                <option value="Requiere revision">Requiere revisión</option>
                <option value="Requiere Mantenimiento">Requiere Mantenimiento</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Especificaciones de Hardware</label>
              <textarea name="especificaciones_hardware" value={formData.especificaciones_hardware} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" rows="2" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Software Instalado</label>
              <textarea name="software_instalado" value={formData.software_instalado} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" rows="2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sistema Operativo</label>
              <input type="text" name="sistema_operativo" value={formData.sistema_operativo} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Estado Monitor</label>
              <input type="text" name="estado_monitor" value={formData.estado_monitor} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Estado Teclado</label>
              <input type="text" name="estado_teclado" value={formData.estado_teclado} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Estado Mouse</label>
              <input type="text" name="estado_mouse" value={formData.estado_mouse} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 text-sm" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-uaem-verde rounded hover:bg-green-800">Guardar Equipo</button>
          </div>
        </form>
      </div>
    </div>
  );
}