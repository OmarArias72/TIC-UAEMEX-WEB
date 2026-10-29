import React, { useEffect, useState } from 'react';

const EMPTY = {
  nombre: '', apellidos: '', correo: '',
  password: '', idRol: 3, activo: true,
};

export default function UserFormModal({
  isOpen, onClose, onSubmit, initialData, isSaving,
}) {
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setFormData({
        nombre: initialData.nombre ?? '',
        apellidos: initialData.apellidos ?? '',
        correo: initialData.correo ?? '',
        password: '',                     // Nunca prellenar por seguridad
        idRol: initialData.idRol ?? 3,
        activo: initialData.activo ?? true,
      });
    } else {
      setFormData(EMPTY);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (isEditing && !payload.password.trim()) delete payload.password;
    onSubmit(payload, isEditing);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 my-auto">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">
          {isEditing ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nombre(s)</label>
              <input
                required type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Apellidos</label>
              <input
                required type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Correo Electrónico</label>
            <input
              required type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              {isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña Provisional'}
            </label>
            <input
              required={!isEditing}
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEditing ? 'Dejar vacío para no cambiar' : ''}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nivel de Acceso</label>
            <select
              value={formData.idRol}
              onChange={(e) => setFormData({ ...formData, idRol: Number(e.target.value) })}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-white outline-none focus:border-[#486AE6]"
            >
              <option value={1}>Administrador</option>
              <option value={2}>Operador-tics</option>
              <option value={3}>Profesor</option>
            </select>
          </div>

          {isEditing && (
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-[#486AE6]"
              />
              Usuario activo
            </label>
          )}

          <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
            <button
              type="button" onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit" disabled={isSaving}
              className="px-5 py-2.5 bg-[#486AE6] hover:bg-[#3b59c7] text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear Credenciales'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}