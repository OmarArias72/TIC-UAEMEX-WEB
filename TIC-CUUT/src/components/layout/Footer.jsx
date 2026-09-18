import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7AD349]"></div>
          <span className="font-semibold text-slate-200">UAEMéx - Gestión de Tecnologías</span>
        </div>
        
        <p className="text-slate-400">
          Ciclo Escolar - Segunda Etapa |{' '}
          <a 
            href="https://www.uaemex.mx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#486AE6] hover:text-[#7AD349] transition-colors underline decoration-slate-700 underline-offset-4"
          >
            www.uaemex.mx
          </a>
        </p>
      </div>
    </footer>
  );
}