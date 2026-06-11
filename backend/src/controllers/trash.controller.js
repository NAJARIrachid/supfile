/**
 * Contrôleurs HTTP — corbeille
 */
const trashService = require('../services/trash.service');

async function list(req, res) {
  const items = await trashService.listTrash(req.user.id);
  res.json({ success: true, data: items });
}

async function restore(req, res) {
  const file = await trashService.restoreFile(req.user.id, req.params.id);
  res.json({ success: true, data: file });
}

module.exports = { list, restore };
