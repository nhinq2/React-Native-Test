/**
 * Global error-handling middleware.
 * Catches sync throws and passes async errors via next(err).
 */

const { isDevelopment } = require('../config');

function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (isDevelopment) {
    console.error('Error:', err);
  }

  res.status(status).json({
    error: message,
    ...(isDevelopment && err.stack ? { stack: err.stack } : {}),
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl || req.url,
  });
}

module.exports = { errorHandler, notFoundHandler };
