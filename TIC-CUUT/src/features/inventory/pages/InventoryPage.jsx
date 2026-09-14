import React, { useState } from 'react';

const mockInventory = [
  { noInventario: "INV-2026-001", noSerie: "SN-9823749", articulo: "Laptop Dell XPS", marca: "Dell", modelo: "XPS 15", ubicacion: "L1", observacion: "Asignada a profesor", estado: "ALTA" },
  { noInventario: "INV-2026-002", noSerie: "SN-1029384", articulo: "Monitor UltraSharp", marca: "Dell", modelo: "U2720Q", ubicacion: "A1", observacion: "Sin base", estado: "ALTA" },
];

export default function InventoryPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="min-h-screen bg-uaem-blanco p-8">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-uaem-dorado font-semibold uppercase text-sm mb-1">Universidad Autónoma del Estado de México</h2>
          <h1 className="text-3xl font-bold text-uaem-verde">Listado de Inventario</h1>
        </div>
        <a href="/" className="text-uaem-antracita hover:text-uaem-verde transition-colors font-medium">
          &larr; Volver al inicio
        </a>
      </div>

      {/* Panel de Controles: Fechas y Exportación */}
      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-uaem-borde flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Selector de Fechas */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col">
            <label className="text-xs text-uaem-antracita font-medium mb-1">Desde</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-uaem-verde focus:ring-1 focus:ring-uaem-verde"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-uaem-antracita font-medium mb-1">Hasta</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-uaem-verde focus:ring-1 focus:ring-uaem-verde"
            />
          </div>
        </div>

        {/* Botones de Exportación */}
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors flex items-center justify-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            PDF
          </button>
          <button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow transition-colors flex items-center justify-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Excel
          </button>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-uaem-borde overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-uaem-verde text-white text-sm uppercase tracking-wide">
                <th className="py-4 px-6 font-medium">No. Inventario</th>
                <th className="py-4 px-6 font-medium">No. Serie</th>
                <th className="py-4 px-6 font-medium">Artículo</th>
                <th className="py-4 px-6 font-medium">Marca / Modelo</th>
                <th className="py-4 px-6 font-medium">Ubicación</th>
                <th className="py-4 px-6 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="text-uaem-antracita text-sm">
              {mockInventory.map((item, index) => (
                <tr key={item.noInventario} className={`border-b border-uaem-borde hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-4 px-6 font-medium text-uaem-verde">{item.noInventario}</td>
                  <td className="py-4 px-6">{item.noSerie}</td>
                  <td className="py-4 px-6 font-medium">{item.articulo}</td>
                  <td className="py-4 px-6">
                    <span className="block">{item.marca}</span>
                    <span className="text-xs text-gray-500">{item.modelo}</span>
                  </td>
                  <td className="py-4 px-6">{item.ubicacion}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-uaem-verde-ligero text-uaem-verde">
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}