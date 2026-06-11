/**
 * Middleware JWT — extrait et vérifie le Bearer token, attache req.user
 */
const userRepository = require('../repositories/user.repository');
const { verifyToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token d\'authentification manquant', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new AppError('Token invalide ou expiré', 401, 'UNAUTHORIZED');
  }

  const user = await userRepository.findById(decoded.userId);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 401, 'UNAUTHORIZED');
  }

  delete user.password;
  req.user = user;
  next();
});

module.exports = { authenticate };
