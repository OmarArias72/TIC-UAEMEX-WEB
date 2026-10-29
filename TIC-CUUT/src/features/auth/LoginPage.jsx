import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    const result = await login(email, password);
    setCargando(false);

    if (result.success) {
      // Configuración de auto-desaparición a los 3 segundos (3000ms)
      toast.success('¡Bienvenido al sistema!', { duration: 3000 });
      navigate('/aulas');
    } else {
      toast.error(result.message || 'Credenciales incorrectas', { duration: 4000 });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center relative overflow-hidden p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#486AE6]/10 text-[#486AE6] font-semibold text-xs uppercase tracking-wider mb-3">
            UAEMéx - Control TIC
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Inicio de Sesión</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
              placeholder="admin@uaemex.mx"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-slate-800 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-[#486AE6] hover:bg-[#3b59c7] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#486AE6]/25 transition-all text-sm"
          >
            {cargando ? 'Autenticando...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-[#486AE6] font-semibold hover:text-[#A65D8B] transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}