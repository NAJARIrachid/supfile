/**
 * Contrôleurs HTTP — partage
 */
const shareService = require('../services/share.service');

async function create(req, res) {
  const share = await shareService.createShare(req.user.id, req.validatedBody);
  res.status(201).json({ success: true, data: share });
}

async function getByToken(req, res) {
  const password = req.query.password || req.body?.password;
  const result = await shareService.accessShare(req.params.token, password, res);
  if (!result?.streamed) {
    res.json({ success: true, data: result });
  }
}

module.exports = { create, getByToken };
