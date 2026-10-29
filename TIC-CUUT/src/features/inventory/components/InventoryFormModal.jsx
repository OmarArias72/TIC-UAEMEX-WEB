import React, { useEffect } from 'react';

const EMPTY = {
  inventario: '', serie: '', nombreArticulo: '', marca: '',
  modelo: '', cantidad: 1, caracteristicas: '', estado: 'ALTA',
};

export default function InventoryFormModal({
  isOpen, onClose, onSubmit, initialData, isSaving,
}) {
  const [formData, setFormData] = React.useState(EMPTY);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        inventario: initialData.inventario ?? '',
        serie: initialData.serie ?? '',
        nombreArticulo: initialData.nombreArticulo ?? initialData.articulo?.nombreArticulo ?? '',
        marca: initialData.marca ?? initialData.modelo?.marca?.nombreMarca ?? '',
        modelo: initialData.modelo ?? initialData.modelo?.nombreModelo ?? '',
        cantidad: initialData.cantidad ?? 1,
        caracteristicas: initialData.caracteristicas ?? '',
        estado: initialData.estado ?? 'ALTA',
      });
    } else {
      setFormData(EMPTY);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-5 sm:p-6 md:p-8 my-auto">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">
          {isEditing ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">No. Inventario *</label>
              <input
                required
                type="text"
                disabled={isEditing}
                value={formData.inventario}
                onChange={(e) => setFormData({ ...formData, inventario: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">No. Serie</label>
              <input
                type="text"
                value={formData.serie}
                onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Artículo *</label>
              <input
                required
                type="text"
                placeholder="Ej. Laptop, Monitor"
                value={formData.nombreArticulo}
                onChange={(e) => setFormData({ ...formData, nombreArticulo: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Marca *</label>
              <input
                required
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Modelo *</label>
              <input
                required
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Cantidad *</label>
              <input
                required
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Características</label>
              <textarea
                rows="3"
                value={formData.caracteristicas}
                onChange={(e) => setFormData({ ...formData, caracteristicas: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] bg-white"
              >
                <option value="ALTA">ALTA</option>
                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                <option value="BAJA">BAJA</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#486AE6] hover:bg-[#3b59c7] text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : 'Guardar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}