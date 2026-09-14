export const mockClassrooms = [
  {
    id: 'A1',
    name: 'A1',
    computers: Array.from({ length: 12 }).map((_, i) => ({
      id_equipo_computo: `eq-${Date.now()}-${i}`,
      inventario: `INV-2026-A1-${100 + i}`,
      especificaciones_hardware: 'Intel Core i5, 16GB RAM, 512GB SSD',
      sistema_operativo: 'Windows 11 Pro',
      software_instalado: 'Office 365, Visual Studio Code',
      estado_teclado: 'Bueno',
      estado_mouse: 'Bueno',
      estado_cable_ethernet: 'Conectado',
      estado_monitor: 'Bueno',
      status: i % 4 === 0 ? 'No funciona' : i % 3 === 0 ? 'Requiere revision' : 'Funcionando',
      fecha_registro: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    }))
  }
];