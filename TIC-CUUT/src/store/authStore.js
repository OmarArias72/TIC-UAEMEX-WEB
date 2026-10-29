import { create } from 'zustand';
import api from '../api/axios';

// Función segura para extraer y parsear el usuario
const getStoredUser = () => {
  try {
    const item = localStorage.getItem('user');
    // Si no hay item o es el string literal "undefined", retornamos null
    if (!item || item === 'undefined') return null;
    return JSON.parse(item);
  } catch (error) {
    console.error("Error al parsear el usuario del localStorage:", error);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/usuarios/login', { email, password });
      const userData = response.data;

      localStorage.setItem('user', JSON.stringify(userData));

      set({ user: userData, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        message: error.response?.data || 'Error al iniciar sesión' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));