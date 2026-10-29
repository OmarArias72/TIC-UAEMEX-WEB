import api from '../axios';

export const salaService = {
  // GET /api/salas
  listarTodas: async () => {
    const response = await api.get('/salas');
    return response.data;
  },

  // GET /api/salas/{id}
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/salas/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Sala no encontrada');
      throw error;
    }
  },

  // GET /api/salas/buscar?query={query}
  buscar: async (query) => {
    const response = await api.get('/salas/buscar', { params: { query } });
    return response.data;
  },

  // POST /api/salas
  crear: async (salaData) => {
    try {
      const response = await api.post('/salas', salaData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) throw new Error(error.response.data || 'Parámetros inválidos para crear la sala');
      throw error;
    }
  },

  // PUT /api/salas/{id}
  actualizar: async (id, salaData) => {
    try {
      const response = await api.put(`/salas/${id}`, salaData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Sala no encontrada para actualizar');
      if (error.response?.status === 400) throw new Error(error.response.data || 'Parámetros inválidos');
      throw error;
    }
  },

  // DELETE /api/salas/{id}
  eliminar: async (id) => {
    try {
      await api.delete(`/salas/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Sala no encontrada para eliminar');
      throw error;
    }
  }
};