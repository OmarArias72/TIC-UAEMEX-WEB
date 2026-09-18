import React, { useState } from 'react';

const mockInventory = [
  { noInventario: "INV-2026-001", noSerie: "SN-9823749", articulo: "Laptop Dell XPS", marca: "Dell", modelo: "XPS 15", ubicacion: "L1", observacion: "Asignada a profesor", estado: "ALTA" },
  { noInventario: "INV-2026-002", noSerie: "SN-1029384", articulo: "Monitor UltraSharp", marca: "Dell", modelo: "U2720Q", ubicacion: "A1", observacion: "Sin base", estado: "ALTA" },
];

export default function InventoryPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">Universidad Autónoma del Estado de México</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Listado de Inventario</h1>
        </div>
        <a href="/" className="text-slate-500 hover:text-[#486AE6] transition-colors font-semibold text-sm">
          &larr; Volver al inicio
        </a>
      </div>

      {/* Controles */}
      <div className="max-w-7xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Desde</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#486AE6] focus:ring-1 focus:ring-[#486AE6]"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Hasta</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#486AE6] focus:ring-1 focus:ring-[#486AE6]"
            />
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm">
            PDF
          </button>
          <button className="flex-1 md:flex-none bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2 px-4 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all flex items-center justify-center gap-2 text-sm">
            Excel
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">No. Inventario</th>
                <th className="py-4 px-6 font-semibold">No. Serie</th>
                <th className="py-4 px-6 font-semibold">Artículo</th>
                <th className="py-4 px-6 font-semibold">Marca / Modelo</th>
                <th className="py-4 px-6 font-semibold">Ubicación</th>
                <th className="py-4 px-6 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
              {mockInventory.map((item) => (
                <tr key={item.noInventario} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#486AE6]">{item.noInventario}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{item.noSerie}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{item.articulo}</td>
                  <td className="py-4 px-6">
                    <span className="block font-medium">{item.marca}</span>
                    <span className="text-xs text-slate-400">{item.modelo}</span>
                  </td>
                  <td className="py-4 px-6">{item.ubicacion}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#7AD349]/20 text-slate-800">
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