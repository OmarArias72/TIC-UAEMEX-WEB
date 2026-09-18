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

export default function ClassroomMapPage() {
  const { 
    classrooms, selectedClassroom, isLoading, fetchClassrooms, 
    selectClassroom, selectComputer, selectedComputer,
    addComputer, updateComputer, deleteComputer,
    addClassroom, updateClassroom
  } = useComputerStore();

  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [editingCompData, setEditingCompData] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomData, setEditingRoomData] = useState(null);

  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [roomSortType, setRoomSortType] = useState('nombre');

  const [compFilterStatus, setCompFilterStatus] = useState('Todos');

  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

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

  const processedClassrooms = classrooms
    .filter(c => c.name.toLowerCase().includes(roomSearchQuery.toLowerCase()))
    .sort((a, b) => {
      if (roomSortType === 'problemas') {
        const probsA = a.computers.filter(comp => comp.status !== 'Funcionando').length;
        const probsB = b.computers.filter(comp => comp.status !== 'Funcionando').length;
        return probsB - probsA;
      }
      return a.name.localeCompare(b.name);
    });

  const processedComputers = selectedClassroom?.computers.filter(c => {
    if (compFilterStatus === 'Todos') return true;
    if (compFilterStatus === 'Problemas') return c.status !== 'Funcionando';
    return c.status === compFilterStatus;
  });

  if (isLoading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-[#486AE6] font-bold text-xl animate-pulse">Cargando infraestructura...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[#A65D8B] font-semibold uppercase text-xs tracking-wider">Gestión de Infraestructura</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
              {selectedClassroom ? `Laboratorio: ${selectedClassroom.name}` : 'Seleccionar Aula'}
            </h1>
          </div>
          
          <button 
            onClick={() => { 
              if(selectedClassroom) { setEditingCompData(null); setIsCompModalOpen(true); } 
              else { setEditingRoomData(null); setIsRoomModalOpen(true); } 
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
                <span className="text-sm text-slate-500 font-semibold whitespace-nowrap">Ordenar por:</span>
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
              onSelect={selectClassroom} 
              onEdit={(aula) => { setEditingRoomData(aula); setIsRoomModalOpen(true); }}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selectedClassroom.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <button onClick={() => selectClassroom(null)} className="flex items-center gap-2 text-slate-500 hover:text-[#486AE6] font-semibold transition-colors">
                  &larr; Volver al listado de aulas
                </button>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtro:</span>
                  <select 
                    value={compFilterStatus} 
                    onChange={(e) => setCompFilterStatus(e.target.value)}
                    className="text-sm bg-transparent border-none focus:ring-0 text-slate-700 font-semibold cursor-pointer outline-none"
                  >
                    <option value="Todos">Todos los equipos</option>
                    <option value="Funcionando">✅ Funcionando</option>
                    <option value="Problemas">⚠️ Con Problemas (Revisión/Daños)</option>
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
                    <div className="bg-white py-12 rounded-2xl text-center text-slate-500 border-2 border-dashed border-slate-200">
                      No se encontraron equipos bajo este filtro.
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <StatusLegend />
                  
                  {selectedComputer ? (
                    <div className="bg-white p-5 rounded-2xl shadow-lg shadow-[#486AE6]/5 border border-[#486AE6]/20">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-extrabold text-slate-900 truncate">{selectedComputer.inventario}</h3>
                      </div>
                      <div className="space-y-2 text-sm text-slate-600 mb-6">
                        <p><span className="font-semibold text-slate-800">Estado:</span> {selectedComputer.status}</p>
                        <p><span className="font-semibold text-slate-800">OS:</span> {selectedComputer.sistema_operativo}</p>
                        <p><span className="font-semibold text-slate-800">Hardware:</span> {selectedComputer.especificaciones_hardware}</p>
                        <p><span className="font-semibold text-slate-800">Teclado:</span> {selectedComputer.estado_teclado}</p>
                        <p><span className="font-semibold text-slate-800">Monitor:</span> {selectedComputer.estado_monitor}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingCompData(selectedComputer); setIsCompModalOpen(true); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDeleteComputer(selectedComputer.id_equipo_computo)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-xs font-bold transition-colors">
                          Borrar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500 text-sm">
                      Selecciona un equipo de la cuadrícula para ver sus detalles o gestionarlo.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <ComputerFormModal isOpen={isCompModalOpen} onClose={() => setIsCompModalOpen(false)} onSave={handleSaveComputer} initialData={editingCompData} />
        <RoomFormModal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} onSave={handleSaveRoom} initialData={editingRoomData} />
      </div>
    </div>
  );
}