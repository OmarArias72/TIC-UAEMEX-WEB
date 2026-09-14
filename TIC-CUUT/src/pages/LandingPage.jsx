import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-uaem-blanco flex flex-col items-center justify-center relative overflow-hidden">
      {/* Círculos decorativos de fondo (Arcos geométricos) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full border-[12px] border-uaem-dorado opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full border-[16px] border-uaem-verde opacity-10"></div>

      <div className="z-10 text-center px-6 max-w-3xl">
        <h2 className="text-uaem-antracita font-semibold tracking-widest uppercase mb-2 text-sm">
          Universidad Autónoma del Estado de México
        </h2>
        <h1 className="text-5xl md:text-6xl font-bold text-uaem-verde mb-6 leading-tight">
          Sistema de Control <br />
          <span className="text-uaem-dorado">de Inventario</span>
        </h1>
        <p className="text-uaem-antracita text-lg mb-10 max-w-2xl mx-auto">
          Plataforma centralizada para la gestión, registro y seguimiento del equipo de cómputo y artículos institucionales.
        </p>

        <a 
          href="/inventario" 
          className="inline-block bg-uaem-dorado hover:bg-uaem-dorado-hover text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Ver Sección de Inventario
        </a>
      </div>

      <footer className="absolute bottom-6 text-uaem-antracita text-sm">
        Ciclo Escolar - Segunda Etapa | www.uaemex.mx
      </footer>
    </div>
  );
}