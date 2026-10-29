import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';

import { useAuthStore } from '../../../../store/authStore';
import { usuarioService } from '../../../../api/services/usuarioService';

import AdminUsersHeader from '../components/AdminUsersHeader';
import AdminUsersFilters from '../components/AdminUsersFilters';
import AdminUsersTable from '../components/AdminUsersTable';
import UserFormModal from '../components/UserFormModal';
import ConfirmDeleteUserModal from '../components/ConfirmDeleteUserModal';

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal Crear/Editar
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Modal Eliminar
  const [userToDelete, setUserToDelete] = useState(null);

  // Guard de rol
  if (user?.nombreRol !== 'Admin') {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Acceso denegado. Se requieren permisos de administrador.
      </div>
    );
  }

  // ==== Query ====
  const { data: usersList = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuarioService.listarUsuarios,
  });

  // ==== Filtrado local ====
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      if (roleFilter && u.nombreRol !== roleFilter) return false;
      if (statusFilter === 'activo' && !u.activo) return false;
      if (statusFilter === 'inactivo' && u.activo) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const full = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.toLowerCase();
        if (!full.includes(q) && !(u.correo ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [usersList, roleFilter, statusFilter, searchTerm]);

  const hasFilters =
    searchTerm.trim() !== '' || roleFilter !== '' || statusFilter !== '';

  const clearFilters = () => {
    setSearchTerm(''); setRoleFilter(''); setStatusFilter('');
  };

  // ==== Mutaciones ====
  const saveMutation = useMutation({
    mutationFn: async ({ payload, isEditing }) => {
      if (isEditing) return usuarioService.actualizarUsuario(editingUser.idUsuario, payload);
      return usuarioService.crearDesdeAdmin(payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success(variables.isEditing ? 'Usuario actualizado' : 'Usuario creado');
      setIsFormOpen(false);
      setEditingUser(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => usuarioService.eliminarUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado');
      setUserToDelete(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, activo }) => usuarioService.cambiarEstado(id, activo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Estado actualizado');
    },
    onError: (err) => toast.error(err.message),
  });

  // ==== Handlers ====
  const handleCreate = () => { setEditingUser(null); setIsFormOpen(true); };
  const handleEdit = (u) => { setEditingUser(u); setIsFormOpen(true); };
  const handleToggleStatus = (u) =>
    toggleStatusMutation.mutate({ id: u.idUsuario, activo: !u.activo });
  const handleConfirmDelete = () => deleteMutation.mutate(userToDelete.idUsuario);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-6 md:p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <AdminUsersHeader onCreate={handleCreate} />

        <AdminUsersFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          roleFilter={roleFilter} setRoleFilter={setRoleFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onClear={clearFilters}
          hasFilters={hasFilters}
        />

        <AdminUsersTable
          users={filteredUsers}
          isLoading={isLoading}
          currentUserId={user?.idUsuario}
          onEdit={handleEdit}
          onDelete={(u) => setUserToDelete(u)}
          onToggleStatus={handleToggleStatus}
          isTogglingStatus={toggleStatusMutation.isLoading}
        />

        <UserFormModal
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
          onSubmit={(payload, isEditing) => saveMutation.mutate({ payload, isEditing })}
          initialData={editingUser}
          isSaving={saveMutation.isLoading}
        />

        <ConfirmDeleteUserModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          user={userToDelete}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteMutation.isLoading}
        />
      </div>
    </div>
  );
}