/**
 * Logique métier — gestion des dossiers
 */
const folderRepository = require('../repositories/folder.repository');
const AppError = require('../utils/AppError');

async function createFolder(ownerId, { name, parentId }) {
  if (parentId) {
    const parent = await folderRepository.findByIdAndOwner(parentId, ownerId);
    if (!parent) {
      throw new AppError('Dossier parent introuvable', 404, 'PARENT_NOT_FOUND');
    }
  }

  return folderRepository.create({
    name,
    parentId: parentId || null,
    ownerId,
  });
}

async function getFolder(ownerId, id) {
  const folder = await folderRepository.findByIdAndOwner(id, ownerId);
  if (!folder) {
    throw new AppError('Dossier introuvable', 404, 'FOLDER_NOT_FOUND');
  }
  return folder;
}

async function updateFolder(ownerId, id, data) {
  await getFolder(ownerId, id);

  if (data.parentId) {
    if (data.parentId === id) {
      throw new AppError('Un dossier ne peut pas être son propre parent', 400, 'INVALID_PARENT');
    }
    const parent = await folderRepository.findByIdAndOwner(data.parentId, ownerId);
    if (!parent) {
      throw new AppError('Dossier parent introuvable', 404, 'PARENT_NOT_FOUND');
    }
  }

  return folderRepository.update(id, data);
}

async function deleteFolder(ownerId, id) {
  await getFolder(ownerId, id);
  return folderRepository.remove(id);
}

async function listByParent(ownerId, parentId) {
  return folderRepository.findByParent(ownerId, parentId || null);
}

async function getFolderForDownload(ownerId, id) {
  const folder = await folderRepository.findByIdWithFiles(id, ownerId);
  if (!folder) {
    throw new AppError('Dossier introuvable', 404, 'FOLDER_NOT_FOUND');
  }
  return folder;
}

module.exports = {
  createFolder,
  getFolder,
  updateFolder,
  deleteFolder,
  listByParent,
  getFolderForDownload,
};
