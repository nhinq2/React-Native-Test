/**
 * Request logging middleware.
 * Logs method, path, status, and response time.
 */

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const path = req.originalUrl || req.url;
    console.log(`${method} ${path} ${status} - ${ms}ms`);
  });

  next();
}

module.exports = requestLogger;
