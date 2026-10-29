import React from 'react';

const ESTADOS = {
  PENDIENTE: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'Pendiente de Revisión' },
  APROBADA: { color: 'bg-blue-100 text-[#486AE6] border-[#486AE6]/20', dot: 'bg-[#486AE6]', label: 'Aprobada - Llena tus datos' },
  FORMULARIO_ENVIADO: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', label: 'Datos Enviados' },
  ESPERA_TICKET: { color: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'En Proceso en TICS' },
  TICKET_CREADO: { color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'Ticket Generado' },
  RESUELTO: { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-[#7AD349]', label: 'Resuelto por TICS' },
  RECHAZADA: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', label: 'Rechazada' },
  CANCELADA: { color: 'bg-slate-200 text-slate-600 border-slate-300', dot: 'bg-slate-400', label: 'Cancelada' },
  CERRADA: { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-[#7AD349]', label: 'Resuelto / Cerrado' },
};

export default function SolicitudTecnicaCard({ solicitud, onView }) {
  const estilo = ESTADOS[solicitud.estado] || ESTADOS.PENDIENTE;

  return (
    <div 
      onClick={() => onView(solicitud)}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[#486AE6]/40 cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#A65D8B] bg-[#A65D8B]/10 px-2 py-0.5 rounded-md">
            {solicitud.tipoNombre.replace(/_/g, ' ')}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
          </span>
        </div>
        <p className="font-bold text-slate-800 line-clamp-2">
          {solicitud.motivo}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${estilo.color}`}>
          <span className={`w-2 h-2 rounded-full ${estilo.dot}`} />
          {estilo.label}
        </span>
        <span className="text-[#486AE6] font-bold text-lg">›</span>
      </div>
    </div>
  );
}