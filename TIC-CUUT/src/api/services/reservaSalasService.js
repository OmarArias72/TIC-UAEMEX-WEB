import api from '../axios';

export const reservaSalasService = {
  // ============ Agenda pública ============
  obtenerAgenda: async (idSala, fecha) => {
    const params = { idSala };
    if (fecha) params.fecha = fecha;
    const { data } = await api.get('/reservas-salas/agenda', { params });
    return data;
  },

  // ============ Profesor / Usuario ============
  registrarReservaDirecta: async (payload) => {
    try {
      const { data } = await api.post('/reservas-salas/reservar', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al registrar la reserva');
    }
  },

  registrarSolicitudExtra: async (payload) => {
    try {
      const { data } = await api.post('/reservas-salas/solicitud-extra', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al registrar la solicitud');
    }
  },

  // ============ Admin ============
  listarSolicitudesPendientes: async () => {
    const { data } = await api.get('/reservas-salas/admin/solicitudes-pendientes');
    return data;
  },

  aprobarSolicitud: async (payload) => {
    try {
      const { data } = await api.post('/reservas-salas/admin/aprobar-solicitud', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al aprobar la solicitud');
    }
  },

  rechazarSolicitud: async (payload) => {
    try {
      const { data } = await api.post('/reservas-salas/admin/rechazar-solicitud', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al rechazar la solicitud');
    }
  },

  reasignarReserva: async (payload) => {
    try {
      const { data } = await api.put('/reservas-salas/admin/reasignar', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al reasignar la reserva');
    }
  },

  cancelarReserva: async (payload) => {
    try {
      const { data } = await api.put('/reservas-salas/admin/cancelar', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al cancelar la reserva');
    }
  },
   // ============ Profesor: mis solicitudes ============
  misSolicitudes: async (idUsuario) => {
    const { data } = await api.get('/reservas-salas/mis-solicitudes', {
      params: { idUsuario },
    });
    return data;
  },
};