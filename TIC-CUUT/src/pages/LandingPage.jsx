import React from 'react';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-center items-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Círculos decorativos tecnológicos de fondo */}
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 sm:w-96 sm:h-96 rounded-full border-[2px] border-[#486AE6]/30 bg-[#486AE6]/5 blur-sm pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 sm:w-[32rem] sm:h-[32rem] rounded-full border-[2px] border-[#7AD349]/40 bg-[#7AD349]/5 blur-sm pointer-events-none"></div>

      <div className="z-10 text-center my-auto max-w-3xl w-full">
        <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#486AE6]/10 text-[#486AE6] font-semibold tracking-wider uppercase mb-6 text-xs sm:text-sm border border-[#486AE6]/20">
          Universidad Autónoma del Estado de México
        </span>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
          Gestión inteligente de <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#486AE6] to-[#A65D8B]">
            Infraestructura & TIC
          </span>
        </h1>
        
        <p className="text-slate-600 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Plataforma centralizada para la reserva de salas, seguimiento de equipos e inventario institucional.
        </p>

        {/* SI NO HAY SESIÓN ACTIVA: Botones Principales de Inicio de Sesión y Registro */}
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="/login" 
              className="w-full sm:w-auto bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#486AE6]/25 hover:shadow-xl transition-all duration-300 text-base"
            >
              Iniciar Sesión
            </a>
            <a 
              href="/registro" 
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-xl border border-slate-200 shadow-sm transition-all text-base"
            >
              Registrarse
            </a>
          </div>
        ) : (
          /* SI HAY SESIÓN ACTIVA: Muestra bienvenida y acceso directo al sistema */
          <div className="bg-white p-6 rounded-2xl shadow-lg shadow-[#486AE6]/5 border border-slate-200 max-w-md mx-auto space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesión Iniciada</p>
            <p className="text-lg font-bold text-slate-800">
              Bienvenido(a), <span className="text-[#486AE6]">{user?.name}</span>
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="/aulas" 
                className="flex-1 bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all text-center shadow-md shadow-[#486AE6]/20"
              >
                Ver Mapa de Aulas
              </a>
              <a 
                href="/reservas" 
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all text-center"
              >
                Reservar Sala
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}