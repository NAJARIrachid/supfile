/**
 * Logique métier — authentification locale (register / login)
 */
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const { signToken } = require('../utils/token');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 12;

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

async function register({ email, password }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AppError('Cet email est déjà utilisé', 409, 'EMAIL_EXISTS');
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userRepository.create({
    email,
    password: hashed,
    provider: 'LOCAL',
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
}

async function login({ email, password }) {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.password) {
    throw new AppError('Identifiants invalides', 401, 'INVALID_CREDENTIALS');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError('Identifiants invalides', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ userId: user.id, email: user.email });
  return { user: sanitizeUser(user), token };
}

module.exports = { register, login, sanitizeUser };
