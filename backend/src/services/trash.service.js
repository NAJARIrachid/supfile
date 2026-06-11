/**
 * Logique métier — corbeille (fichiers soft-deleted)
 */
const fileRepository = require('../repositories/file.repository');
const AppError = require('../utils/AppError');
const { serializeFile } = require('./file.service');

async function listTrash(ownerId) {
  const items = await fileRepository.findTrashByOwner(ownerId);
  return items.map(serializeFile);
}

async function restoreFile(ownerId, id) {
  const file = await fileRepository.findByIdAndOwner(id, ownerId);
  if (!file || !file.deletedAt) {
    throw new AppError('Élément introuvable dans la corbeille', 404, 'TRASH_NOT_FOUND');
  }
  const restored = await fileRepository.restore(id);
  return serializeFile(restored);
}

module.exports = { listTrash, restoreFile };
