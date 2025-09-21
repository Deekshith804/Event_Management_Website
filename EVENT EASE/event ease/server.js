'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory stores (demo only)
const bookings = [];
const contacts = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Bookings API
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { category, event, name, email } = req.body || {};
  if (!category || !event || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const booking = {
    id: bookings.length + 1,
    category,
    event,
    name,
    email,
    date: new Date().toISOString(),
    status: 'confirmed'
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.delete('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  bookings.splice(idx, 1);
  res.json({ ok: true });
});

// Contacts API
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const contact = { id: contacts.length + 1, name, email, message, date: new Date().toISOString() };
  contacts.push(contact);
  res.status(201).json(contact);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});




