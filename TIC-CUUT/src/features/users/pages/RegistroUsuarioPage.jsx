import React, { useState } from 'react';

export default function RegistroUsuarioPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    id_rol: '2'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos listos:', formData);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Registro de Usuario</h2>
          <p className="text-sm text-slate-500 mt-1">Alta de nuevos accesos al sistema de infraestructura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                required
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rol Asignado</label>
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none bg-white text-slate-800 transition-all"
            >
              <option value="1">Administrador (1)</option>
              <option value="2">Estudiante / Usuario (2)</option>
              <option value="3">Docente (3)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold rounded-xl shadow-lg shadow-[#486AE6]/25 transition-all mt-6 text-sm"
          >
            Registrar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}