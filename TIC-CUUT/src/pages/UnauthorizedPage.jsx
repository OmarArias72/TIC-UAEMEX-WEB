import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-5">
          <span className="text-3xl">🚫</span>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Acceso denegado
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Tu cuenta {user?.nombreRol && (
            <span className="font-semibold text-slate-700">
              ({user.nombreRol})
            </span>
          )}{' '}
          no tiene permisos para ver esta sección.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2.5 rounded-xl shadow-md transition-all"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}