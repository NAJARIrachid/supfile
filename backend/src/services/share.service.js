/**
 * Logique métier — liens de partage et partage utilisateur → utilisateur
 */
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const shareRepository = require('../repositories/share.repository');
const folderShareRepository = require('../repositories/folderShare.repository');
const fileRepository = require('../repositories/file.repository');
const folderRepository = require('../repositories/folder.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const fileStorage = require('../utils/fileStorage');
const { streamFolderAsZip } = require('./file.service');

const SALT_ROUNDS = 10;

async function createShare(ownerId, body) {
  const { fileId, folderId, password, expiresAt, targetUserId } = body;

  // Partage direct dossier → autre utilisateur inscrit
  if (targetUserId && folderId) {
    const folder = await folderRepository.findByIdAndOwner(folderId, ownerId);
    if (!folder) {
      throw new AppError('Dossier introuvable', 404, 'FOLDER_NOT_FOUND');
    }
    const target = await userRepository.findById(targetUserId);
    if (!target) {
      throw new AppError('Utilisateur cible introuvable', 404, 'USER_NOT_FOUND');
    }
    const existing = await folderShareRepository.findByFolderAndTarget(folderId, targetUserId);
    if (existing) {
      throw new AppError('Dossier déjà partagé avec cet utilisateur', 409, 'ALREADY_SHARED');
    }
    return folderShareRepository.create({ folderId, ownerId, targetUserId });
  }

  // Lien public tokenisé
  if (fileId) {
    const file = await fileRepository.findByIdAndOwner(fileId, ownerId);
    if (!file || file.deletedAt) {
      throw new AppError('Fichier introuvable', 404, 'FILE_NOT_FOUND');
    }
  }
  if (folderId) {
    const folder = await folderRepository.findByIdAndOwner(folderId, ownerId);
    if (!folder) {
      throw new AppError('Dossier introuvable', 404, 'FOLDER_NOT_FOUND');
    }
  }

  const token = uuidv4().replace(/-/g, '');
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  }

  return shareRepository.create({
    token,
    password: hashedPassword,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    fileId: fileId || null,
    folderId: folderId || null,
  });
}

async function accessShare(token, password, res) {
  const link = await shareRepository.findByToken(token);
  if (!link) {
    throw new AppError('Lien de partage invalide', 404, 'SHARE_NOT_FOUND');
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    throw new AppError('Lien de partage expiré', 410, 'SHARE_EXPIRED');
  }

  if (link.password) {
    if (!password) {
      throw new AppError('Mot de passe requis pour ce lien', 401, 'SHARE_PASSWORD_REQUIRED');
    }
    const ok = await bcrypt.compare(password, link.password);
    if (!ok) {
      throw new AppError('Mot de passe incorrect', 401, 'SHARE_PASSWORD_INVALID');
    }
  }

  if (link.file) {
    if (!fileStorage.fileExists(link.file.path)) {
      throw new AppError('Fichier non disponible', 404, 'FILE_MISSING');
    }
    const abs = fileStorage.getAbsolutePath(link.file.path);
    res.download(abs, link.file.name);
    return { streamed: true };
  }

  if (link.folder) {
    streamFolderAsZip(link.folder, res);
    return { streamed: true };
  }

  throw new AppError('Ressource de partage introuvable', 404, 'SHARE_EMPTY');
}

module.exports = { createShare, accessShare };
