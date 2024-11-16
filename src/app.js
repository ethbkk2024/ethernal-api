const express = require('express');
const cors = require('cors');
const lighthouseRoutes = require('./routes/lighthouseRoutes');
const missionRoutes = require('./routes/missionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/light-house', lighthouseRoutes);
app.use('/api/mission', missionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pvp', require('./routes/pvpRoutes').router);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
