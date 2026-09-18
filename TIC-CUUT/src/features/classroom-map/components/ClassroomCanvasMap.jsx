import React, { useEffect, useRef } from 'react';

export default function ClassroomCanvasMap({ classroom, onSelectComputer }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Fondo sutil y limpio (Degradado Slate 50 a Slate 100)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#F8FAFC');
    gradient.addColorStop(1, '#F1F5F9');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Zona del Profesor
    ctx.fillStyle = '#E2E8F0'; // slate-200
    ctx.strokeStyle = '#94A3B8'; // slate-400
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    // Usamos roundRect para bordes redondeados
    ctx.roundRect(40, 20, 200, 60, 8); 
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#334155'; // slate-700
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText('ZONA PROFESOR', 85, 55);

    const { computers, layout } = classroom;
    const cols = layout.columnsPerSide || 3;
    const spacingX = 75;
    const spacingY = 65;
    const startX = 60;
    const startY = 120;

    computers.forEach((computer, index) => {
      const col = index % (cols * 2);
      const row = Math.floor(index / (cols * 2));
      
      let x = startX + (col % cols) * spacingX;
      if (col >= cols) x += (cols * spacingX) + 80;
      const y = startY + row * spacingY;

      // Paleta de estados actualizada
      const colors = { 
        'Funcionando': '#7AD349', 
        'No funciona': '#EF4444', 
        'Requiere revision': '#EAB308', 
        'Requiere Mantenimiento': '#486AE6' 
      };
      
      const bgColor = colors[computer.status] || '#94A3B8'; // default slate-400
      
      // Aplicar sombra ligera a los equipos
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // Caja del equipo
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(x, y, 52, 38, 6);
      ctx.fill();
      
      // Resetear sombra para el texto
      ctx.shadowColor = 'transparent';

      // Texto del equipo (Nombre/Identificador corto)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(computer.name, x + 26, y + 24);

      // Guardar posición para detección de clics
      computer.position = { x, y, width: 52, height: 38 };
    });

    // Línea divisora del Pasillo Central
    const aisleX = startX + cols * spacingX + 40;
    ctx.strokeStyle = '#CBD5E1'; // slate-300
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(aisleX, 100);
    ctx.lineTo(aisleX, height - 20);
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset
    ctx.fillStyle = '#94A3B8'; // slate-400
    ctx.font = 'bold 10px "Inter", sans-serif';
    ctx.fillText('PASILLO CENTRAL', aisleX, 110);

  }, [classroom]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Detectar si el clic ocurrió dentro de alguna computadora
    const computer = classroom.computers.find(c => 
      c.position && x >= c.position.x && x <= c.position.x + c.position.width &&
      y >= c.position.y && y <= c.position.y + c.position.height
    );

    if (computer) onSelectComputer(computer);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 overflow-x-auto flex justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="rounded-xl cursor-pointer max-w-full" 
        onClick={handleCanvasClick} 
      />
    </div>
  );
}