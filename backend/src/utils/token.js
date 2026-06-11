/**
 * Utilitaires JWT — signature et vérification des tokens d'authentification
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const AppError = require('./AppError');

function signToken(payload) {
  if (!config.jwt.secret) {
    throw new AppError('JWT_SECRET non configuré', 500, 'CONFIG_ERROR');
  }
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function verifyToken(token) {
  if (!config.jwt.secret) {
    throw new AppError('JWT_SECRET non configuré', 500, 'CONFIG_ERROR');
  }
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { signToken, verifyToken };
