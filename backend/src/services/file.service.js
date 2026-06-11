/**
 * Logique métier — upload, téléchargement, renommage, suppression de fichiers
 */
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const folderRepository = require('../repositories/folder.repository');
const fileRepository = require('../repositories/file.repository');
const AppError = require('../utils/AppError');
const fileStorage = require('../utils/fileStorage');

async function uploadFile(ownerId, multerFile, folderId) {
  if (folderId) {
    const folder = await folderRepository.findByIdAndOwner(folderId, ownerId);
    if (!folder) {
      throw new AppError('Dossier cible introuvable', 404, 'FOLDER_NOT_FOUND');
    }
  }

  const displayName = fileStorage.sanitizeFilename(multerFile.originalname);
  const relativePath = fileStorage.saveUploadedFile(
    ownerId,
    multerFile.originalname,
    multerFile.buffer
  );

  const record = await fileRepository.create({
    name: displayName,
    path: relativePath,
    mimeType: multerFile.mimetype || 'application/octet-stream',
    size: BigInt(multerFile.size),
    folderId: folderId || null,
    ownerId,
  });

  return serializeFile(record);
}

async function getFileForDownload(ownerId, id) {
  const file = await fileRepository.findByIdAndOwner(id, ownerId);
  if (!file || file.deletedAt) {
    throw new AppError('Fichier introuvable', 404, 'FILE_NOT_FOUND');
  }
  if (!fileStorage.fileExists(file.path)) {
    throw new AppError('Fichier physique manquant sur le serveur', 404, 'FILE_MISSING');
  }
  return file;
}

async function updateFile(ownerId, id, data) {
  const file = await fileRepository.findByIdAndOwner(id, ownerId);
  if (!file || file.deletedAt) {
    throw new AppError('Fichier introuvable', 404, 'FILE_NOT_FOUND');
  }

  if (data.folderId !== undefined && data.folderId !== null) {
    const folder = await folderRepository.findByIdAndOwner(data.folderId, ownerId);
    if (!folder) {
      throw new AppError('Dossier cible introuvable', 404, 'FOLDER_NOT_FOUND');
    }
  }

  const updated = await fileRepository.update(id, data);
  return serializeFile(updated);
}

async function listFiles(ownerId, folderId) {
  const files = await fileRepository.findByFolder(ownerId, folderId || null);
  return files.map(serializeFile);
}

async function deleteFile(ownerId, id) {
  const file = await fileRepository.findByIdAndOwner(id, ownerId);
  if (!file) {
    throw new AppError('Fichier introuvable', 404, 'FILE_NOT_FOUND');
  }
  return fileRepository.softDelete(id);
}

/** Sérialise BigInt pour JSON */
function serializeFile(file) {
  if (!file) return file;
  return {
    ...file,
    size: file.size?.toString?.() ?? String(file.size),
  };
}

/** Stream ZIP d'un dossier partagé (utilisé par share service) */
function streamFolderAsZip(folder, res) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${folder.name}.zip"`);
  archive.pipe(res);

  for (const file of folder.files || []) {
    const abs = fileStorage.getAbsolutePath(file.path);
    if (fs.existsSync(abs)) {
      archive.file(abs, { name: file.name });
    }
  }
  archive.finalize();
}

module.exports = {
  uploadFile,
  listFiles,
  getFileForDownload,
  updateFile,
  deleteFile,
  serializeFile,
  streamFolderAsZip,
};
