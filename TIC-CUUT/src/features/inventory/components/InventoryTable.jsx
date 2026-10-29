import React from 'react';

export default function InventoryTable({
  inventory,
  isLoading,
  isError,
  error,
  selectedEquipos,
  onSelectAll,
  onSelectItem,
  onEdit,
  onDelete,
}) {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-4 px-4 font-semibold text-center w-12">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={inventory.length > 0 && selectedEquipos.length === inventory.length}
                  className="w-4 h-4 rounded border-slate-300 text-[#486AE6]"
                />
              </th>
              <th className="py-4 px-6 font-semibold">No. Inventario / Serie</th>
              <th className="py-4 px-6 font-semibold">Artículo</th>
              <th className="py-4 px-6 font-semibold">Marca / Modelo</th>
              <th className="py-4 px-6 font-semibold text-center">Cant.</th>
              <th className="py-4 px-6 font-semibold">Estado / Registro</th>
              <th className="py-4 px-6 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan="7" className="py-12 text-center text-slate-500 font-semibold animate-pulse">Cargando inventario...</td></tr>
            ) : isError ? (
              <tr><td colSpan="7" className="py-12 text-center text-red-500 font-semibold">Error: {error.message}</td></tr>
            ) : inventory.length === 0 ? (
              <tr><td colSpan="7" className="py-12 text-center text-slate-500 font-semibold">No se encontraron equipos bajo estos criterios.</td></tr>
            ) : (
              inventory.map((item) => (
                <tr
                  key={item.inventario}
                  className={`hover:bg-slate-50 transition-colors ${
                    selectedEquipos.includes(item.inventario) ? 'bg-[#486AE6]/5' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedEquipos.includes(item.inventario)}
                      onChange={() => onSelectItem(item.inventario)}
                      className="w-4 h-4 rounded border-slate-300 text-[#486AE6]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <span className="block font-semibold text-[#486AE6]">{item.inventario}</span>
                    <span className="font-mono text-xs text-slate-500">{item.serie || 'N/A'}</span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {item.nombreArticulo || item.articulo?.nombreArticulo || 'Sin Articulo'}
                  </td>
                  <td className="py-4 px-6">
                    <span className="block font-bold text-slate-800">
                      {item.marca || item.modelo?.marca?.nombreMarca}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.modelo || item.modelo?.nombreModelo}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-semibold">{item.cantidad}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block mb-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.estado === 'ALTA'
                          ? 'bg-[#7AD349]/20 text-[#68b83e]'
                          : item.estado === 'BAJA'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.estado || 'N/A'}
                    </span>
                    <span className="block text-xs font-medium text-slate-500">
                      {item.fechaRegistro
                        ? new Date(item.fechaRegistro).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-[#486AE6] hover:text-[#3b59c7] font-bold text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(item.inventario)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}