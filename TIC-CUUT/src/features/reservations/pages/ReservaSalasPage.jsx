import React, { useState } from 'react';
import SolicitudExtra from '../modals/SolicitudExtraModal';

// Datos de prueba con el campo de profesor agregado
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
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col md:flex-row gap-6">
      {/* Modal de Solicitud Extra */}
      {mostrarSolicitudModal && (
        <SolicitudExtra 
          onClose={() => setMostrarSolicitudModal(false)} 
          salasDisponibles={mockSalas}
          salaInicialId={salaSeleccionada.id_sala}
        />
      )}

      {/* Sidebar - Listado de Salas */}
      <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-fit">
        <h3 className="font-bold text-[#536855] mb-4 border-b pb-2">Salas Disponibles</h3>
        <div className="space-y-2">
          {mockSalas.map(sala => (
            <button
              key={sala.id_sala}
              onClick={() => setSalaSeleccionada(sala)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                salaSeleccionada.id_sala === sala.id_sala 
                ? 'bg-[#536855] text-white' 
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="block font-semibold text-sm">{sala.codigo_sala}</span>
              <span className="block text-xs opacity-80">{sala.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Disponibilidad: {salaSeleccionada.nombre}
            </h2>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-[#C89F5C] focus:border-[#C89F5C] outline-none"
            />
          </div>

          {/* Tabla de horarios ocupados con Profesor */}
          <div className="overflow-hidden border border-slate-200 rounded-lg mb-8">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-[#536855] text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Horario Ocupado</th>
                  <th className="px-6 py-3 text-left font-medium">Profesor / Responsable</th>
                  <th className="px-6 py-3 text-left font-medium">Propósito</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {mockReservas.map(reserva => (
                  <tr key={reserva.id_uso}>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {reserva.fecha_inicio} - {reserva.fecha_fin}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{reserva.profesor}</td>
                    <td className="px-6 py-4 text-slate-600">{reserva.proposito}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Reservado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario de Uso_Salas */}
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-[#536855] mb-4">Registrar Nuevo Uso de Sala</h3>
            <form onSubmit={handleReserva} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Profesor / Docente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Dr. Carlos Hernández"
                  value={formularioReserva.profesor}
                  onChange={e => setFormularioReserva({...formularioReserva, profesor: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={formularioReserva.hora_inicio}
                  onChange={e => setFormularioReserva({...formularioReserva, hora_inicio: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Hora Fin</label>
                <input
                  type="time"
                  required
                  value={formularioReserva.hora_fin}
                  onChange={e => setFormularioReserva({...formularioReserva, hora_fin: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-slate-700 mb-1">Propósito / Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Práctica de base de datos"
                  value={formularioReserva.proposito}
                  onChange={e => setFormularioReserva({...formularioReserva, proposito: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
              </div>

              <div className="md:col-span-4 flex justify-between items-center mt-2">
                <button
                  type="button"
                  onClick={() => setMostrarSolicitudModal(true)}
                  className="text-sm text-[#C89F5C] font-medium hover:underline"
                >
                  ¿El horario que buscas está ocupado? Solicitar excepción al Admin
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C89F5C] hover:bg-[#b08b4e] text-white font-medium rounded-md transition-colors"
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