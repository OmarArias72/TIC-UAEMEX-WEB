import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'react-hot-toast';

export default function AdminUsersPage() {
  const { usersList, createUser, deleteUser, user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">Módulo de Administración</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Gestión de Usuarios</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Crear Credenciales
          </button>
        </header>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Nombre</th>
                  <th className="py-4 px-6 font-semibold">Correo</th>
                  <th className="py-4 px-6 font-semibold">Rol</th>
                  <th className="py-4 px-6 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{u.name}</td>
                    <td className="py-4 px-6 text-slate-600">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-[#A65D8B]/10 text-[#A65D8B] border border-[#A65D8B]/20' 
                          : 'bg-[#486AE6]/10 text-[#486AE6] border border-[#486AE6]/20'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => deleteUser(u.id)}
                        disabled={u.id === user.id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:hover:text-red-500 font-bold text-xs transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Registro de Usuario */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">Registrar Nuevo Usuario</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nombre Completo</label>
                  <input 
                    required type="text" value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Correo Electrónico</label>
                  <input 
                    required type="email" value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Contraseña Provisional</label>
                  <input 
                    required type="text" value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nivel de Acceso</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value})} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
                  >
                    <option value="user">Operador (Visualización/Edición de Aulas)</option>
                    <option value="admin">Administrador (Control Total)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-slate-100">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-[#486AE6] hover:bg-[#3b59c7] text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    Crear Credenciales
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}