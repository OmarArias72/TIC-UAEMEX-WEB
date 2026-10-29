import React, { useState, useEffect } from 'react';

const EMPTY_FORM = {
  idEquipoComputo: null,

  // Equipo base
  inventario: '',
  nombreArticulo: '',
  nombreMarca: '',
  nombreModelo: '',
  serie: '',
  cantidad: 1,
  caracteristicas: '',
  estado: 'ALTA',

  // Detalle técnico
  especificacionesHardware: '',
  sistemaOperativo: '',
  softwareInstalado: '',
  procesador: '',
  ram: '',
  almacenamiento: '',

  // Contraseñas
  contrasena: '',
  passwordAdmin: '',
  lastPassword: '',

  // Periféricos (valores alineados a CHECKs en BD)
  estadoTeclado: 'Bueno',
  estadoMouse: 'Bueno',
  estadoMonitor: 'Bueno',
  estadoCableEthernet: 'Bueno',

  // Estados (estadoCpu reemplaza a estadoEquipo)
  estadoCpu: 'Funciona',
  estadoComputadora: 'Funcionando',

  observaciones: '',
};

// Opciones válidas según los CHECKs de la BD
const OPT_TECLADO = ['Bueno', 'Teclas dañadas', 'Teclas faltantes', 'Sin respuesta', 'Cable dañado', 'Dañado'];
const OPT_MOUSE = ['Bueno', 'Clic dañado', 'Scroll dañado', 'Sin respuesta', 'Cable dañado', 'Dañado'];
const OPT_MONITOR = ['Bueno', 'Sin imagen', 'Imagen distorsionada', 'Píxeles muertos', 'Pantalla rayada', 'Pantalla rota', 'Dañado'];
const OPT_ETHERNET = ['Bueno', 'Conector dañado', 'Cable cortado', 'Sin conexión', 'Dañado'];
const OPT_ESTADO_CPU = ['Funciona', 'No funciona', 'Con fallas', 'En revisión', 'Requiere mantenimiento'];
const OPT_ESTADO_COMPUTADORA = ['Funcionando', 'No funciona', 'Requiere revisión', 'Requiere Mantenimiento'];

export default function ComputerFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  salaId = null,
  salaNombre = null,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        idEquipoComputo: initialData.idEquipoComputo ?? null,

        inventario: initialData.inventario ?? '',
        nombreArticulo: initialData.nombreArticulo ?? '',
        nombreMarca: initialData.nombreMarca ?? '',
        nombreModelo: initialData.nombreModelo ?? '',
        serie: initialData.serie ?? '',
        cantidad: 1,
        caracteristicas: initialData.caracteristicas ?? '',
        estado: initialData.estado ?? initialData.estadoBase ?? 'ALTA',

        especificacionesHardware: initialData.especificacionesHardware ?? '',
        sistemaOperativo: initialData.sistemaOperativo ?? '',
        softwareInstalado: initialData.softwareInstalado ?? '',
        procesador: initialData.procesador ?? '',
        ram: initialData.ram ?? '',
        almacenamiento: initialData.almacenamiento ?? '',

        contrasena: initialData.contrasena ?? '',
        passwordAdmin: initialData.passwordAdmin ?? '',
        lastPassword: initialData.lastPassword ?? '',

        estadoTeclado: initialData.estadoTeclado ?? 'Bueno',
        estadoMouse: initialData.estadoMouse ?? 'Bueno',
        estadoMonitor: initialData.estadoMonitor ?? 'Bueno',
        estadoCableEthernet: initialData.estadoCableEthernet ?? 'Bueno',

        estadoCpu: initialData.estadoCpu ?? 'Funciona',
        estadoComputadora: initialData.estadoComputadora ?? 'Funcionando',

        observaciones: initialData.observaciones ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, cantidad: 1 });
  };

  const inputCls =
    'w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:border-[#486AE6] focus:ring-2 focus:ring-[#486AE6]/20 transition-all';
  const labelCls = 'block text-xs font-bold text-slate-700 uppercase mb-2';
  const hintCls = 'text-[10px] text-slate-400 mt-1';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {initialData ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
            </h2>
            {salaNombre && (
              <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold uppercase tracking-wider text-[#486AE6] bg-[#486AE6]/10 px-2.5 py-1 rounded-lg">
                🏫 Sala: {salaNombre}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-red-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* ============ SECCIÓN 1: DATOS GENERALES ============ */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-4">
              Datos Generales del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>No. Inventario *</label>
                <input
                  required
                  type="text"
                  name="inventario"
                  placeholder="Ej. UAT-2024-00123"
                  value={formData.inventario || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
                <p className={hintCls}>
                  Identificador único del equipo. Modifícalo con precaución.
                </p>
              </div>

              <div>
                <label className={labelCls}>No. Serie</label>
                <input
                  type="text"
                  name="serie"
                  placeholder="Ej. SN-5CD1234ABC"
                  value={formData.serie || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Artículo *</label>
                <input
                  required
                  type="text"
                  name="nombreArticulo"
                  placeholder="Ej. Computadora de Escritorio, Laptop, Monitor"
                  value={formData.nombreArticulo || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Marca *</label>
                <input
                  required
                  type="text"
                  name="nombreMarca"
                  placeholder="Ej. HP, Dell, Lenovo, Acer"
                  value={formData.nombreMarca || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Modelo *</label>
                <input
                  required
                  type="text"
                  name="nombreModelo"
                  placeholder="Ej. ProDesk 600 G6, OptiPlex 3080"
                  value={formData.nombreModelo || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  value={1}
                  readOnly
                  className={`${inputCls} bg-slate-100 cursor-not-allowed text-slate-500`}
                />
                <p className={hintCls}>Fijo en 1 (cada registro es una unidad física).</p>
              </div>

              <div>
                <label className={labelCls}>Estado del Inventario</label>
                <select
                  name="estado"
                  value={formData.estado || 'ALTA'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  <option value="ALTA">ALTA</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Estado Físico (CPU)</label>
                <select
                  name="estadoCpu"
                  value={formData.estadoCpu || 'Funciona'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_ESTADO_CPU.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Estado Operativo de la Computadora</label>
                <select
                  name="estadoComputadora"
                  value={formData.estadoComputadora || 'Funcionando'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_ESTADO_COMPUTADORA.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Características</label>
                <textarea
                  name="caracteristicas"
                  rows="2"
                  placeholder='Separa por comas. Ej. Pantalla 21.5", Teclado español, Bocinas integradas, Cámara web'
                  value={formData.caracteristicas || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
                <p className={hintCls}>
                  💡 Cada característica separada por coma: <em>WiFi, Bluetooth, Lector DVD</em>
                </p>
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 2: DETALLE TÉCNICO ============ */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-4">
              Detalle Técnico
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Sistema Operativo</label>
                <input
                  type="text"
                  name="sistemaOperativo"
                  placeholder="Ej. Windows 11 Pro, Ubuntu 22.04"
                  value={formData.sistemaOperativo || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Procesador</label>
                <input
                  type="text"
                  name="procesador"
                  placeholder="Ej. Intel Core i5-10400 @ 2.9GHz"
                  value={formData.procesador || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>RAM</label>
                <input
                  type="text"
                  name="ram"
                  placeholder="Ej. 8GB DDR4 2666MHz"
                  value={formData.ram || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Almacenamiento</label>
                <input
                  type="text"
                  name="almacenamiento"
                  placeholder="Ej. 256GB SSD NVMe"
                  value={formData.almacenamiento || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Especificaciones de Hardware</label>
                <textarea
                  name="especificacionesHardware"
                  rows="2"
                  placeholder="Ej. Torre mini-torre, 2 puertos USB 3.0 frontales, HDMI + VGA, tarjeta de red Gigabit"
                  value={formData.especificacionesHardware || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelCls}>Software Instalado</label>
                <textarea
                  name="softwareInstalado"
                  rows="2"
                  placeholder="Ej. Office 2021, Chrome, AutoCAD 2023, VLC, Adobe Reader"
                  value={formData.softwareInstalado || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Estado Teclado</label>
                <select
                  name="estadoTeclado"
                  value={formData.estadoTeclado || 'Bueno'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_TECLADO.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Estado Mouse</label>
                <select
                  name="estadoMouse"
                  value={formData.estadoMouse || 'Bueno'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_MOUSE.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Estado Monitor</label>
                <select
                  name="estadoMonitor"
                  value={formData.estadoMonitor || 'Bueno'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_MONITOR.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Estado Cable Ethernet</label>
                <select
                  name="estadoCableEthernet"
                  value={formData.estadoCableEthernet || 'Bueno'}
                  onChange={handleChange}
                  className={`${inputCls} bg-white`}
                >
                  {OPT_ETHERNET.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 3: CONTRASEÑAS ============ */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-4">
              Credenciales del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Contraseña</label>
                <input
                  type="text"
                  name="contrasena"
                  placeholder="Contraseña general"
                  value={formData.contrasena || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Contraseña Admin</label>
                <input
                  type="text"
                  name="passwordAdmin"
                  placeholder="Contraseña de administrador"
                  value={formData.passwordAdmin || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Última Contraseña</label>
                <input
                  type="text"
                  name="lastPassword"
                  placeholder="Historial / última"
                  value={formData.lastPassword || ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>
          </section>

          {/* ============ SECCIÓN 4: OBSERVACIONES ============ */}
          <section>
            <h3 className="text-xs font-extrabold text-[#486AE6] uppercase tracking-widest mb-4">
              Observaciones
            </h3>
            <div>
              <textarea
                name="observaciones"
                rows="3"
                placeholder="Ej. Equipo recién formateado, pendiente instalar antivirus..."
                value={formData.observaciones || ''}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#486AE6] rounded-xl shadow-md hover:bg-[#3b59c7] transition-all"
            >
              {initialData ? 'Actualizar Equipo' : 'Guardar Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}