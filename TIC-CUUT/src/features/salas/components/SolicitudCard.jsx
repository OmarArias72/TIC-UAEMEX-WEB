import React from 'react';

const ESTADO_STYLES = {
  Pendiente:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  Aprobada:   { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-[#7AD349]'  },
  Rechazada:  { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500'    },
  Cancelada:  { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-700',  dot: 'bg-slate-400'  },
};

export default function SolicitudCard({ solicitud, onView }) {
  const style = ESTADO_STYLES[solicitud.estado] || ESTADO_STYLES.Pendiente;
  const esRechazada = solicitud.estado === 'Rechazada';

  return (
    <button
      onClick={() => onView(solicitud)}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-[#486AE6]/40 hover:shadow-md transition-all p-5"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Bloque principal */}
        <div className="space-y-2 flex-1 min-w-0">
          {/* Encabezado: código sala + fecha */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase text-[#A65D8B] bg-[#A65D8B]/10 px-2 py-0.5 rounded-md">
              {solicitud.codigoSala}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {solicitud.fecha} · {solicitud.horaInicio}–{solicitud.horaFin}
            </span>
          </div>

          {/* Nombre de la sala */}
          <p className="font-extrabold text-slate-800">
            {solicitud.nombreSala || 'Sala sin nombre'}
          </p>

          {/* Justificación enviada */}
          <p className="text-xs text-slate-500 italic line-clamp-2">
            "{solicitud.justificacion}"
          </p>

          {/* ⬇️ Motivo de rechazo — DESTACADO EN LA CARD */}
          {esRechazada && (
            <div className="mt-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-3">
              <p className="text-[10px] font-extrabold text-red-700 uppercase tracking-widest mb-1">
                🚫 Motivo del rechazo
              </p>
              <p className="text-xs text-red-800 leading-relaxed font-medium">
                {solicitud.motivoRechazo || 'No se especificó un motivo.'}
              </p>
              {solicitud.adminAtendio && (
                <p className="text-[10px] text-red-600/70 italic mt-1.5">
                  Atendida por: {solicitud.adminAtendio}
                </p>
              )}
            </div>
          )}

          {/* ⬇️ Info si fue aprobada */}
          {solicitud.estado === 'Aprobada' && solicitud.idUsoGenerado && (
            <p className="text-[11px] text-green-700 font-semibold mt-2">
              ✅ Reserva generada #{solicitud.idUsoGenerado}
            </p>
          )}
        </div>

        {/* Columna derecha: estado + botón */}
        <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${style.bg} ${style.text} border ${style.border}`}
          >
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {solicitud.estado}
          </span>
          <span className="text-[#486AE6] font-bold text-xs hover:underline whitespace-nowrap">
            Ver detalle →
          </span>
        </div>
      </div>
    </button>
  );
}