import React from 'react';
import { motion } from 'framer-motion';

/**
 * Paleta de estilos por estado.
 * Alineada con la simbología del filtro:
 *   ✅ Funcionando       → verde
 *   🟠 Requiere revisión → naranja
 *   🔵 Requiere Mant.    → azul (marca)
 *   🔴 No funciona       → rojo
 *   ⚠️ Con fallas / En revisión → naranja (advertencia)
 */
const STATUS_STYLES = {
  'Funcionando': {
    card: 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-green-100',
    dot: 'bg-[#7AD349]',
    icon: 'text-green-600',
    label: 'text-green-700',
  },
  'Requiere revisión': {
    card: 'bg-orange-50 border-orange-200 hover:border-orange-400 hover:shadow-orange-100',
    dot: 'bg-orange-500',
    icon: 'text-orange-600',
    label: 'text-orange-700',
  },
  'Requiere Mantenimiento': {
    card: 'bg-blue-50 border-blue-200 hover:border-[#486AE6] hover:shadow-blue-100',
    dot: 'bg-[#486AE6]',
    icon: 'text-[#486AE6]',
    label: 'text-[#3b59c7]',
  },
  'No funciona': {
    card: 'bg-red-50 border-red-200 hover:border-red-400 hover:shadow-red-100',
    dot: 'bg-red-500',
    icon: 'text-red-600',
    label: 'text-red-700',
  },
};

/**
 * Resuelve el estilo a partir del status (incluye fallbacks de estado_cpu).
 */
const resolveStatusStyle = (status) => {
  if (!status) return STATUS_STYLES['Funcionando'];
  if (STATUS_STYLES[status]) return STATUS_STYLES[status];

  // Fallbacks para valores provenientes de estado_cpu
  if (['Con fallas', 'En revisión', 'Requiere mantenimiento'].includes(status)) {
    return STATUS_STYLES['Requiere revisión'];
  }
  if (status === 'Funciona') return STATUS_STYLES['Funcionando'];

  // Default
  return STATUS_STYLES['Funcionando'];
};

export default function ComputerGrid({ computers, onSelectComputer }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {computers.map((computer, index) => {
          const style = resolveStatusStyle(computer.status);
          return (
            <motion.div
              key={computer.id_equipo_computo}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectComputer(computer)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${style.card}`}
            >
              {/* Indicador de estado */}
              <div
                className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full shadow-sm ${style.dot}`}
              />

              {/* Icono */}
              <svg
                className={`w-9 h-9 mb-2 transition-colors ${style.icon}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>

              {/* Inventario */}
              <span
                className="text-xs font-bold text-slate-700 truncate w-full"
                title={computer.inventario}
              >
                {computer.inventario}
              </span>

              {/* Status */}
              <span
                className={`text-[10px] mt-1 font-semibold uppercase truncate w-full ${style.label}`}
              >
                {computer.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}