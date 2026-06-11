/**
 * Contrôleurs HTTP — fichiers
 */
const fileService = require('../services/file.service');
const fileStorage = require('../utils/fileStorage');
const AppError = require('../utils/AppError');

async function list(req, res) {
  const folderId = req.query.folderId || null;
  const files = await fileService.listFiles(req.user.id, folderId);
  res.json({ success: true, data: files });
}

async function upload(req, res) {
  if (!req.file) {
    throw new AppError('Aucun fichier fourni', 400, 'NO_FILE');
  }
  const folderId = req.body.folderId || null;
  const record = await fileService.uploadFile(req.user.id, req.file, folderId);
  res.status(201).json({ success: true, data: record });
}

async function download(req, res) {
  const file = await fileService.getFileForDownload(req.user.id, req.params.id);
  const absolute = fileStorage.getAbsolutePath(file.path);
  res.download(absolute, file.name);
}

async function update(req, res) {
  const record = await fileService.updateFile(
    req.user.id,
    req.params.id,
    req.validatedBody
  );
  res.json({ success: true, data: record });
}

async function remove(req, res) {
  await fileService.deleteFile(req.user.id, req.params.id);
  res.json({ success: true, message: 'Fichier déplacé vers la corbeille' });
}

module.exports = { list, upload, download, update, remove };
