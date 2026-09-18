import React from 'react';
import { motion } from 'framer-motion';

export default function ComputerGrid({ computers, onSelectComputer }) {
  const statusConfig = {
    'Funcionando': { color: 'bg-[#7AD349]' },
    'No funciona': { color: 'bg-red-500' },
    'Requiere revision': { color: 'bg-yellow-500' },
    'Requiere Mantenimiento': { color: 'bg-[#486AE6]' }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {computers.map((computer, index) => {
          const conf = statusConfig[computer.status] || { color: 'bg-slate-400' };
          return (
            <motion.div
              key={computer.id_equipo_computo}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectComputer(computer)}
              className="relative bg-slate-50 p-4 rounded-xl border-2 border-transparent hover:border-[#486AE6]/40 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center group"
            >
              <div className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full shadow-sm ${conf.color}`} />
              <svg className="w-9 h-9 text-slate-400 group-hover:text-[#486AE6] mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span className="text-xs font-bold text-slate-700 truncate w-full" title={computer.inventario}>
                {computer.inventario}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 font-semibold uppercase truncate w-full">{computer.status}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}