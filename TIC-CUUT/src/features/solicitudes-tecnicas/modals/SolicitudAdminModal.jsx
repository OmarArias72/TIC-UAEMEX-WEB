import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { solicitudTecnicaService } from '../../../api/services/solicitudTecnicaService';

export default function SolicitudAdminModal({ isOpen, onClose, solicitud, idAdmin, onRefresh }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [codigoCreado, setCodigoCreado] = useState('');
  const [codigoResuelto, setCodigoResuelto] = useState('');

  if (!isOpen || !solicitud) return null;

  // Verificamos si el formulario ya fue llenado para mostrar el botón
  const tieneFormulario = !!solicitud.formulario;

  const handleAction = async (actionFn, successMsg) => {
    setIsSubmitting(true);
    try {
      await actionFn();
      toast.success(successMsg);
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAprobar = () => handleAction(
    () => solicitudTecnicaService.aprobarSolicitud(solicitud.idSolicitud, idAdmin),
    'Solicitud aprobada. El alumno ya puede llenar el formulario.'
  );

  const handleRechazar = (e) => {
    e.preventDefault();
    if (!motivoRechazo.trim()) return toast.error('El motivo de rechazo es obligatorio');
    handleAction(
      () => solicitudTecnicaService.rechazarSolicitud(solicitud.idSolicitud, idAdmin, { motivoRechazo }),
      'Solicitud rechazada.'
    );
  };

  const handleBloquear = () => handleAction(
    () => solicitudTecnicaService.bloquearSolicitud(solicitud.idSolicitud, idAdmin),
    'Has tomado la solicitud. Genera el ticket en la plataforma de TICS.'
  );

  const handleCapturarTicket = (e) => {
    e.preventDefault();
    if (!codigoCreado.trim()) return toast.error('El ID es obligatorio');
    handleAction(
      () => solicitudTecnicaService.capturarTicket(solicitud.idSolicitud, idAdmin, { codigoTicketCreado: codigoCreado }),
      'Ticket registrado. En espera de resolución por TICS.'
    );
  };

  const handleResolver = (e) => {
    e.preventDefault();
    if (!codigoResuelto.trim()) return toast.error('El ID de resolución es obligatorio');
    handleAction(
      () => solicitudTecnicaService.resolverTicket(solicitud.idSolicitud, idAdmin, { codigoTicketResuelto: codigoResuelto }),
      'Ticket marcado como RESUELTO.'
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md mb-1">
              Gestión de Solicitud
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              {solicitud.tipoNombre.replace(/_/g, ' ')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Solicitado por: <strong>{solicitud.nombreUsuario}</strong> ({solicitud.correoUsuario})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: Datos Originales y Formulario */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Motivo Original</p>
              <p className="text-sm text-slate-800">{solicitud.motivo}</p>
            </div>

            {solicitud.formulario ? (
              <div className="border border-[#486AE6]/20 rounded-xl p-4 bg-[#486AE6]/5">
                <p className="text-[10px] font-bold text-[#486AE6] uppercase mb-3 flex items-center gap-2">
                  <span>📋</span> Datos Capturados por el Alumno
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                  <div><span className="text-slate-500 text-xs block">Nombre:</span> <strong>{solicitud.formulario.nombreCompleto}</strong></div>
                  <div><span className="text-slate-500 text-xs block">No. Cuenta:</span> <strong>{solicitud.formulario.numeroCuenta}</strong></div>
                  <div><span className="text-slate-500 text-xs block">Correo Inst.:</span> {solicitud.formulario.correoInstitucional}</div>
                  <div><span className="text-slate-500 text-xs block">Correo Alt.:</span> {solicitud.formulario.correoAlterno}</div>
                  <div><span className="text-slate-500 text-xs block">CURP:</span> {solicitud.formulario.curp}</div>
                  <div><span className="text-slate-500 text-xs block">Teléfono:</span> {solicitud.formulario.telefono}</div>
                  <div className="col-span-2"><span className="text-slate-500 text-xs block">Descripción extra:</span> {solicitud.formulario.descripcionProblema}</div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-sm">
                El alumno aún no ha llenado el formulario de datos.
              </div>
            )}

            {/* Banner de rechazo (Si aplica) */}
            {solicitud.estado === 'RECHAZADA' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-xs font-bold text-red-700 uppercase">Motivo de Rechazo</p>
                <p className="text-sm text-red-900">{solicitud.motivoRechazo}</p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: Acciones (Botones dinámicos) */}
          <div className="space-y-4 border-l border-slate-100 md:pl-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Acciones Disponibles</h3>

            {/* BOTÓN HACIA LA PLATAFORMA EXTERNA (Aparece si hay formulario) */}
            {tieneFormulario && solicitud.estado !== 'CERRADA' && solicitud.estado !== 'RECHAZADA' && solicitud.estado !== 'CANCELADA' && (
              <a
                href="https://msdtic.uaemex.mx/WorkOrder.do?woMode=viewWO&woID=46873"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#A65D8B] hover:bg-[#8f4d77] text-white font-bold py-2.5 rounded-xl shadow-md transition-colors text-sm"
              >
                🔗 Ir a ServiceDesk TICS
              </a>
            )}

            {/* PENDIENTE: Aprobar o Rechazar */}
            {solicitud.estado === 'PENDIENTE' && (
              <div className="space-y-3">
                <button onClick={handleAprobar} disabled={isSubmitting} className="w-full bg-[#7AD349] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl shadow-md transition-colors">
                  Aprobar Solicitud
                </button>
                <form onSubmit={handleRechazar} className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <textarea required rows="2" value={motivoRechazo} onChange={e => setMotivoRechazo(e.target.value)} placeholder="Motivo de rechazo..." className="w-full text-xs p-2 rounded-lg border border-red-200 outline-none mb-2" />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-xs shadow-sm">
                    Rechazar
                  </button>
                </form>
              </div>
            )}

            {/* APROBADA / FORMULARIO_ENVIADO: Tomar solicitud (Bloqueo) */}
            {(solicitud.estado === 'APROBADA' || solicitud.estado === 'FORMULARIO_ENVIADO') && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Verifica los datos del alumno y toma la solicitud para generar el ticket en TICS.</p>
                <button onClick={handleBloquear} disabled={isSubmitting} className="w-full bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold py-2.5 rounded-xl shadow-md transition-colors">
                  Tomar Solicitud y Bloquear
                </button>
              </div>
            )}

            {/* ESPERA_TICKET: Capturar ID Creado */}
            {solicitud.estado === 'ESPERA_TICKET' && (
              <form onSubmit={handleCapturarTicket} className="space-y-3">
                <p className="text-xs text-slate-500">Solicitud bloqueada. Genera el ticket en la plataforma y captura el ID devuelto.</p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">ID Ticket Creado (Ej. RE-82524)</label>
                  <input required type="text" value={codigoCreado} onChange={e => setCodigoCreado(e.target.value)} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono" placeholder="RE-XXXXX" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl shadow-md">
                  Guardar ID de Ticket
                </button>
              </form>
            )}

            {/* TICKET_CREADO: Capturar ID Resuelto */}
            {solicitud.estado === 'TICKET_CREADO' && (
              <form onSubmit={handleResolver} className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-xs mb-2">
                  Ticket en proceso en TICS con ID: <strong className="font-mono">{solicitud.ticket?.codigoTicketCreado}</strong>
                </div>
                <p className="text-xs text-slate-500">Revisa el correo institucional. Si ya llegó el correo de resolución, captura el ID.</p>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">ID Ticket Resuelto (Ej. 82651)</label>
                  <input required type="text" value={codigoResuelto} onChange={e => setCodigoResuelto(e.target.value)} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm font-mono" placeholder="XXXXX" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#7AD349] hover:bg-green-600 text-white font-bold py-2.5 rounded-xl shadow-md">
                  Marcar como Resuelto
                </button>
              </form>
            )}

            {/* ESTADOS FINALES (Solo lectura) */}
            {['CERRADA', 'CANCELADA', 'RECHAZADA'].includes(solicitud.estado) && (
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                <span className="text-2xl block mb-2">🔒</span>
                <p className="text-xs text-slate-500">Esta solicitud está en estado <strong>{solicitud.estado}</strong> y ya no requiere acciones.</p>
              </div>
            )}
            
            {/* Bloqueo Info (Si alguien más lo tiene) */}
            {solicitud.estado === 'ESPERA_TICKET' && solicitud.ticket?.capturadoPorNombre && (
               <p className="text-[10px] text-amber-600 text-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                 Atendiendo: {solicitud.ticket.capturadoPorNombre}
               </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}