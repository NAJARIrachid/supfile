/**
 * Rate limiting global — protection contre abus (brute force, spam uploads)
 */
const rateLimit = require('express-rate-limit');
const config = require('../config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Trop de requêtes, réessayez plus tard' },
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Trop de tentatives de connexion' },
  },
});

module.exports = { apiLimiter, authLimiter };
