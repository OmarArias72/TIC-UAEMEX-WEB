import React from 'react';

const ESTADO_STYLES = {
  ALTA: 'bg-[#7AD349]/20 text-[#4d8a1e] border-[#7AD349]/40',
  MANTENIMIENTO: 'bg-amber-100 text-amber-700 border-amber-200',
  BAJA: 'bg-red-100 text-red-700 border-red-200',
};

/**
 * Barra proporcional horizontal.
 */
function DistributionBar({ total, alta, baja, mantenimiento }) {
  if (!total) return <div className="w-full h-2 bg-slate-100 rounded-full" />;

  const pctAlta = (alta / total) * 100;
  const pctMant = (mantenimiento / total) * 100;
  const pctBaja = (baja / total) * 100;

  return (
    <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 flex">
      {pctAlta > 0 && <div className="bg-[#7AD349] h-full" style={{ width: `${pctAlta}%` }} />}
      {pctMant > 0 && <div className="bg-amber-400 h-full" style={{ width: `${pctMant}%` }} />}
      {pctBaja > 0 && <div className="bg-red-500 h-full" style={{ width: `${pctBaja}%` }} />}
    </div>
  );
}

export default function InventoryCountTable({
  rows,
  isLoading,
  agruparPor,
  filtroEstado,
  hasSearchFilter = false,
  searchTerm = '',
}) {
  // Filtro local por estado
  const visible = rows.filter((r) => {
    if (filtroEstado === 'TODOS') return true;
    if (filtroEstado === 'ALTA') return r.alta > 0;
    if (filtroEstado === 'BAJA') return r.baja > 0;
    if (filtroEstado === 'MANTENIMIENTO') return r.mantenimiento > 0;
    return true;
  });

  // Totales de la vista
  const totals = visible.reduce(
    (acc, r) => ({
      total: acc.total + (r.total || 0),
      alta: acc.alta + (r.alta || 0),
      baja: acc.baja + (r.baja || 0),
      mantenimiento: acc.mantenimiento + (r.mantenimiento || 0),
    }),
    { total: 0, alta: 0, baja: 0, mantenimiento: 0 }
  );

  // Mensaje de vacío contextual
  const emptyMessage = hasSearchFilter
    ? `No se encontraron resultados para "${searchTerm}"${agruparPor === 'modelo' ? ' en marca/modelo' : ' en artículos'}.`
    : filtroEstado !== 'TODOS'
    ? 'No hay equipos que coincidan con el filtro de estado seleccionado.'
    : 'No hay datos de inventario para mostrar.';

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">
                {agruparPor === 'modelo' ? 'Marca / Modelo' : 'Artículo'}
              </th>
              <th className="py-4 px-6 font-semibold text-center w-24">Total</th>
              <th className="py-4 px-4 font-semibold text-center w-24">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7AD349]" /> ALTA
                </span>
              </th>
              <th className="py-4 px-4 font-semibold text-center w-32">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Mantenimiento
                </span>
              </th>
              <th className="py-4 px-4 font-semibold text-center w-24">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> BAJA
                </span>
              </th>
              <th className="py-4 px-6 font-semibold w-48">Distribución</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[#486AE6] font-semibold animate-pulse">
                  Calculando conteos...
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visible.map((r) => (
                <tr key={r.categoria} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {r.categoria}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-extrabold text-sm">
                      {r.total}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {r.alta > 0 ? (
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ESTADO_STYLES.ALTA}`}>
                        {r.alta}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {r.mantenimiento > 0 ? (
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ESTADO_STYLES.MANTENIMIENTO}`}>
                        {r.mantenimiento}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {r.baja > 0 ? (
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${ESTADO_STYLES.BAJA}`}>
                        {r.baja}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <DistributionBar
                      total={r.total}
                      alta={r.alta}
                      mantenimiento={r.mantenimiento}
                      baja={r.baja}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {!isLoading && visible.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td className="py-4 px-6 font-extrabold text-slate-900 uppercase text-xs tracking-wider">
                  Total general
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-sm">
                    {totals.total}
                  </span>
                </td>
                <td className="py-4 px-4 text-center font-extrabold text-[#4d8a1e]">{totals.alta}</td>
                <td className="py-4 px-4 text-center font-extrabold text-amber-700">{totals.mantenimiento}</td>
                <td className="py-4 px-4 text-center font-extrabold text-red-700">{totals.baja}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}