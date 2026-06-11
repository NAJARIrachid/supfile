const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 12;

async function updateProfile(userId, data) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('Utilisateur introuvable', 404, 'USER_NOT_FOUND');
  }

  const payload = {};

  if (data.email && data.email !== user.email) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Cet email est déjà utilisé', 409, 'EMAIL_EXISTS');
    }
    payload.email = data.email;
  }

  if (data.password) {
    payload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  if (data.avatar !== undefined) {
    payload.avatar = data.avatar;
  }

  const updated = await userRepository.update(userId, payload);
  const { password, ...safe } = updated;
  return safe;
}

module.exports = { updateProfile };
