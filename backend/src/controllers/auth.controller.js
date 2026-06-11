/**
 * Contrôleurs HTTP — authentification
 */
const authService = require('../services/auth.service');
const config = require('../config');

async function register(req, res) {
  const data = req.validatedBody;
  const result = await authService.register(data);
  res.status(201).json({ success: true, data: result });
}

async function login(req, res) {
  const data = req.validatedBody;
  const result = await authService.login(data);
  res.json({ success: true, data: result });
}

/** Redirige vers Google OAuth (géré par Passport) */
function googleAuth(_req, res, next) {
  next();
}

/** Callback Google — req.user contient { user, token } injecté par Passport */
function googleCallback(req, res, next) {
  if (!req.user?.token) {
    return next(new Error('Authentification Google échouée'));
  }
  const frontendUrl = config.corsOrigin;
  res.redirect(`${frontendUrl}/auth/callback?token=${req.user.token}`);
}

module.exports = { register, login, googleAuth, googleCallback };
