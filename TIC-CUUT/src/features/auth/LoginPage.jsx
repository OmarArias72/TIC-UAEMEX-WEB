import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      toast.success('Bienvenido al sistema');
      navigate('/aulas'); // Redirige al dashboard tras loguearse
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-uaem-blanco flex items-center justify-center relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full border-[12px] border-uaem-dorado opacity-20"></div>
      
      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h2 className="text-uaem-dorado font-bold uppercase text-sm tracking-widest mb-2">UAEMéx</h2>
          <h1 className="text-3xl font-bold text-uaem-verde">Inicio de Sesión</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-uaem-verde focus:ring-1 focus:ring-uaem-verde"
              placeholder="usuario@uaemex.mx"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-uaem-verde focus:ring-1 focus:ring-uaem-verde"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-uaem-verde hover:bg-green-800 text-white font-bold py-3 rounded-lg shadow-md transition-colors"
          >
            Ingresar al Sistema
          </button>
        </form>

        {/* Nuevo enlace para registro */}
        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-uaem-dorado font-bold hover:text-yellow-600 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}