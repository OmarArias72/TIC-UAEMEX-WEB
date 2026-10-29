import api from '../axios';

export const usuarioService = {
  listarUsuarios: async () => {
    const { data } = await api.get('/usuarios');
    return data;
  },
  obtenerPorId: async (id) => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },
  crearDesdeAdmin: async (payload) => {
    try {
      const { data } = await api.post('/usuarios/admin/crear', payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al crear usuario');
    }
  },
  actualizarUsuario: async (id, payload) => {
    try {
      const { data } = await api.put(`/usuarios/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al actualizar usuario');
    }
  },
  eliminarUsuario: async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data || 'Error al eliminar usuario');
    }
  },
  cambiarEstado: async (id, activo) => {
    const { data } = await api.patch(`/usuarios/${id}/estado`, null, { params: { activo } });
    return data;
  },
};