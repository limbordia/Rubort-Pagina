const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const urlDatabase = {};

// Función para generar ID aleatorio del enlace
function generateShortId() {
  return Math.random().toString(36).substr(2, 5);
}

// Ruta para capturar IP y redirigir
app.get('/r/:shortCode', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const urlOriginal = urlDatabase[req.params.shortCode]; // Cambié shortLinks por urlDatabase

  if (urlOriginal) {
    console.log(`Acceso desde IP: ${clientIp}, Enlace: ${urlOriginal}`);
    res.redirect(urlOriginal);
  } else {
    res.status(404).send('Enlace no encontrado');
  }
});


// API para acortar URL
app.post('/api/acortar', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send({ error: 'URL requerida' });

  const shortId = generateShortId();
  urlDatabase[shortId] = url;
  const shortUrl = `${req.protocol}://${req.get('host')}/r/${shortId}`;
  res.send({ shortUrl });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor ejecutándose en http://0.0.0.0:3000');
  });
