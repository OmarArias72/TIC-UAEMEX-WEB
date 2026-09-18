import React, { useState } from 'react';
import SolicitudExtra from '../modals/SolicitudExtraModal';

const mockSalas = [
  { id_sala: 1, codigo_sala: 'CC-01', nombre: 'Centro de Cómputo 1' },
  { id_sala: 2, codigo_sala: 'CC-02', nombre: 'Laboratorio Redes' },
];

const mockReservas = [
  { id_uso: 1, id_sala: 1, profesor: 'Dr. Roberto Gómez', fecha_inicio: '08:00', fecha_fin: '10:00', proposito: 'Clase de Programación' },
  { id_uso: 2, id_sala: 1, profesor: 'Ing. María Torres', fecha_inicio: '11:00', fecha_fin: '13:00', proposito: 'Mantenimiento de Redes' },
];

export default function ReservaSalas() {
  const [salaSeleccionada, setSalaSeleccionada] = useState(mockSalas[0]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [mostrarSolicitudModal, setMostrarSolicitudModal] = useState(false);

  const [formularioReserva, setFormularioReserva] = useState({
    profesor: '',
    hora_inicio: '',
    hora_fin: '',
    proposito: ''
  });

  const handleReserva = (e) => {
    e.preventDefault();
    console.log('Insertar en Uso_Salas:', { ...formularioReserva, id_sala: salaSeleccionada.id_sala, fecha });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8 flex flex-col md:flex-row gap-6">
      {mostrarSolicitudModal && (
        <SolicitudExtra 
          onClose={() => setMostrarSolicitudModal(false)} 
          salasDisponibles={mockSalas}
          salaInicialId={salaSeleccionada.id_sala}
        />
      )}

      {/* Sidebar - Listado de Salas */}
      <div className="w-full md:w-1/4 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 h-fit space-y-4">
        <div>
          <span className="text-[#A65D8B] font-semibold text-xs uppercase tracking-wider">Infraestructura</span>
          <h3 className="font-extrabold text-slate-900 text-lg mt-1">Salas Disponibles</h3>
        </div>
        <div className="space-y-2">
          {mockSalas.map(sala => (
            <button
              key={sala.id_sala}
              onClick={() => setSalaSeleccionada(sala)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                salaSeleccionada.id_sala === sala.id_sala 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="block font-bold text-xs uppercase tracking-wider opacity-90">{sala.codigo_sala}</span>
              <span className="block font-semibold text-sm mt-0.5">{sala.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[#486AE6] font-semibold text-xs uppercase tracking-wider">Disponibilidad de Agenda</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {salaSeleccionada.nombre}
              </h2>
            </div>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
            />
          </div>

          {/* Tabla de horarios ocupados */}
          <div className="overflow-hidden border border-slate-200 rounded-2xl mb-8 shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Horario Ocupado</th>
                  <th className="px-6 py-4 font-semibold">Profesor / Responsable</th>
                  <th className="px-6 py-4 font-semibold">Propósito</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {mockReservas.map(reserva => (
                  <tr key={reserva.id_uso} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {reserva.fecha_inicio} - {reserva.fecha_fin}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{reserva.profesor}</td>
                    <td className="px-6 py-4 text-slate-600">{reserva.proposito}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-semibold">Reservado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario de Uso_Salas */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Registrar Nuevo Uso de Sala</h3>
            <form onSubmit={handleReserva} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Nombre del Profesor / Docente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Dr. Carlos Hernández"
                  value={formularioReserva.profesor}
                  onChange={e => setFormularioReserva({...formularioReserva, profesor: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={formularioReserva.hora_inicio}
                  onChange={e => setFormularioReserva({...formularioReserva, hora_inicio: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hora Fin</label>
                <input
                  type="time"
                  required
                  value={formularioReserva.hora_fin}
                  onChange={e => setFormularioReserva({...formularioReserva, hora_fin: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Propósito / Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Práctica de base de datos"
                  value={formularioReserva.proposito}
                  onChange={e => setFormularioReserva({...formularioReserva, proposito: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#486AE6]/20 focus:border-[#486AE6] outline-none"
                />
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setMostrarSolicitudModal(true)}
                  className="text-sm text-[#486AE6] font-semibold hover:underline"
                >
                  ¿El horario que buscas está ocupado? Solicitar excepción al Admin
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#486AE6] hover:bg-[#3b59c7] text-white font-bold rounded-xl shadow-lg shadow-[#486AE6]/25 transition-all text-sm"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}