import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { solicitudTecnicaService } from '../../../api/services/solicitudTecnicaService';
import InfoTooltip from '../components/InfoTooltip';

export default function DetalleSolicitudAlumnoModal({ isOpen, onClose, solicitud, idUsuario, onRefresh }) {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '', correoInstitucional: '', correoAlterno: '',
    numeroCuenta: '', curp: '', telefono: '', descripcionProblema: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modoReenvio, setModoReenvio] = useState(false);
  const [nuevoMotivo, setNuevoMotivo] = useState('');

  // Cargar datos existentes si ya los llenó
  useEffect(() => {
    if (isOpen && solicitud) {
      if (solicitud.formulario) {
        setFormData({
          nombreCompleto: solicitud.formulario.nombreCompleto || '',
          correoInstitucional: solicitud.formulario.correoInstitucional || '',
          correoAlterno: solicitud.formulario.correoAlterno || '',
          numeroCuenta: solicitud.formulario.numeroCuenta || '',
          curp: '', // Por seguridad no se devuelve, debe reingresarse si edita
          telefono: solicitud.formulario.telefono || '',
          descripcionProblema: solicitud.formulario.descripcionProblema || '',
        });
      } else if (solicitud.usuario) {
        // Pre-llenar algunos datos base
        setFormData(prev => ({
          ...prev,
          nombreCompleto: `${solicitud.usuario.nombre} ${solicitud.usuario.apellidos || ''}`.trim(),
          correoInstitucional: solicitud.usuario.correo || '',
        }));
      }
    }
  }, [isOpen, solicitud]);

  if (!isOpen || !solicitud) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Guardar el formulario
  const handleGuardarFormulario = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await solicitudTecnicaService.llenarFormulario(solicitud.idSolicitud, idUsuario, formData);
      toast.success('Datos guardados correctamente');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Cancelar la solicitud
  const handleCancelar = async () => {
    if (!window.confirm('¿Estás seguro de cancelar esta solicitud?')) return;
    try {
      await solicitudTecnicaService.cancelarSolicitud(solicitud.idSolicitud, idUsuario);
      toast.success('Solicitud cancelada');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 3. Reenviar solicitud (si fue rechazada)
  const handleReenviar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await solicitudTecnicaService.reenviarSolicitud(solicitud.idSolicitud, idUsuario, { 
        idTipo: solicitud.tipoId || 1, // si no mandamos el ID del tipo, se mantiene el original
        motivo: nuevoMotivo 
      });
      toast.success('Solicitud reabierta');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  // 4. Cerrar Solicitud (Alumno)
const handleCerrarSolicitud = async () => {
  if (!window.confirm('¿Confirmas que tu problema ya fue resuelto?')) return;
  try {
    await solicitudTecnicaService.cerrarSolicitud(solicitud.idSolicitud, idUsuario); // <-- Añadir esto al service
    toast.success('Solicitud cerrada exitosamente');
    onRefresh();
    onClose();
  } catch (error) {
    toast.error(error.message);
  }
};

  // Componente visual para el Timeline (Historial)
  const renderHistorial = () => (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Historial de Seguimiento</h4>
      <div className="space-y-4">
        {solicitud.historial?.map((h, i) => (
          <div key={h.idHistorial} className="flex gap-3 relative">
            {i !== solicitud.historial.length - 1 && (
              <div className="absolute top-6 left-2.5 bottom-[-16px] w-0.5 bg-slate-200" />
            )}
            <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-[#486AE6]" />
            </div>
            <div>
              <p className="text-sm text-slate-800 font-semibold">{h.estadoNuevo}</p>
              <p className="text-xs text-slate-500">{h.comentario}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(h.fechaCambio).toLocaleString()} · Por: {h.usuarioAccionNombre}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md mb-2">
              {solicitud.tipoNombre.replace(/_/g, ' ')}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Solicitud #{solicitud.idSolicitud}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Motivo Original */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Motivo Original</p>
            <p className="text-sm text-slate-800">{solicitud.motivo}</p>
          </div>

          {/* BANNER DE ESTADO (Rechazada, Cancelada, etc) */}
          {solicitud.estado === 'RECHAZADA' && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
              <p className="text-xs font-extrabold text-red-700 uppercase mb-1">Solicitud Rechazada</p>
              <p className="text-sm text-red-900 font-medium">{solicitud.motivoRechazo}</p>
              
              {!modoReenvio ? (
                <button 
                  onClick={() => { setModoReenvio(true); setNuevoMotivo(solicitud.motivo); }}
                  className="mt-3 text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg"
                >
                  Reenviar con más información
                </button>
              ) : (
                <form onSubmit={handleReenviar} className="mt-4 space-y-2">
                  <textarea 
                    required rows="3" 
                    value={nuevoMotivo} onChange={e => setNuevoMotivo(e.target.value)}
                    className="w-full text-sm p-2 rounded-lg border border-red-300 outline-none"
                    placeholder="Explica mejor tu situación..."
                  />
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setModoReenvio(false)} className="text-xs font-bold text-slate-500 px-3 py-1.5">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg">Enviar</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* FORMULARIO DE DATOS (Solo si está Aprobada o Formulario Enviado) */}
          {(solicitud.estado === 'APROBADA' || solicitud.estado === 'FORMULARIO_ENVIADO') && (
            <form onSubmit={handleGuardarFormulario} className="space-y-4 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-extrabold text-[#486AE6] uppercase">Llena tus datos para TICS</h3>
                {solicitud.estado === 'FORMULARIO_ENVIADO' && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Datos Guardados</span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nombre Completo *</label>
                  <input required type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Número de Cuenta *</label>
                  <input required type="text" maxLength="7" name="numeroCuenta" value={formData.numeroCuenta} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" placeholder="7 dígitos" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Correo Institucional *</label>
                  <input required type="email" name="correoInstitucional" value={formData.correoInstitucional} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" placeholder="usuario@uaemex.mx" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Correo Alterno *</label>
                  <input required type="email" name="correoAlterno" value={formData.correoAlterno} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center">
                    CURP *
                    <InfoTooltip text="Ingresa tu CURP exactamente como aparece en tu documento oficial." position="top" />
                  </label>
                  <input required type="text" maxLength="18" name="curp" value={formData.curp} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm uppercase" placeholder="18 caracteres" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Teléfono *</label>
                  <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" placeholder="10 dígitos" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Descripción Adicional del Problema *</label>
                  <textarea required rows="2" name="descripcionProblema" value={formData.descripcionProblema} onChange={handleChange} className="w-full border border-slate-300 rounded-xl p-2.5 text-sm" placeholder="Ej. Cambié de celular y no puedo acceder..." />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] rounded-xl shadow-md">
                  {isSubmitting ? 'Guardando...' : 'Guardar Datos'}
                </button>
              </div>
            </form>
          )}

          {/* BOTÓN DE CANCELAR (Solo si no se ha generado ticket) */}
          {['PENDIENTE', 'APROBADA', 'FORMULARIO_ENVIADO'].includes(solicitud.estado) && (
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <p className="text-[11px] text-slate-400">Ya no necesitas ayuda?</p>
              <button onClick={handleCancelar} className="text-xs font-bold text-red-500 hover:underline">
                Cancelar Solicitud
              </button>
            </div>
          )}

                    {/* BANNER PARA ESTADO CERRADA */}
          {solicitud.estado === 'CERRADA' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              
              <p className="text-sm text-green-800 font-bold mb-1">Solicitud Concluida</p>
              <p className="text-xs text-green-700 mb-3">
                El área de TICS ha resuelto tu ticket. Por favor, revisa tu correo institucional para seguir las instrucciones o verificar el acceso.
              </p>
              {solicitud.ticket?.codigoTicketResuelto && (
                <p className="text-xs font-mono bg-white inline-block px-3 py-1 rounded-md border border-green-200 text-green-800">
                  ID de Resolución: {solicitud.ticket.codigoTicketResuelto}
                </p>
              )}
            </div>
          )}

          {/* HISTORIAL (Timeline) */}
          {solicitud.historial && renderHistorial()}

        </div>
      </div>
    </div>
  );
}