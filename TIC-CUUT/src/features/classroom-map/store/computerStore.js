import { create } from 'zustand';
import { mockClassrooms } from '../mock/mockData';

export const useComputerStore = create((set, get) => ({
  classrooms: [],
  selectedClassroom: null,
  selectedComputer: null,
  isLoading: false,

  selectClassroom: (id) => {
    if (!id) {
      set({ selectedClassroom: null, selectedComputer: null });
      return;
    }
    const classroom = get().classrooms.find(c => c.id === id);
    set({ selectedClassroom: classroom || null, selectedComputer: null });
  },
  
  selectComputer: (computer) => set({ selectedComputer: computer }),

  fetchClassrooms: async () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ classrooms: mockClassrooms, isLoading: false });
    }, 400); 
  },

  // ---- CRUD EQUIPOS ----
  addComputer: (classroomId, newComputer) => {
    set((state) => {
      const updated = state.classrooms.map(c => 
        c.id === classroomId ? { ...c, computers: [...c.computers, newComputer] } : c
      );
      return { classrooms: updated, selectedClassroom: updated.find(c => c.id === classroomId) };
    });
  },

  updateComputer: (classroomId, updatedComputer) => {
    set((state) => {
      const updated = state.classrooms.map(c => 
        c.id === classroomId ? {
          ...c, 
          computers: c.computers.map(comp => comp.id_equipo_computo === updatedComputer.id_equipo_computo ? updatedComputer : comp)
        } : c
      );
      return { classrooms: updated, selectedClassroom: updated.find(c => c.id === classroomId), selectedComputer: updatedComputer };
    });
  },

  deleteComputer: (classroomId, computerId) => {
    set((state) => {
      const updated = state.classrooms.map(c => 
        c.id === classroomId ? { ...c, computers: c.computers.filter(comp => comp.id_equipo_computo !== computerId) } : c
      );
      return { classrooms: updated, selectedClassroom: updated.find(c => c.id === classroomId), selectedComputer: null };
    });
  },

  // ---- CRUD SALAS ----
  addClassroom: (name) => {
    set((state) => {
      const newClassroom = { id: `aula-${Date.now()}`, name, computers: [] };
      return { classrooms: [...state.classrooms, newClassroom] };
    });
  },

  updateClassroom: (id, newName) => {
    set((state) => {
      const updated = state.classrooms.map(c => c.id === id ? { ...c, name: newName } : c);
      return { 
        classrooms: updated, 
        selectedClassroom: state.selectedClassroom?.id === id ? updated.find(c => c.id === id) : state.selectedClassroom 
      };
    });
  }
}));