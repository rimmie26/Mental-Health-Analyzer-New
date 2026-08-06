const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const goalRoutes = require('./routes/goalRoutes');
const moodRoutes = require('./routes/moodRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MindWell Backend Operational' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/mood', moodRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});