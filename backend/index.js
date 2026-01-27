/**
 * Insight Global Assessment API — Node.js (JavaScript).
 * In-memory projects CRUD. Candidates focus on the mobile frontend.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const requestLogger = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const projectsRouter = require('./routes/projects');
const statsRouter = require('./routes/stats');
const { fetchProjectsConfig } = require('./data/projects');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'ig-assessment-api',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/projects', projectsRouter);
app.use('/api/stats', statsRouter);

// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

app.listen(config.port, async () => {
  console.log(`API running at http://localhost:${config.port}`);
  console.log('Endpoints:');
  console.log('  GET  /health');
  console.log('  GET  /api/stats');
  console.log('  GET  /api/projects');
  console.log('  GET  /api/projects/:id');
  console.log('  POST /api/projects');
  console.log('  PUT  /api/projects/:id');
  console.log('  DELETE /api/projects/:id');
  try {
    await fetchProjectsConfig();
  } catch (err) {
    console.warn('fetchProjectsConfig:', err.message);
  }
});

module.exports = app;
