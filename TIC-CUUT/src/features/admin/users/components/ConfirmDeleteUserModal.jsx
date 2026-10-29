import React from 'react';

export default function ConfirmDeleteUserModal({ isOpen, onClose, user, onConfirm, isDeleting }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <span className="text-2xl">🗑️</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Eliminar usuario</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ¿Estás seguro de eliminar permanentemente a{' '}
            <strong className="text-slate-900">
              {user.nombre} {user.apellidos}
            </strong>{' '}
            ({user.correo})? Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
          <button
            type="button" onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-semibold text-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button" onClick={onConfirm} disabled={isDeleting}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}