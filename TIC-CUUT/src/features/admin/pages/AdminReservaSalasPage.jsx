import React, { useState } from 'react';

const mockSalas = [
  { id_sala: 1, codigo: 'CC-01', nombre: 'Centro de Cómputo 1', ubicacion: 'Edificio A', capacidad: 30 },
  { id_sala: 2, codigo: 'CC-02', nombre: 'Laboratorio Redes', ubicacion: 'Edificio B', capacidad: 25 },
  { id_sala: 3, codigo: 'CC-03', nombre: 'Aulas Smart', ubicacion: 'Edificio A', capacidad: 40 },
];

const mockHorariosMap = {
  1: [
    { inicio: '07:00', fin: '08:00', ocupado: false },
    { inicio: '08:00', fin: '10:00', ocupado: true, evento: 'Clase Programación' },
    { inicio: '10:00', fin: '11:00', ocupado: false },
    { inicio: '11:00', fin: '13:00', ocupado: true, evento: 'Taller BD' },
    { inicio: '13:00', fin: '15:00', ocupado: false },
  ],
  2: [
    { inicio: '07:00', fin: '08:00', ocupado: false },
    { inicio: '08:00', fin: '10:00', ocupado: true, evento: 'Redes I' },
    { inicio: '10:00', fin: '15:00', ocupado: false },
  ],
  3: [
    { inicio: '07:00', fin: '15:00', ocupado: false },
  ]
};

export default function AdminReservaSalasPage() {
  const [pestanaActiva, setPestanaActiva] = useState('agenda');
  const [salaActiva, setSalaActiva] = useState(mockSalas[0]);
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);

  const [reservas, setReservas] = useState([
    { id_uso: 101, id_sala: 1, profesor: 'Dr. Roberto Gómez', hora_inicio: '08:00', hora_fin: '10:00', proposito: 'Clase de Programación', estado: 'Confirmado' },
    { id_uso: 102, id_sala: 1, profesor: 'Ing. María Torres', hora_inicio: '11:00', hora_fin: '13:00', proposito: 'Taller de BD', estado: 'Confirmado' },
  ]);

  const [solicitudesEntrantes, setSolicitudesEntrantes] = useState([
    { id_solicitud: 201, id_sala: 1, profesor: 'Mtro. Alejandro Ruiz', fecha: '2026-09-10', hora_inicio: '10:00', hora_fin: '11:00', proposito: 'Examen Excepcional', justificacion: 'Empalme de laboratorio requerido' },
    { id_solicitud: 202, id_sala: 2, profesor: 'Dra. Patricia Lima', fecha: '2026-09-10', hora_inicio: '13:00', hora_fin: '15:00', proposito: 'Conferencia Virtual', justificacion: 'Requiere banda ancha de redes' }
  ]);

  const [reservaEnGestion, setReservaEnGestion] = useState(null);
  const [solicitudParaRechazar, setSolicitudParaRechazar] = useState(null);
  const [reservaParaCancelar, setReservaParaCancelar] = useState(null);

  const [formAsignacion, setFormAsignacion] = useState({
    id_sala: '', hora_inicio: '', hora_fin: ''
  });
  const [motivoTexto, setMotivoTexto] = useState('');

  const iniciarReasignacion = (reserva) => {
    setReservaEnGestion({ ...reserva, esSolicitudNueva: false });
    setFormAsignacion({ id_sala: reserva.id_sala, hora_inicio: reserva.hora_inicio, hora_fin: reserva.hora_fin });
  };

  const iniciarAceptacionSolicitud = (solicitud) => {
    setReservaEnGestion({
      id_uso: Date.now(), id_solicitud: solicitud.id_solicitud,
      profesor: solicitud.profesor, proposito: solicitud.proposito,
      esSolicitudNueva: true
    });
    setFormAsignacion({ id_sala: solicitud.id_sala, hora_inicio: solicitud.hora_inicio, hora_fin: solicitud.hora_fin });
  };

  const handleGuardarAsignacion = (e) => {
    e.preventDefault();
    if (reservaEnGestion.esSolicitudNueva) {
      const nuevaReserva = {
        id_uso: reservaEnGestion.id_uso, id_sala: Number(formAsignacion.id_sala),
        profesor: reservaEnGestion.profesor, hora_inicio: formAsignacion.hora_inicio,
        hora_fin: formAsignacion.hora_fin, proposito: reservaEnGestion.proposito, estado: 'Confirmado'
      };
      setReservas([...reservas, nuevaReserva]);
      setSolicitudesEntrantes(solicitudesEntrantes.filter(s => s.id_solicitud !== reservaEnGestion.id_solicitud));
    } else {
      setReservas(reservas.map(r => r.id_uso === reservaEnGestion.id_uso ? {
        ...r, id_sala: Number(formAsignacion.id_sala),
        hora_inicio: formAsignacion.hora_inicio, hora_fin: formAsignacion.hora_fin
      } : r));
    }
    setReservaEnGestion(null);
  };

  const handleConfirmarRechazo = (e) => {
    e.preventDefault();
    setSolicitudesEntrantes(solicitudesEntrantes.filter(s => s.id_solicitud !== solicitudParaRechazar.id_solicitud));
    setSolicitudParaRechazar(null);
    setMotivoTexto('');
  };

  const handleConfirmarCancelacion = (e) => {
    e.preventDefault();
    setReservas(reservas.filter(r => r.id_uso !== reservaParaCancelar.id_uso));
    setReservaParaCancelar(null);
    setMotivoTexto('');
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-[calc(100vh-4rem)] space-y-6">
      
      {/* Header y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">Gestión Administrativa</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Espacios y Agenda</h1>
          <p className="text-sm text-slate-500 mt-1">Administra reasignaciones, disponibilidad y solicitudes</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setPestanaActiva('agenda')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                pestanaActiva === 'agenda' ? 'bg-[#486AE6] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda de Salas
            </button>
            <button
              onClick={() => setPestanaActiva('solicitudes')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                pestanaActiva === 'solicitudes' ? 'bg-[#486AE6] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solicitudes Entrantes
              {solicitudesEntrantes.length > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${pestanaActiva === 'solicitudes' ? 'bg-white text-[#486AE6]' : 'bg-[#486AE6] text-white'}`}>
                  {solicitudesEntrantes.length}
                </span>
              )}
            </button>
          </div>

          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-[#486AE6] focus:ring-1 focus:ring-[#486AE6]"
          />
        </div>
      </div>

      {/* VISTA 1: AGENDA DE SALAS */}
      {pestanaActiva === 'agenda' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockSalas.map(sala => {
              const esSeleccionada = sala.id_sala === salaActiva.id_sala;
              return (
                <div
                  key={sala.id_sala}
                  onClick={() => setSalaActiva(sala)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                    esSeleccionada 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                      : 'bg-white text-slate-800 border-slate-200 hover:border-[#486AE6]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${esSeleccionada ? 'bg-[#486AE6] text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {sala.codigo}
                    </span>
                    <span className="text-xs opacity-80">{sala.ubicacion}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{sala.nombre}</h3>
                  <p className={`text-xs ${esSeleccionada ? 'text-slate-400' : 'text-slate-500'}`}>
                    Capacidad: {sala.capacidad} equipos
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Horarios Registrados: <span className="text-[#486AE6]">{salaActiva.nombre}</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-900 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-4 px-5 font-semibold rounded-tl-lg">Horario</th>
                    <th className="py-4 px-5 font-semibold">Profesor / Responsable</th>
                    <th className="py-4 px-5 font-semibold">Propósito</th>
                    <th className="py-4 px-5 font-semibold">Estado</th>
                    <th className="py-4 px-5 font-semibold text-center rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservas
                    .filter(r => r.id_sala === salaActiva.id_sala)
                    .map(reserva => (
                      <tr key={reserva.id_uso} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-semibold text-slate-900">
                          {reserva.hora_inicio} - {reserva.hora_fin}
                        </td>
                        <td className="py-4 px-5 font-medium">{reserva.profesor}</td>
                        <td className="py-4 px-5">{reserva.proposito}</td>
                        <td className="py-4 px-5">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7AD349]/20 text-slate-800">
                            {reserva.estado}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center space-x-2">
                          <button
                            onClick={() => iniciarReasignacion(reserva)}
                            className="px-3 py-1.5 bg-[#486AE6]/10 text-[#486AE6] hover:bg-[#486AE6]/20 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Reasignar
                          </button>
                          <button
                            onClick={() => setReservaParaCancelar(reserva)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: SOLICITUDES ENTRANTES */}
      {pestanaActiva === 'solicitudes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Bandeja de Solicitudes Extraordinarias</h2>

          {solicitudesEntrantes.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-sm text-slate-500">No hay solicitudes pendientes en este momento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-900 text-white uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-4 px-5 font-semibold rounded-tl-lg">Profesor</th>
                    <th className="py-4 px-5 font-semibold">Sala Solicitada</th>
                    <th className="py-4 px-5 font-semibold">Horario Deseado</th>
                    <th className="py-4 px-5 font-semibold">Justificación</th>
                    <th className="py-4 px-5 font-semibold text-center rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {solicitudesEntrantes.map(solicitud => {
                    const salaObj = mockSalas.find(s => s.id_sala === solicitud.id_sala);
                    return (
                      <tr key={solicitud.id_solicitud} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900">{solicitud.profesor}</td>
                        <td className="py-4 px-5 font-medium text-[#486AE6]">{salaObj?.nombre || 'Desconocida'}</td>
                        <td className="py-4 px-5 font-semibold">{solicitud.hora_inicio} - {solicitud.hora_fin}</td>
                        <td className="py-4 px-5 text-xs text-slate-500 max-w-xs">{solicitud.justificacion}</td>
                        <td className="py-4 px-5 text-center space-x-2">
                          <button
                            onClick={() => iniciarAceptacionSolicitud(solicitud)}
                            className="px-3 py-1.5 bg-[#7AD349] text-slate-900 hover:bg-[#68b83e] font-bold text-xs rounded-lg transition-colors"
                          >
                            Aceptar y Asignar
                          </button>
                          <button
                            onClick={() => setSolicitudParaRechazar(solicitud)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Rechazar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: REASIGNACIÓN / ACEPTACIÓN DE SOLICITUD */}
      {reservaEnGestion && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-900">
                {reservaEnGestion.esSolicitudNueva ? 'Aprobar y Asignar Horario' : 'Reasignar Reserva'}
              </h3>
              <button onClick={() => setReservaEnGestion(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
              Profesor: <strong className="text-slate-900">{reservaEnGestion.profesor}</strong> <br/> 
              Actividad: <strong className="text-slate-900">{reservaEnGestion.proposito}</strong>
            </div>

            <form onSubmit={handleGuardarAsignacion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Seleccionar Sala Destino</label>
                <select
                  value={formAsignacion.id_sala}
                  onChange={(e) => setFormAsignacion({ ...formAsignacion, id_sala: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6]"
                >
                  {mockSalas.map(s => (
                    <option key={s.id_sala} value={s.id_sala}>{s.codigo} - {s.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Mapa de Disponibilidad de la Sala
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                  {(mockHorariosMap[formAsignacion.id_sala] || []).map((b, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                        b.ocupado ? 'bg-red-50 border-red-200 text-red-700' : 'bg-[#7AD349]/10 border-[#7AD349]/30 text-slate-800'
                      }`}
                    >
                      <span className="font-mono font-bold">{b.inicio} - {b.fin}</span>
                      <span className="font-semibold">{b.ocupado ? `Ocupado (${b.evento})` : 'Disponible'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={formAsignacion.hora_inicio}
                    onChange={(e) => setFormAsignacion({ ...formAsignacion, hora_inicio: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={formAsignacion.hora_fin}
                    onChange={(e) => setFormAsignacion({ ...formAsignacion, hora_fin: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReservaEnGestion(null)}
                  className="px-5 py-2.5 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#486AE6] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#3b59c7] transition-all"
                >
                  Confirmar y Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECHAZAR SOLICITUD */}
      {solicitudParaRechazar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-red-600">Rechazar Solicitud Extraordinaria</h3>
            <p className="text-sm text-slate-600">
              Indica el motivo del rechazo para la solicitud de <strong>{solicitudParaRechazar.profesor}</strong>.
            </p>

            <form onSubmit={handleConfirmarRechazo} className="space-y-4">
              <textarea
                required
                rows="3"
                placeholder="Ej. La sala solicitada requiere mantenimiento a esa hora..."
                value={motivoTexto}
                onChange={(e) => setMotivoTexto(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSolicitudParaRechazar(null)}
                  className="px-5 py-2.5 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-red-700 transition-all"
                >
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CANCELAR RESERVA EXISTENTE */}
      {reservaParaCancelar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-red-600">Cancelar Reserva Confirmada</h3>
            <p className="text-sm text-slate-600">
              Explica el motivo para notificar al docente <strong>{reservaParaCancelar.profesor}</strong>.
            </p>

            <form onSubmit={handleConfirmarCancelacion} className="space-y-4">
              <textarea
                required
                rows="3"
                placeholder="Ej. Imprevisto institucional o falla técnica de red..."
                value={motivoTexto}
                onChange={(e) => setMotivoTexto(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReservaParaCancelar(null)}
                  className="px-5 py-2.5 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Regresar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-red-700 transition-all"
                >
                  Cancelar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}