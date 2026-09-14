import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-uaem-antracita text-uaem-blanco py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
        <h3 className="font-semibold text-uaem-dorado mb-2">
          Universidad Autónoma del Estado de México
        </h3>
        <p className="text-sm text-gray-300">
          Ciclo Escolar - Segunda Etapa |{' '}
          <a 
            href="https://www.uaemex.mx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-uaem-dorado transition-colors underline"
          >
            www.uaemex.mx
          </a>
        </p>
      </div>
    </footer>
  );
}