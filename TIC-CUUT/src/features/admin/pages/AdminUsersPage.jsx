import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const { usersList, createUser, deleteUser, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  // Protección simple de ruta
  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso denegado. Se requieren permisos de administrador.</div>;
  }

  const handleCreate = (e) => {
    e.preventDefault();
    createUser(formData);
    toast.success('Usuario registrado exitosamente');
    setIsModalOpen(false);
    setFormData({ name: '', email: '', password: '', role: 'user' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-uaem-dorado font-semibold uppercase text-sm">Administración</h2>
            <h1 className="text-3xl font-bold text-uaem-verde">Gestión de Usuarios</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-uaem-dorado hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow"
          >
            + Crear Credenciales
          </button>
        </header>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-uaem-verde text-white text-sm uppercase">
                <th className="py-3 px-6">Nombre</th>
                <th className="py-3 px-6">Correo</th>
                <th className="py-3 px-6">Rol</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {usersList.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-6 font-bold">{u.name}</td>
                  <td className="py-3 px-6">{u.email}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      disabled={u.id === user.id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 font-bold text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Registro de Usuario */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-uaem-verde mb-4">Registrar Nuevo Usuario</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contraseña Provisional</label>
                  <input required type="text" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full border p-2 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nivel de Acceso</label>
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded text-sm">
                    <option value="user">Operador (Solo visualización/edición de aulas)</option>
                    <option value="admin">Administrador (Control total)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded text-sm font-bold text-gray-600">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-uaem-verde text-white rounded text-sm font-bold">Crear Credenciales</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}