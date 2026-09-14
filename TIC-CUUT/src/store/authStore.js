import { create } from 'zustand';

// Usuarios simulados iniciales
const mockUsers = [
  { id: 1, name: 'Administrador Principal', email: 'admin@uaemex.mx', password: 'admin', role: 'admin' },
  { id: 2, name: 'Operador Laboratorio', email: 'operador@uaemex.mx', password: '123', role: 'user' }
];

export const useAuthStore = create((set, get) => ({
  user: null, // null = no autenticado
  usersList: mockUsers,

  login: (email, password) => {
    const foundUser = get().usersList.find(u => u.email === email && u.password === password);
    if (foundUser) {
      set({ user: foundUser });
      return true;
    }
    return false;
  },

  logout: () => set({ user: null }),

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