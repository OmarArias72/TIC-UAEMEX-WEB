import React, { useMemo, useState } from 'react';

export default function RoomSummaryModal({ isOpen, onClose, sala, computers }) {
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // PROCESAMIENTO DE DATOS CON USEMEMO
  // ==========================================
  const resumen = useMemo(() => {
    if (!computers || computers.length === 0) return null;

    const total = computers.length;
    
    // 1. Sistemas Operativos (Windows 10, Windows 11, Ubuntu, etc.)
    const osCount = {};
    // 2. Software (Buscando palabras clave comunes)
    const softwareKeywords = ['Office', 'Chrome', 'Firefox', 'AutoCAD', 'Visual Studio', 'IntelliJ', 'VLC', 'Adobe', 'Java', 'Python', 'Git'];
    const softwareCount = {};
    
    // 3. Periféricos Dañados
    const damagedPeripherals = {
      teclado: 0, mouse: 0, monitor: 0, ethernet: 0, cpu: 0
    };

    computers.forEach(pc => {
      // --- Sistema Operativo ---
      let os = pc.sistema_operativo || 'No especificado';
      // Limpiamos un poco el texto (ej. "Windows 10 Pro" -> "Windows 10")
      if (os.toLowerCase().includes('windows 10')) os = 'Windows 10';
      else if (os.toLowerCase().includes('windows 11')) os = 'Windows 11';
      else if (os.toLowerCase().includes('ubuntu')) os = 'Ubuntu';
      else if (os.toLowerCase().includes('mac')) os = 'macOS';
      
      osCount[os] = (osCount[os] || 0) + 1;

      // --- Software (Buscando en el texto) ---
      const swText = (pc.software_instalado || '').toLowerCase();
      softwareKeywords.forEach(keyword => {
        if (swText.includes(keyword.toLowerCase())) {
          softwareCount[keyword] = (softwareCount[keyword] || 0) + 1;
        }
      });

      // --- Periféricos (Si el texto NO incluye "bueno" o "funciona", lo contamos como dañado)
      const checkDamage = (value) => {
        if (!value) return false;
        const v = value.toLowerCase();
        return v.includes('dañado') || v.includes('falla') || v.includes('sin respuesta') || v.includes('muerto') || v.includes('roto') || v.includes('cortado');
      };

      if (checkDamage(pc.estado_teclado)) damagedPeripherals.teclado++;
      if (checkDamage(pc.estado_mouse)) damagedPeripherals.mouse++;
      if (checkDamage(pc.estado_monitor)) damagedPeripherals.monitor++;
      if (checkDamage(pc.estado_cable_ethernet)) damagedPeripherals.ethernet++;
      if (pc.estadoCpu === 'No funciona' || pc.estadoCpu === 'Con fallas') damagedPeripherals.cpu++;
    });

    return {
      total,
      osCount,
      softwareCount,
      damagedPeripherals
    };
  }, [computers]);

  // Filtrar el software si hay búsqueda
  const filteredSoftware = useMemo(() => {
    if (!resumen) return [];
    const entries = Object.entries(resumen.softwareCount);
    if (!searchTerm) return entries;
    return entries.filter(([key]) => key.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [resumen, searchTerm]);

  if (!isOpen || !sala) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2 py-0.5 rounded-md mb-1">
              Resumen de Infraestructura
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              {sala.nombre || 'Sala sin nombre'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Total de equipos: <strong>{resumen?.total || 0}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 font-bold text-xl">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {!resumen ? (
            <p className="text-center text-slate-500 py-8">No hay equipos registrados en esta sala.</p>
          ) : (
            <>
              {/* SECCIÓN 1: Sistemas Operativos */}
              <section>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Sistemas Operativos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(resumen.osCount).map(([os, count]) => (
                    <div key={os} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                      <span className="block text-2xl font-extrabold text-[#486AE6]">{count}</span>
                      <span className="text-xs font-semibold text-slate-600">{os}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECCIÓN 2: Software Instalado */}
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Software Detectado</h3>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Buscar software (ej. Office)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs outline-none focus:border-[#486AE6]"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                  </div>
                </div>
                
                {filteredSoftware.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No se encontró el software buscado o no está registrado.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filteredSoftware.sort((a, b) => b[1] - a[1]).map(([sw, count]) => (
                      <div key={sw} className="flex items-center gap-2 bg-[#A65D8B]/10 border border-[#A65D8B]/20 text-[#A65D8B] px-3 py-1.5 rounded-xl text-xs font-bold">
                        <span>{sw}</span>
                        <span className="bg-white/50 px-1.5 rounded-md text-[10px]">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* SECCIÓN 3: Estado de Periféricos */}
              <section>
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Periféricos con Fallas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <span className="block text-xl mb-1">⌨️</span>
                    <span className="block text-xl font-extrabold text-red-600">{resumen.damagedPeripherals.teclado}</span>
                    <span className="text-[10px] font-bold text-red-800 uppercase">Teclados</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <span className="block text-xl mb-1">🖱️</span>
                    <span className="block text-xl font-extrabold text-red-600">{resumen.damagedPeripherals.mouse}</span>
                    <span className="text-[10px] font-bold text-red-800 uppercase">Mouse</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <span className="block text-xl mb-1">🖥️</span>
                    <span className="block text-xl font-extrabold text-red-600">{resumen.damagedPeripherals.monitor}</span>
                    <span className="text-[10px] font-bold text-red-800 uppercase">Monitores</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                    <span className="block text-xl mb-1">🔌</span>
                    <span className="block text-xl font-extrabold text-red-600">{resumen.damagedPeripherals.ethernet}</span>
                    <span className="text-[10px] font-bold text-red-800 uppercase">Cables Red</span>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center col-span-2 md:col-span-4 flex items-center justify-center gap-4">
                    <div className="text-left">
                      <span className="block text-xl font-extrabold text-orange-600">{resumen.damagedPeripherals.cpu}</span>
                      <span className="text-[10px] font-bold text-orange-800 uppercase">CPUs con fallas o inoperables</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}