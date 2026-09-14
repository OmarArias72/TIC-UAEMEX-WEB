import React, { useState } from 'react';

export default function RegistroUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    password: '',
    id_rol: '2' // Por defecto un rol estándar
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos listos para encriptar password e insertar en Usuarios:', formData);
    // Aquí iría el POST al backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-[#536855]">Registro de Nuevo Usuario</h2>
          <p className="text-sm text-slate-500 mt-2">Completa los datos para dar de alta en el sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre(s)</label>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C89F5C] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                required
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C89F5C] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C89F5C] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C89F5C] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol Asignado (id_rol)</label>
            <select
              name="id_rol"
              value={formData.id_rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#C89F5C] focus:border-transparent outline-none bg-white"
            >
              <option value="1">Administrador (1)</option>
              <option value="2">Estudiante/Usuario (2)</option>
              <option value="3">Docente (3)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#536855] hover:bg-[#435344] text-white font-medium rounded-md transition-colors mt-4"
          >
            Registrar Usuario
          </button>
        </form>
      </div>
    </div>
  );
}