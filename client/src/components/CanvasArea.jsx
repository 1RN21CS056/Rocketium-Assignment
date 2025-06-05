import React, { useEffect, useRef } from 'react';

const CanvasArea = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <canvas ref={canvasRef} id="previewCanvas" />
  );
};

export default CanvasArea;
