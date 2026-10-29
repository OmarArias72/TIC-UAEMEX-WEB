// inventoryService.js
import api from '../axios';

export const inventoryService = {
  listarEquipos: async () => {
    const response = await api.get('/inventory/equipos');
    return response.data;
  },

  crearEquipoMovil: async (equipoData) => {
    try {
      const response = await api.post('/inventory/crear-equipo-movil', equipoData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) throw new Error(error.response.data || 'Parámetros inválidos');
      if (error.response?.status === 500) throw new Error('Error en el servidor al intentar crear el equipo');
      throw error;
    }
  },

  buscarPorSerie: async (query) => { const res = await api.post('/inventory/buscar-por-serie', { query }); return res.data; },
  buscarPorMarca: async (query) => { const res = await api.post('/inventory/buscar-por-marca', { query }); return res.data; },
  buscarPorModelo: async (query) => { const res = await api.post('/inventory/buscar-por-modelo', { query }); return res.data; },
  buscarPorArticulo: async (query) => { const res = await api.post('/inventory/buscar-por-articulo', { query }); return res.data; },
  buscarGlobal: async (query) => { const res = await api.post('/inventory/buscar-global', { query }); return res.data; },

  actualizarEstadoMasivo: async (inventarios, nuevoEstado) => {
    try {
      const response = await api.patch('/inventory/estado-masivo', { inventarios, nuevoEstado });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al actualizar el estado masivo');
    }
  },

  // Método para crear un equipo de forma completa (web)
  crearEquipoCompleto: async (equipoData) => {
    try {
      const response = await api.post('/inventory/crear', equipoData);
      return response.data;
    } catch (error) {
       throw new Error(error.response?.data || 'Error al crear el equipo completo');
    }
  },

  // Método para actualizar (editar) un equipo específico
  actualizarEquipo: async (inventario, equipoData) => {
    try {
      const response = await api.put(`/inventory/${inventario}`, equipoData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) throw new Error('El equipo a actualizar no existe');
      throw new Error(error.response?.data || 'Error al actualizar el equipo');
    }
  },

  // Método para eliminar un equipo
  eliminarEquipo: async (inventario) => {
    try {
      await api.delete(`/inventory/${inventario}`);
      return true; // 204 No Content
    } catch (error) {
      if (error.response?.status === 404) throw new Error('El equipo a eliminar no existe');
      throw new Error(error.response?.data || 'Error al eliminar el equipo');
    }
  },

  descargarReportePdf: async (fechaInicio, fechaFin, articulo) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    if (articulo) params.append('articulo', articulo);

    const response = await api.get(`/reportes/equipos/pdf?${params.toString()}`, { responseType: 'blob' });
    return response.data;
  },

  descargarReporteCsv: async (fechaInicio, fechaFin, articulo) => {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);
    if (articulo) params.append('articulo', articulo);

    const response = await api.get(`/reportes/equipos/csv?${params.toString()}`, { responseType: 'blob' });
    return response.data;
  },

    // ==================== CONTEOS ====================
  contarPorArticulo: async () => {
    const { data } = await api.get('/inventory/conteo', { params: { agruparPor: 'articulo' } });
    return data;
  },

  contarPorModelo: async () => {
    const { data } = await api.get('/inventory/conteo', { params: { agruparPor: 'modelo' } });
    return data;
  }
};