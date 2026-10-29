import api from '../axios';

export const solicitudTecnicaService = {
  // ============ Catálogos ============
  obtenerTipos: async () => {
    const { data } = await api.get('/solicitudes-tecnicas/catalogos/tipos');
    return data;
  },

  // ============ Alumno ============
  misSolicitudes: async (idUsuario) => {
    const { data } = await api.get('/solicitudes-tecnicas/mis-solicitudes', { params: { idUsuario } });
    return data;
  },

  crearSolicitud: async (idUsuario, payload) => {
    try {
      const { data } = await api.post('/solicitudes-tecnicas/crear', payload, { params: { idUsuario } });
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al crear la solicitud');
    }
  },

  reenviarSolicitud: async (idSolicitud, idUsuario, payload) => {
    try {
      const { data } = await api.put(`/solicitudes-tecnicas/${idSolicitud}/reenviar`, payload, { params: { idUsuario } });
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al reenviar');
    }
  },

  llenarFormulario: async (idSolicitud, idUsuario, payload) => {
    try {
      const { data } = await api.put(`/solicitudes-tecnicas/${idSolicitud}/formulario`, payload, { params: { idUsuario } });
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al guardar el formulario');
    }
  },

  cancelarSolicitud: async (idSolicitud, idUsuario) => {
    try {
      const { data } = await api.put(`/solicitudes-tecnicas/${idSolicitud}/cancelar`, null, { params: { idUsuario } });
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al cancelar');
    }
  },

  // ============ Admin / Operador ============
  panelAdmin: async (filtro) => {
    const { data } = await api.get('/solicitudes-tecnicas/admin/panel', { params: { filtro } });
    return data;
  },

  aprobarSolicitud: async (idSolicitud, idAdmin) => {
    const { data } = await api.post(`/solicitudes-tecnicas/admin/${idSolicitud}/aprobar`, null, { params: { idAdmin } });
    return data;
  },

  rechazarSolicitud: async (idSolicitud, idAdmin, payload) => {
    const { data } = await api.post(`/solicitudes-tecnicas/admin/${idSolicitud}/rechazar`, payload, { params: { idAdmin } });
    return data;
  },

  bloquearSolicitud: async (idSolicitud, idAdmin) => {
    try {
      const { data } = await api.post(`/solicitudes-tecnicas/admin/${idSolicitud}/bloquear`, null, { params: { idAdmin } });
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'No se pudo tomar la solicitud');
    }
  },

  capturarTicket: async (idSolicitud, idAdmin, payload) => {
    const { data } = await api.post(`/solicitudes-tecnicas/admin/${idSolicitud}/capturar-ticket`, payload, { params: { idAdmin } });
    return data;
  },

  resolverTicket: async (idSolicitud, idAdmin, payload) => {
    const { data } = await api.post(`/solicitudes-tecnicas/admin/${idSolicitud}/resolver-ticket`, payload, { params: { idAdmin } });
    return data;
  },

  
};