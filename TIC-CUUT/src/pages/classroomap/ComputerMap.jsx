import React, { useEffect, useRef } from 'react';

export default function ComputerMap({ classroom, onSelectComputer }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FFE5B4');
    gradient.addColorStop(1, '#F5D9A8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#E8D5B5';
    ctx.strokeStyle = '#A87943';
    ctx.lineWidth = 2;
    ctx.fillRect(40, 20, 200, 60);
    ctx.strokeRect(40, 20, 200, 60);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('ZONA PROFESOR', 85, 55);

    const { computers, layout } = classroom;
    const cols = layout.columnsPerSide || 3;
    const spacingX = 70;
    const spacingY = 60;
    const startX = 60;
    const startY = 120;

    computers.forEach((computer, index) => {
      const col = index % (cols * 2);
      const row = Math.floor(index / (cols * 2));
      
      let x = startX + (col % cols) * spacingX;
      if (col >= cols) x += (cols * spacingX) + 80;
      const y = startY + row * spacingY;

      // Colores ajustados a la nueva leyenda
      const colors = { 
        'Funcionando': '#4CAF50', 
        'No funciona': '#f44336', 
        'Requiere revision': '#FFC107', 
        'Requiere Mantenimiento': '#2196F3' 
      };
      
      ctx.fillStyle = colors[computer.status] || '#9E9E9E';
      ctx.fillRect(x, y, 50, 35);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x, y, 50, 35);
      
      ctx.fillStyle = '#fff';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(computer.name, x + 25, y + 22);

      computer.position = { x, y, width: 50, height: 35 };
    });

    const aisleX = startX + cols * spacingX + 40;
    ctx.strokeStyle = '#666';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(aisleX, 100);
    ctx.lineTo(aisleX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#666';
    ctx.fillText('PASILLO CENTRAL', aisleX, 100);

  }, [classroom]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const computer = classroom.computers.find(c => 
      c.position && x >= c.position.x && x <= c.position.x + c.position.width &&
      y >= c.position.y && y <= c.position.y + c.position.height
    );

    if (computer) onSelectComputer(computer);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 overflow-x-auto">
      <canvas ref={canvasRef} width={800} height={600} className="rounded-lg cursor-pointer max-w-full" onClick={handleCanvasClick} />
    </div>
  );
}