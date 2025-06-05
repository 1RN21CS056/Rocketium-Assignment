const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createCanvas, loadImage } = require('canvas');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory canvas data
let canvasData = {
  width: 500,
  height: 500,
  shapes: []
};

// Init/reset canvas
app.post('/api/init-canvas', (req, res) => {
  const { width, height } = req.body;
  canvasData = { width, height, shapes: [] };
  res.send({ message: 'Canvas initialized.' });
});

// Add shape/image/text
app.post('/api/add-shape', (req, res) => {
  const { type, x, y, width, height, color, text, imageBase64 } = req.body;
  canvasData.shapes.push({ type, x, y, width, height, color, text, imageBase64 });
  res.send({ message: 'Element added.' });
});

// Export canvas to PDF
app.get('/api/export', async (req, res) => {
  const canvas = createCanvas(canvasData.width, canvasData.height);
  const ctx = canvas.getContext('2d');

  // white background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const el of canvasData.shapes) {
    ctx.fillStyle = el.color || '#000';

    if (el.type === 'rectangle') {
      ctx.fillRect(el.x, el.y, el.width || 100, el.height || 100);
    } else if (el.type === 'circle') {
      const radius = (el.width || 100) / 2;
      ctx.beginPath();
      ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (el.type === 'text') {
      ctx.font = '20px Arial';
      ctx.fillText(el.text || 'Text', el.x, el.y);
    } else if (el.type === 'image' && el.imageBase64) {
      try {
        const img = await loadImage(el.imageBase64);
        ctx.drawImage(img, el.x, el.y, el.width || 100, el.height || 100);
      } catch (err) {
        console.error('Base64 image load failed:', err.message);
      }
    }
  }

  const buffer = canvas.toBuffer('image/png');
  const doc = new PDFDocument({ size: [canvas.width, canvas.height] });
  res.setHeader('Content-Disposition', 'attachment; filename="canvas.pdf"');
  res.setHeader('Content-Type', 'application/pdf');

  doc.image(buffer, 0, 0);
  doc.pipe(res);
  doc.end();
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
