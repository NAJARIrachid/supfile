/**
 * Contrôleurs HTTP — dossiers
 */
const folderService = require('../services/folder.service');
const fileService = require('../services/file.service');

async function list(req, res) {
  const parentId = req.query.parentId || null;
  const folders = await folderService.listByParent(req.user.id, parentId);
  res.json({ success: true, data: folders });
}

async function download(req, res) {
  const folder = await folderService.getFolderForDownload(req.user.id, req.params.id);
  fileService.streamFolderAsZip(folder, res);
}

async function create(req, res) {
  const folder = await folderService.createFolder(req.user.id, req.validatedBody);
  res.status(201).json({ success: true, data: folder });
}

async function getById(req, res) {
  const folder = await folderService.getFolder(req.user.id, req.params.id);
  res.json({ success: true, data: folder });
}

async function update(req, res) {
  const folder = await folderService.updateFolder(
    req.user.id,
    req.params.id,
    req.validatedBody
  );
  res.json({ success: true, data: folder });
}

async function remove(req, res) {
  await folderService.deleteFolder(req.user.id, req.params.id);
  res.json({ success: true, message: 'Dossier supprimé' });
}

module.exports = { list, download, create, getById, update, remove };
