import api from '../axios';

export const equipoComputoService = {
  // GET /api/equipos-computo
  listarTodos: async () => {
    const response = await api.get('/equipos-computo');
    return response.data;
  },

  // GET /api/equipos-computo/{id}
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/equipos-computo/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Equipo de cómputo no encontrado');
      throw error;
    }
  },

  // GET /api/equipos-computo/inventario/{inventario}
  obtenerPorInventario: async (inventario) => {
    try {
      const response = await api.get(`/equipos-computo/inventario/${inventario}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('Número de inventario no encontrado');
      throw error;
    }
  },

  // GET /api/equipos-computo/sala/{idSala}
  listarPorSala: async (idSala) => {
    const response = await api.get(`/equipos-computo/sala/${idSala}`);
    return response.data;
  },

  // POST /api/equipos-computo — Crear equipo (base + detalle técnico)
  crear: async (requestData) => {
    try {
      const response = await api.post('/equipos-computo', requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400)
        throw new Error(error.response.data || 'Datos del equipo inválidos');
      if (error.response?.status === 500)
        throw new Error('Error interno del servidor al crear el equipo');
      throw error;
    }
  },

  // PUT /api/equipos-computo/{id} — Actualizar equipo
  actualizar: async (id, requestData) => {
    try {
      const response = await api.put(`/equipos-computo/${id}`, requestData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400)
        throw new Error(error.response.data || 'Datos inválidos para actualizar');
      if (error.response?.status === 404)
        throw new Error('Equipo de cómputo no encontrado');
      throw error;
    }
  },

  // Alias retrocompatible (usado por código anterior)
  guardarODetalleTecnico: async (requestData) => {
    if (requestData?.idEquipoComputo) {
      return equipoComputoService.actualizar(requestData.idEquipoComputo, requestData);
    }
    return equipoComputoService.crear(requestData);
  },

  // DELETE /api/equipos-computo/{id}
  eliminar: async (id) => {
    try {
      await api.delete(`/equipos-computo/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404)
        throw new Error('No se encontró el equipo para eliminar');
      throw error;
    }
  },
};