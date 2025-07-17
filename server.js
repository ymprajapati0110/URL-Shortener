const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

let db = {}; // In-memory storage or you can load from file

function generateCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

app.post('/shorten', (req, res) => {
  const longUrl = req.body.url;
  const code = generateCode();
  db[code] = longUrl;
  res.json({ shortUrl: `http://localhost:${PORT}/${code}` });
});

// Redirect handler
app.get('/:code', (req, res) => {
  const code = req.params.code;
  const longUrl = db[code];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Link not found.');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
