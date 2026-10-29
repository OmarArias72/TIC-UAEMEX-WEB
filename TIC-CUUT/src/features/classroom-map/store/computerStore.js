import { create } from 'zustand';

const API_BASE_URL = '/api';

export const useComputerStore = create((set, get) => ({
  classrooms: [],
  selectedClassroom: null,
  selectedComputer: null,
  isLoading: false,
  error: null,

  // ---- SELECCIÓN DE ESTADO LOCAL ----
  selectClassroom: (id) => {
    if (!id) {
      set({ selectedClassroom: null, selectedComputer: null });
      return;
    }
    const classroom = get().classrooms.find((c) => c.id === id);
    set({ selectedClassroom: classroom || null, selectedComputer: null });
  },

  selectComputer: (computer) => set({ selectedComputer: computer }),

  // ---- LECTURA (GET) ----
  fetchClassrooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/classrooms`);
      if (!response.ok) throw new Error('Error al obtener las aulas');
      
      const data = await response.json();
      set({ classrooms: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // ---- CRUD EQUIPOS ----
  addComputer: async (classroomId, newComputerData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/computers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComputerData),
      });

      if (!response.ok) throw new Error('Error al agregar el equipo');
      const createdComputer = await response.json();

      set((state) => {
        const updatedClassrooms = state.classrooms.map((c) =>
          c.id === classroomId ? { ...c, computers: [...c.computers, createdComputer] } : c
        );
        return {
          classrooms: updatedClassrooms,
          selectedClassroom: updatedClassrooms.find((c) => c.id === classroomId) || null,
          isLoading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateComputer: async (classroomId, updatedComputer) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/computers/${updatedComputer.id_equipo_computo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedComputer),
      });

      if (!response.ok) throw new Error('Error al actualizar el equipo');
      const data = await response.json();

      set((state) => {
        const updatedClassrooms = state.classrooms.map((c) =>
          c.id === classroomId
            ? {
                ...c,
                computers: c.computers.map((comp) =>
                  comp.id_equipo_computo === data.id_equipo_computo ? data : comp
                ),
              }
            : c
        );
        return {
          classrooms: updatedClassrooms,
          selectedClassroom: updatedClassrooms.find((c) => c.id === classroomId) || null,
          selectedComputer: data,
          isLoading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteComputer: async (classroomId, computerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/computers/${computerId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el equipo');

      set((state) => {
        const updatedClassrooms = state.classrooms.map((c) =>
          c.id === classroomId
            ? { ...c, computers: c.computers.filter((comp) => comp.id_equipo_computo !== computerId) }
            : c
        );
        return {
          classrooms: updatedClassrooms,
          selectedClassroom: updatedClassrooms.find((c) => c.id === classroomId) || null,
          selectedComputer: null,
          isLoading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  // ---- CRUD SALAS ----
  addClassroom: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/classrooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Error al crear la sala');
      const newClassroom = await response.json();

      set((state) => ({
        classrooms: [...state.classrooms, newClassroom],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateClassroom: async (id, newName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/classrooms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Error al actualizar la sala');
      const updatedData = await response.json();

      set((state) => {
        const updatedClassrooms = state.classrooms.map((c) => (c.id === id ? { ...c, name: updatedData.name } : c));
        return {
          classrooms: updatedClassrooms,
          selectedClassroom:
            state.selectedClassroom?.id === id ? updatedClassrooms.find((c) => c.id === id) : state.selectedClassroom,
          isLoading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },
}));