import React, { useState } from 'react';

const Controls = () => {
  const [shape, setShape] = useState('rectangle');
  const [color, setColor] = useState('#000000');
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const API_BASE = "https://canvasbuilder.onrender.com";

  const draw = async () => {
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;

    let imageBase64 = null;

    if (shape === 'rectangle') {
      ctx.fillRect(x, y, width, height);
    } else if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x, y, width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'text') {
      ctx.font = '20px Arial';
      ctx.fillText(text || 'Text', x, y);
    } else if (shape === 'image' && imageFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageSrc = event.target.result;

        const img = new Image();
        img.onload = async () => {
          ctx.drawImage(img, x, y, width, height);

          // Drawn to canvas, now send base64
          const shapeData = {
            type: shape,
            x,
            y,
            width,
            height,
            color,
            text,
            imageBase64: imageSrc
          };

          await fetch(`${API_BASE}/api/add-shape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shapeData),
          });
        };
        img.src = imageSrc;
      };
      reader.readAsDataURL(imageFile);
      return;
    }

    const shapeData = { type: shape, x, y, width, height, color, text, imageBase64 };
    await fetch(`${API_BASE}/api/add-shape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shapeData),
    });
  };

  const exportToPDF = async () => {
    const res = await fetch(`${API_BASE}/api/export`);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'canvas.pdf';
    link.click();
  };

  const clearCanvas = async () => {
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await fetch(`${API_BASE}/api/init-canvas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ width: 500, height: 500 })
    });
  };

  return (
    <div style={{ backgroundColor: '#f2f2f2', padding: '1rem', borderRadius: '10px' }}>
      <label>Shape</label>
      <select value={shape} onChange={(e) => setShape(e.target.value)} style={{ width: '100%' }}>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="text">Text</option>
        <option value="image">Image (Upload)</option>
      </select>

      {shape === 'text' && (
        <>
          <label>Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%' }} />
        </>
      )}

      {shape === 'image' && (
        <>
          <label>Choose Image</label>
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
        </>
      )}

      <label>Color</label>
      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

      <label>X Position</label>
      <input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
      <label>Y Position</label>
      <input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
      <label>Width</label>
      <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
      <label>Height</label>
      <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
        <button onClick={draw} style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}>Draw</button>
        <button onClick={exportToPDF} style={{ backgroundColor: '#2196F3', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}>Export PDF</button>
        <button onClick={clearCanvas} style={{ backgroundColor: '#f44336', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '5px' }}>Clear</button>
      </div>
    </div>
  );
};

export default Controls;
