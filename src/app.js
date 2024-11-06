const express = require('express');
const lighthouseRoutes = require('./routes/lighthouseRoutes');

const app = express();
app.use(express.json());

app.use('/api/light-house', lighthouseRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
