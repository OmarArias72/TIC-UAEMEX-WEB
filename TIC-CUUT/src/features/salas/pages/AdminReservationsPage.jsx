import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { reservaSalasService } from '../../../api/services/reservaSalasService';
import { salaService } from '../../../api/services/salaService';

import ApproveRequestModal from '../modals/ApproveRequestModal';
import RejectRequestModal from '../modals/RejectRequestModal';
import ReassignReservationModal from '../modals/ReassignReservationModal';
import CancelReservationModal from '../modals/CancelReservationModal';

const todayStr = () => new Date().toISOString().split('T')[0];

export default function AdminReservationsPage({ idAdmin }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('solicitudes'); // 'solicitudes' | 'agenda'

  // Modales
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reassigning, setReassigning] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  // Agenda
  const [selectedSalaId, setSelectedSalaId] = useState(null);
  const [fecha, setFecha] = useState(todayStr());

  // ============ Queries ============
  const { data: solicitudes = [], isLoading: loadingSolicitudes } = useQuery({
    queryKey: ['solicitudes-pendientes'],
    queryFn: reservaSalasService.listarSolicitudesPendientes,
    enabled: tab === 'solicitudes',
  });

  const { data: salas = [] } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.listarTodas,
  });

  const { data: agenda = [], isLoading: loadingAgenda } = useQuery({
    queryKey: ['agenda', selectedSalaId, fecha],
    queryFn: () => reservaSalasService.obtenerAgenda(selectedSalaId, fecha),
    enabled: tab === 'agenda' && !!selectedSalaId && !!fecha,
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        <header className="mb-6">
          <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
            Panel Administrativo
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Gestión de Reservas
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[
            { key: 'solicitudes', label: 'Solicitudes pendientes' },
            { key: 'agenda', label: 'Agenda por sala' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-bold transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? 'text-[#486AE6] border-[#486AE6]'
                  : 'text-slate-500 border-transparent hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ====== SOLICITUDES ====== */}
          {tab === 'solicitudes' && (
            <motion.div
              key="solicitudes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {loadingSolicitudes ? (
                <div className="bg-white py-12 rounded-2xl text-center text-[#486AE6] font-bold animate-pulse">
                  Cargando solicitudes...
                </div>
              ) : solicitudes.length === 0 ? (
                <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                  No hay solicitudes pendientes.
                </div>
              ) : (
                solicitudes.map((s) => (
                  <div
                    key={s.idSolicitud}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-[#A65D8B] bg-[#A65D8B]/10 px-2 py-0.5 rounded-md">
                          {s.codigoSala}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {s.fecha} · {s.horaInicio}–{s.horaFin}
                        </span>
                      </div>
                      <p className="font-extrabold text-slate-800">{s.profesor}</p>
                      <p className="text-sm text-slate-600 italic">"{s.justificacion}"</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setApproving(s)}
                        className="px-4 py-2 text-xs font-bold bg-[#7AD349] hover:bg-green-600 text-white rounded-xl shadow-md"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => setRejecting(s)}
                        className="px-4 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* ====== AGENDA ====== */}
          {tab === 'agenda' && (
            <motion.div
              key="agenda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedSalaId ?? ''}
                  onChange={(e) => setSelectedSalaId(Number(e.target.value) || null)}
                  className="w-full sm:w-1/3 border border-slate-300 rounded-xl p-2.5 text-sm bg-white"
                >
                  <option value="">— Selecciona una sala —</option>
                  {salas.map((s) => (
                    <option key={s.idSala} value={s.idSala}>
                      {s.codigoSala} — {s.nombre}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full sm:w-1/4 border border-slate-300 rounded-xl p-2.5 text-sm"
                />
              </div>

              {!selectedSalaId ? (
                <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                  Selecciona una sala para ver su agenda.
                </div>
              ) : loadingAgenda ? (
                <div className="bg-white py-12 rounded-2xl text-center text-[#486AE6] font-bold animate-pulse">
                  Cargando agenda...
                </div>
              ) : agenda.length === 0 ? (
                <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                  No hay reservas para esta fecha.
                </div>
              ) : (
                agenda.map((u) => (
                  <div
                    key={u.idUso}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-slate-800">
                          {u.horaInicio} – {u.horaFin}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            u.estado === 'Confirmada'
                              ? 'bg-green-100 text-green-700'
                              : u.estado === 'Cancelada'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.estado}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{u.profesor}</p>
                      {u.proposito && (
                        <p className="text-xs text-slate-500 italic">"{u.proposito}"</p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setReassigning(u)}
                        className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                      >
                        Reasignar
                      </button>
                      <button
                        onClick={() => setCancelling(u)}
                        className="px-4 py-2 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 rounded-xl"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modales */}
        <ApproveRequestModal
          isOpen={!!approving}
          onClose={() => setApproving(null)}
          solicitud={approving}
          idAdmin={idAdmin}
        />
        <RejectRequestModal
          isOpen={!!rejecting}
          onClose={() => setRejecting(null)}
          solicitud={rejecting}
          idAdmin={idAdmin}
        />
        <ReassignReservationModal
          isOpen={!!reassigning}
          onClose={() => setReassigning(null)}
          reserva={reassigning}
          idAdmin={idAdmin}
        />
        <CancelReservationModal
          isOpen={!!cancelling}
          onClose={() => setCancelling(null)}
          reserva={cancelling}
          idAdmin={idAdmin}
        />
      </div>
    </div>
  );
}