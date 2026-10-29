import React from 'react';

const ESTADO_STYLES = {
  Pendiente:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  Aprobada:   { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-[#7AD349]'  },
  Rechazada:  { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    dot: 'bg-red-500'    },
  Cancelada:  { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-700',  dot: 'bg-slate-400'  },
};

export default function SolicitudDetailModal({ isOpen, onClose, solicitud }) {
  if (!isOpen || !solicitud) return null;

  const style = ESTADO_STYLES[solicitud.estado] || ESTADO_STYLES.Pendiente;
  const esRechazada = solicitud.estado === 'Rechazada';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-200 my-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md">
              Solicitud #{solicitud.idSolicitud}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              {solicitud.nombreSala || 'Sala sin nombre'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {solicitud.codigoSala}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Estado */}
          <div className={`flex items-center justify-between ${style.bg} ${style.border} border rounded-xl px-4 py-3`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
              <span className={`text-sm font-extrabold ${style.text}`}>
                Estado: {solicitud.estado}
              </span>
            </div>
            {solicitud.fechaSolicitud && (
              <span className="text-[11px] text-slate-500 font-medium">
                Enviada: {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Fecha y hora solicitada */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Fecha
              </p>
              <p className="text-sm font-bold text-slate-800">
                {solicitud.fecha}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Horario
              </p>
              <p className="text-sm font-bold text-slate-800">
                {solicitud.horaInicio} – {solicitud.horaFin}
              </p>
            </div>
          </div>

          {/* Justificación */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Justificación enviada
            </p>
            <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 italic leading-relaxed">
              "{solicitud.justificacion}"
            </p>
          </div>

          {/* Motivo de rechazo (destacado) */}
          {esRechazada && (
  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
    <div className="flex items-start gap-3">
      <span className="text-3xl leading-none">🚫</span>
      <div className="flex-1">
        <p className="text-xs font-extrabold text-red-700 uppercase tracking-widest mb-2">
          Motivo del rechazo
        </p>
        <p className="text-sm text-red-900 leading-relaxed font-medium whitespace-pre-wrap">
          {solicitud.motivoRechazo || 'No se especificó un motivo.'}
        </p>
        {solicitud.adminAtendio && (
          <div className="mt-3 pt-3 border-t border-red-200">
            <p className="text-[11px] text-red-700/80">
              <strong>Atendida por:</strong> {solicitud.adminAtendio}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
          {/* Info si fue aprobada */}
          {solicitud.estado === 'Aprobada' && solicitud.idUsoGenerado && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800 flex items-start gap-2">
              <span>✅</span>
              <span>
                Tu solicitud fue aprobada. Se generó la reserva{' '}
                <strong>#{solicitud.idUsoGenerado}</strong> en la agenda de la sala.
              </span>
            </div>
          )}

          {/* Info si está pendiente */}
          {solicitud.estado === 'Pendiente' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
              <span>⏳</span>
              <span>
                Tu solicitud está en revisión. El administrador se encargará de aprobarla o
                rechazarla. Recibirás la actualización la próxima vez que entres a esta sección.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}