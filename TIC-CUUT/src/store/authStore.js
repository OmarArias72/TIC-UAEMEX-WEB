import { create } from 'zustand';

// Constantes de Roles centralizadas
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  PERSONAL_TIC: 'personal_tic'
};

// Usuarios simulados iniciales
const mockUsers = [
  { id: 1, name: 'Administrador Principal', email: 'admin@uaemex.mx', password: 'admin', role: ROLES.ADMIN },
  { id: 2, name: 'Operador Laboratorio', email: 'operador@uaemex.mx', password: '123', role: ROLES.USER },
  { id: 3, name: 'Técnico de Soporte TIC', email: 'tic@uaemex.mx', password: '123', role: ROLES.PERSONAL_TIC }
];

export const useAuthStore = create((set, get) => ({
  user: null, // null = no autenticado
  isAuthenticated: false,
  usersList: mockUsers,

  login: (email, password) => {
    const foundUser = get().usersList.find(u => u.email === email && u.password === password);
    if (foundUser) {
      set({ user: foundUser, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null, isAuthenticated: false }),

  createUser: (newUser) => {
    set((state) => ({
      usersList: [...state.usersList, { ...newUser, id: Date.now() }]
    }));
  },

  deleteUser: (userId) => {
    set((state) => ({
      usersList: state.usersList.filter(u => u.id !== userId)
    }));
  }
}));

// Exportación por defecto añadida para evitar errores de importación en NavBar
export default useAuthStore;