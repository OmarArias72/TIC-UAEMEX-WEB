import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

import { salaService } from '../../../api/services/salaService';
import { equipoComputoService } from '../../../api/services/equipoComputoService';

import ClassroomGrid from '../components/ClassroomGrid';
import ComputerGrid from '../components/ComputerGrid';
import ComputerDetails from '../components/ComputerDetails';
import StatusLegend from '../components/StatusLegend';

import ComputerFormModal from '../modals/ComputerFormModal';
import RoomFormModal from '../modals/RoomFormModal';
import RoomDetailsHubModal from '../modals/RoomDetailsHubModal'; // <-- Modal unificado

/**
 * Normaliza un EquipoComputo del backend a un objeto plano para la UI.
 */
const normalizeEquipoComputo = (ec) => {
  const equipoBase = ec.equipo || {};
  const modelo = equipoBase.modelo || {};
  const marca = modelo.marca || {};
  const articulo = equipoBase.articulo || {};

  const status =
    ec.estadoComputadora ||
    ec.estadoCpu ||
    equipoBase.estado ||
    'Funcionando';

  return {
    id_equipo_computo: ec.idEquipoComputo,
    idEquipoComputo: ec.idEquipoComputo,

    inventario: equipoBase.inventario ?? '',
    name: equipoBase.inventario ?? 'PC',
    serie: equipoBase.serie ?? '',
    cantidad: equipoBase.cantidad ?? 1,
    caracteristicas: equipoBase.caracteristicas ?? '',
    fechaRegistro: equipoBase.fechaRegistro,
    estadoBase: equipoBase.estado,

    nombreArticulo: articulo.nombreArticulo ?? '',
    nombreMarca: marca.nombreMarca ?? '',
    nombreModelo: modelo.nombreModelo ?? '',

    especificaciones_hardware: ec.especificacionesHardware ?? '',
    sistema_operativo: ec.sistemaOperativo ?? '',
    software_instalado: ec.softwareInstalado ?? '',
    estado_teclado: ec.estadoTeclado ?? '',
    estado_mouse: ec.estadoMouse ?? '',
    estado_monitor: ec.estadoMonitor ?? '',
    estado_cable_ethernet: ec.estadoCableEthernet ?? '',
    procesador: ec.procesador ?? '',
    ram: ec.ram ?? '',
    almacenamiento: ec.almacenamiento ?? '',

    contrasena: ec.contrasena ?? '',
    password_admin: ec.passwordAdmin ?? '',
    last_password: ec.lastPassword ?? '',

    observaciones: ec.observaciones ?? '',
    estadoCpu: ec.estadoCpu ?? '',
    estadoComputadora: ec.estadoComputadora ?? '',

    idSala: ec.sala?.idSala ?? null,
    sala: ec.sala ?? null,

    status,
    _raw: ec,
  };
};

/**
 * Prioridad de un equipo según su estado operativo.
 */
const PRIORITY_BY_STATUS = {
  'No funciona': 100,
  'Requiere Mantenimiento': 80,
  'Requiere revisión': 60,
  'Con fallas': 40,
  'En revisión': 40,
  'Requiere mantenimiento': 40,
  'Funcionando': 10,
  'Funciona': 10,
};

const getComputerPriority = (c) =>
  PRIORITY_BY_STATUS[c.status] ??
  PRIORITY_BY_STATUS[c.estadoComputadora] ??
  PRIORITY_BY_STATUS[c.estadoCpu] ??
  0;

export default function ClassroomMapPage() {
  const queryClient = useQueryClient();

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedComputer, setSelectedComputer] = useState(null);

  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingCompData, setEditingCompData] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomData, setEditingRoomData] = useState(null);

  // Estado para el modal unificado (Detalles + Resumen)
  const [viewingRoom, setViewingRoom] = useState(null);

  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [roomSortType, setRoomSortType] = useState('nombre');
  const [compFilterStatus, setCompFilterStatus] = useState('Todos');

  // ============================================================
  // QUERIES
  // ============================================================

  const { data: classrooms = [], isLoading: isLoadingRooms } = useQuery({
    queryKey: ['salas'],
    queryFn: salaService.listarTodas,
  });

  const { data: allComputers = [], isLoading: isLoadingComputers } = useQuery({
    queryKey: ['equipos-todos'],
    queryFn: async () => {
      const raw = await equipoComputoService.listarTodos();
      return raw.map(normalizeEquipoComputo);
    },
  });

  // ============================================================
  // RESUMEN POR SALA (conteos para la tarjeta principal)
  // ============================================================
  const roomSummary = useMemo(() => {
    const map = {};
    for (const c of allComputers) {
      const id = c.idSala;
      if (id == null) continue;
      if (!map[id]) {
        map[id] = {
          total: 0,
          funcionando: 0,
          revision: 0,
          mantenimiento: 0,
          noFunciona: 0,
          problemas: 0,
        };
      }
      map[id].total += 1;

      const s = c.status;
      if (s === 'Funcionando') map[id].funcionando += 1;
      else if (s === 'Requiere revisión') { map[id].revision += 1; map[id].problemas += 1; }
      else if (s === 'Requiere Mantenimiento') { map[id].mantenimiento += 1; map[id].problemas += 1; }
      else if (s === 'No funciona') { map[id].noFunciona += 1; map[id].problemas += 1; }
      else if (s) { map[id].problemas += 1; }
    }
    return map;
  }, [allComputers]);

  // ============================================================
  // EQUIPOS DE LA SALA SELECCIONADA (Cuando ya se entró a la sala)
  // ============================================================
  const roomComputers = useMemo(() => {
    if (!selectedClassroom) return [];
    return allComputers.filter((c) => c.idSala === selectedClassroom.idSala);
  }, [allComputers, selectedClassroom]);

  // ============================================================
  // EQUIPOS PARA EL MODAL (Cuando solo se le da "Ver" a la tarjeta)
  // ============================================================
  const summaryComputers = useMemo(() => {
    if (!viewingRoom) return [];
    return allComputers.filter((c) => c.idSala === viewingRoom.idSala);
  }, [allComputers, viewingRoom]);

  // ============================================================
  // MUTACIONES
  // ============================================================

  const saveRoomMutation = useMutation({
    mutationFn: (roomData) =>
      editingRoomData
        ? salaService.actualizar(editingRoomData.idSala, roomData)
        : salaService.crear(roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salas'] });
      toast.success(editingRoomData ? 'Sala actualizada' : 'Sala registrada');
      setIsRoomModalOpen(false);
      setEditingRoomData(null);
    },
    onError: (err) => toast.error(err.message || 'Error al guardar la sala'),
  });

  const saveComputerMutation = useMutation({
    mutationFn: (compData) => {
      const payload = {
        inventario: (compData.inventario || '').trim(),
        nombreArticulo: (compData.nombreArticulo || '').trim(),
        nombreMarca: (compData.nombreMarca || '').trim(),
        nombreModelo: (compData.nombreModelo || '').trim(),
        serie: compData.serie || null,
        cantidad: 1,
        caracteristicas: compData.caracteristicas || null,
        estado: compData.estado || 'ALTA',
        idSala: selectedClassroom?.idSala ?? null,
        especificacionesHardware: compData.especificacionesHardware || null,
        sistemaOperativo: compData.sistemaOperativo || null,
        softwareInstalado: compData.softwareInstalado || null,
        estadoTeclado: compData.estadoTeclado || null,
        estadoMouse: compData.estadoMouse || null,
        estadoCableEthernet: compData.estadoCableEthernet || null,
        estadoMonitor: compData.estadoMonitor || null,
        procesador: compData.procesador || null,
        ram: compData.ram || null,
        almacenamiento: compData.almacenamiento || null,
        contrasena: compData.contrasena || null,
        passwordAdmin: compData.passwordAdmin || null,
        lastPassword: compData.lastPassword || null,
        estadoCpu: compData.estadoCpu || null,
        estadoComputadora: compData.estadoComputadora || 'Funcionando',
        observaciones: compData.observaciones || null,
        ultimoUsuarioActualizacion: compData.ultimoUsuarioActualizacion ?? null,
      };

      if (compData.idEquipoComputo) {
        return equipoComputoService.actualizar(compData.idEquipoComputo, payload);
      }
      return equipoComputoService.crear(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-todos'] });
      toast.success(editingCompData ? 'Equipo actualizado' : 'Equipo registrado');
      setIsCompModalOpen(false);
      setEditingCompData(null);
    },
    onError: (err) => toast.error(err.message || 'Error al guardar el equipo'),
  });

  const deleteComputerMutation = useMutation({
    mutationFn: (idEquipo) => equipoComputoService.eliminar(idEquipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-todos'] });
      setSelectedComputer(null);
      toast.success('Equipo eliminado');
    },
    onError: (err) => toast.error(err.message || 'Error al eliminar el equipo'),
  });

  // ============================================================
  // DERIVADOS Y FILTROS
  // ============================================================

  const processedClassrooms = useMemo(() => {
    return classrooms
      .filter((c) =>
        (c.nombre || c.codigoSala || '')
          .toLowerCase()
          .includes(roomSearchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (roomSortType === 'nombre') {
          return (a.nombre || '').localeCompare(b.nombre || '');
        }
        if (roomSortType === 'problemas') {
          const sA = roomSummary[a.idSala]?.problemas || 0;
          const sB = roomSummary[b.idSala]?.problemas || 0;
          if (sB !== sA) return sB - sA;
          return (a.nombre || '').localeCompare(b.nombre || '');
        }
        return 0;
      });
  }, [classrooms, roomSearchQuery, roomSortType, roomSummary]);

  const processedComputers = useMemo(() => {
    const filtered = roomComputers.filter((c) => {
      if (compFilterStatus === 'Todos') return true;
      if (compFilterStatus === 'Problemas') return c.status !== 'Funcionando';
      return c.status === compFilterStatus;
    });
    return [...filtered].sort((a, b) => {
      const diff = getComputerPriority(b) - getComputerPriority(a);
      if (diff !== 0) return diff;
      return (a.inventario || '').localeCompare(b.inventario || '');
    });
  }, [roomComputers, compFilterStatus]);

  const handleOpenComputerModal = (computer = null) => {
    if (computer) {
      setEditingCompData({
        idEquipoComputo: computer.idEquipoComputo,
        inventario: computer.inventario,
        nombreArticulo: computer.nombreArticulo,
        nombreMarca: computer.nombreMarca,
        nombreModelo: computer.nombreModelo,
        serie: computer.serie,
        cantidad: 1,
        caracteristicas: computer.caracteristicas,
        estado: computer.estadoBase || 'ALTA',
        especificacionesHardware: computer.especificaciones_hardware,
        sistemaOperativo: computer.sistema_operativo,
        softwareInstalado: computer.software_instalado,
        estadoTeclado: computer.estado_teclado,
        estadoMouse: computer.estado_mouse,
        estadoMonitor: computer.estado_monitor,
        estadoCableEthernet: computer.estado_cable_ethernet,
        procesador: computer.procesador,
        ram: computer.ram,
        almacenamiento: computer.almacenamiento,
        contrasena: computer.contrasena,
        passwordAdmin: computer.password_admin,
        lastPassword: computer.last_password,
        estadoCpu: computer.estadoCpu,
        estadoComputadora: computer.estadoComputadora || computer.status,
        observaciones: computer.observaciones,
      });
    } else {
      setEditingCompData(null);
    }
    setIsCompModalOpen(true);
  };

  if (isLoadingRooms) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-[#486AE6] font-bold text-xl animate-pulse">
        Cargando infraestructura...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">
              Gestión de Infraestructura
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              {selectedClassroom
                ? `Laboratorio: ${selectedClassroom.nombre || selectedClassroom.codigoSala || 'Sin nombre'}`
                : 'Seleccionar Aula'}
            </h1>
          </div>

          <button
            onClick={() => {
              if (selectedClassroom) {
                handleOpenComputerModal(null);
              } else {
                setEditingRoomData(null);
                setIsRoomModalOpen(true);
              }
            }}
            className="bg-[#486AE6] hover:bg-[#3b59c7] text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-[#486AE6]/20 transition-all"
          >
            + Registrar {selectedClassroom ? 'Equipo' : 'Sala'}
          </button>
        </header>

        {!selectedClassroom ? (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="🔍 Buscar sala por nombre..."
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="w-full sm:w-1/3 border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all"
              />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm text-slate-500 font-semibold whitespace-nowrap">
                  Ordenar por:
                </span>
                <select
                  value={roomSortType}
                  onChange={(e) => setRoomSortType(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:border-[#486AE6] transition-all"
                >
                  <option value="nombre">Alfabeto (Nombre)</option>
                  <option value="problemas">Mayores Problemas (Prioridad)</option>
                </select>
              </div>
            </div>

            <ClassroomGrid
              classrooms={processedClassrooms}
              roomSummary={roomSummary}
              onSelect={(id) => {
                const aula = classrooms.find((c) => c.idSala === id);
                setSelectedClassroom(aula);
              }}
              onEdit={(aula) => {
                setEditingRoomData(aula);
                setIsRoomModalOpen(true);
              }}
              onView={(aula) => {
                setViewingRoom(aula); // <-- Abre el modal unificado
              }}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedClassroom.idSala}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <button
                  onClick={() => {
                    setSelectedClassroom(null);
                    setSelectedComputer(null);
                  }}
                  className="flex items-center gap-2 text-slate-500 hover:text-[#486AE6] font-semibold transition-colors"
                >
                  &larr; Volver al listado de aulas
                </button>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Filtro:
                  </span>
                  <select
                    value={compFilterStatus}
                    onChange={(e) => setCompFilterStatus(e.target.value)}
                    className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 font-semibold cursor-pointer outline-none"
                  >
                    <option value="Todos">Todos los equipos</option>
                    <option value="Funcionando">✅ Funcionando</option>
                    <option value="Problemas">⚠️ Con Problemas (Revisión/Daños)</option>
                    <option value="Requiere revisión">🟠 Solo Requiere revisión</option>
                    <option value="Requiere Mantenimiento">🔵 Solo Mantenimiento</option>
                    <option value="No funciona">🔴 Solo No funciona</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  {isLoadingComputers ? (
                    <div className="bg-white py-12 rounded-2xl text-center text-[#486AE6] font-bold animate-pulse border-2 border-dashed border-slate-200">
                      Cargando equipos...
                    </div>
                  ) : processedComputers.length > 0 ? (
                    <ComputerGrid
                      computers={processedComputers}
                      onSelectComputer={setSelectedComputer}
                    />
                  ) : (
                    <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                      No se encontraron equipos bajo este filtro o no hay equipos registrados.
                    </div>
                  )}
                </div>

                <div className="lg:col-span-1 flex flex-col gap-4">
                  <StatusLegend />

                  <ComputerDetails
                    computer={selectedComputer}
                    onEdit={(comp) => handleOpenComputerModal(comp)}
                    onDelete={(id) => {
                      if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
                        deleteComputerMutation.mutate(id);
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <ComputerFormModal
          isOpen={isCompModalOpen}
          onClose={() => setIsCompModalOpen(false)}
          onSave={(data) => saveComputerMutation.mutate(data)}
          initialData={editingCompData}
          salaId={selectedClassroom?.idSala ?? null}
          salaNombre={
            selectedClassroom?.nombre ||
            selectedClassroom?.codigoSala ||
            null
          }
        />

        <RoomFormModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onSave={(data) => saveRoomMutation.mutate(data)}
          initialData={editingRoomData}
        />

        {/* MODAL UNIFICADO: Detalles + Resumen */}
        <RoomDetailsHubModal
          isOpen={!!viewingRoom}
          onClose={() => setViewingRoom(null)}
          sala={viewingRoom}
          computers={summaryComputers}
          onViewComputers={(aula) => {
            setSelectedClassroom(aula);
            setSelectedComputer(null);
          }}
        />

      </div>
    </div>
  );
}