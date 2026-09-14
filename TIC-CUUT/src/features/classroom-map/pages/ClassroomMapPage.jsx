import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

// Store
import { useComputerStore } from '../store/computerStore';

// Componentes
import ClassroomGrid from '../components/ClassroomGrid';
import ComputerGrid from '../components/ComputerGrid';
import StatusLegend from '../components/StatusLegend';

// Modales
import ComputerFormModal from '../modals/ComputerFormModal';
import RoomFormModal from '../modals/RoomFormModal';

export default function ClassroomMap() {
  const { 
    classrooms, selectedClassroom, isLoading, fetchClassrooms, 
    selectClassroom, selectComputer, selectedComputer,
    addComputer, updateComputer, deleteComputer,
    addClassroom, updateClassroom
  } = useComputerStore();

  // Estados para Modal de Computadoras
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingCompData, setEditingCompData] = useState(null);

  // Estados para Modal de Salas
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomData, setEditingRoomData] = useState(null);

  // Filtros de Salas
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [roomSortType, setRoomSortType] = useState('nombre'); // 'nombre' | 'problemas'

  // Filtros de Computadoras
  const [compFilterStatus, setCompFilterStatus] = useState('Todos'); // 'Todos' | 'Funcionando' | 'Problemas' | 'No funciona' | etc.

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  // ---- Manejadores de Guardado ----
  const handleSaveComputer = (formData) => {
    if (editingCompData) {
      updateComputer(selectedClassroom.id, { ...formData, fecha_actualizacion: new Date().toISOString() });
      toast.success('Equipo actualizado exitosamente');
    } else {
      addComputer(selectedClassroom.id, { 
        ...formData, 
        id_equipo_computo: `eq-${Date.now()}`,
        fecha_registro: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      });
      toast.success('Equipo registrado exitosamente');
    }
    setIsCompModalOpen(false);
    setEditingCompData(null);
  };

  const handleSaveRoom = (name) => {
    if (editingRoomData) {
      updateClassroom(editingRoomData.id, name);
      toast.success('Sala actualizada');
    } else {
      addClassroom(name);
      toast.success('Sala registrada');
    }
    setIsRoomModalOpen(false);
    setEditingRoomData(null);
  };

  const handleDeleteComputer = (computerId) => {
    if(window.confirm('¿Estás seguro de eliminar este equipo permanentemente?')) {
      deleteComputer(selectedClassroom.id, computerId);
      toast.success('Equipo eliminado');
    }
  };

  // ---- Lógica de Filtros y Ordenamiento ----
  const processedClassrooms = classrooms
    .filter(c => c.name.toLowerCase().includes(roomSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (roomSortType === 'problemas') {
        const probsA = a.computers.filter(comp => comp.status !== 'Funcionando').length;
        const probsB = b.computers.filter(comp => comp.status !== 'Funcionando').length;
        return probsB - probsA; // Descendente: Los que tienen más problemas primero
      }
      return a.name.localeCompare(b.name);
    });

  const processedComputers = selectedClassroom?.computers.filter(c => {
    if (compFilterStatus === 'Todos') return true;
    if (compFilterStatus === 'Problemas') return c.status !== 'Funcionando';
    return c.status === compFilterStatus;
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-uaem-verde font-bold text-xl animate-pulse">Cargando infraestructura...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera Principal */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-uaem-dorado font-semibold uppercase text-sm">Gestión de Infraestructura</h2>
            <h1 className="text-3xl font-bold text-uaem-verde">
              {selectedClassroom ? `Laboratorio: ${selectedClassroom.name}` : 'Seleccionar Aula'}
            </h1>
          </div>
          
          {selectedClassroom ? (
            <button 
              onClick={() => { setEditingCompData(null); setIsCompModalOpen(true); }}
              className="bg-uaem-dorado hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow transition-colors"
            >
              + Registrar Equipo
            </button>
          ) : (
            <button 
              onClick={() => { setEditingRoomData(null); setIsRoomModalOpen(true); }}
              className="bg-uaem-dorado hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow transition-colors"
            >
              + Registrar Sala
            </button>
          )}
        </header>

        {/* VISTAS */}
        {!selectedClassroom ? (
          /* ----- VISTA 1: LISTADO DE SALAS ----- */
          <div className="space-y-6">
            {/* Barra de Filtros de Salas */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input 
                type="text" 
                placeholder="🔍 Buscar sala por nombre..." 
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="w-full sm:w-1/3 border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-uaem-verde"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Ordenar por:</span>
                <select 
                  value={roomSortType} 
                  onChange={(e) => setRoomSortType(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-uaem-verde"
                >
                  <option value="nombre">Alfabeto (Nombre)</option>
                  <option value="problemas">Mayores Problemas (Prioridad)</option>
                </select>
              </div>
            </div>

            <ClassroomGrid 
              classrooms={processedClassrooms} 
              onSelect={selectClassroom} 
              onEdit={(aula) => { setEditingRoomData(aula); setIsRoomModalOpen(true); }}
            />
          </div>
        ) : (
          /* ----- VISTA 2: LISTADO DE COMPUTADORAS DE LA SALA ----- */
          <AnimatePresence mode="wait">
            <motion.div key={selectedClassroom.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <button onClick={() => selectClassroom(null)} className="flex items-center gap-2 text-uaem-antracita hover:text-uaem-verde font-medium">
                  &larr; Volver al listado de aulas
                </button>

                {/* Filtro de Computadoras por estado */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                  <span className="text-xs font-bold text-gray-500 uppercase">Filtro:</span>
                  <select 
                    value={compFilterStatus} 
                    onChange={(e) => setCompFilterStatus(e.target.value)}
                    className="text-sm bg-transparent border-none focus:ring-0 text-uaem-antracita font-medium cursor-pointer"
                  >
                    <option value="Todos">Todos los equipos</option>
                    <option value="Funcionando">✅ Funcionando</option>
                    <option value="Problemas">⚠️ Con Problemas (Revision/Daños)</option>
                    <option value="Requiere revision">🟠 Solo Requiere revisión</option>
                    <option value="Requiere Mantenimiento">🔵 Solo Mantenimiento</option>
                    <option value="No funciona">🔴 Solo No funciona</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  {processedComputers.length > 0 ? (
                    <ComputerGrid computers={processedComputers} onSelectComputer={selectComputer} />
                  ) : (
                    <div className="bg-white p-10 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
                      No se encontraron equipos bajo este filtro.
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <StatusLegend />
                  
                  {/* Panel Lateral del Equipo Seleccionado */}
                  {selectedComputer ? (
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-uaem-dorado">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-uaem-verde truncate">{selectedComputer.inventario}</h3>
                      </div>
                      <div className="space-y-2 text-xs text-gray-700 mb-6">
                        <p><span className="font-bold">Estado:</span> {selectedComputer.status}</p>
                        <p><span className="font-bold">OS:</span> {selectedComputer.sistema_operativo}</p>
                        <p><span className="font-bold">Hardware:</span> {selectedComputer.especificaciones_hardware}</p>
                        <p><span className="font-bold">Teclado:</span> {selectedComputer.estado_teclado}</p>
                        <p><span className="font-bold">Monitor:</span> {selectedComputer.estado_monitor}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCompData(selectedComputer); setIsCompModalOpen(true); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-medium transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteComputer(selectedComputer.id_equipo_computo)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-xs font-medium transition-colors">
                          Borrar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
                      Selecciona un equipo de la cuadrícula para ver sus detalles o gestionarlo.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Modales */}
        <ComputerFormModal 
          isOpen={isCompModalOpen} 
          onClose={() => setIsCompModalOpen(false)} 
          onSave={handleSaveComputer} 
          initialData={editingCompData} 
        />
        
        <RoomFormModal
          isOpen={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          onSave={handleSaveRoom}
          initialData={editingRoomData}
        />
      </div>
    </div>
  );
}