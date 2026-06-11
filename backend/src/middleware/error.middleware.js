/**
 * Gestion centralisée des erreurs Express
 */
const AppError = require('../utils/AppError');

function notFoundHandler(req, res, next) {
  next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.isOperational ? err.message : 'Erreur interne du serveur';

  if (process.env.NODE_ENV === 'development' && !err.isOperational) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && !err.isOperational
        ? { stack: err.stack }
        : {}),
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
