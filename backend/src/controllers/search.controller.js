/**
 * Contrôleurs HTTP — recherche
 */
const searchService = require('../services/search.service');

async function search(req, res) {
  const q = req.query.q || '';
  const results = await searchService.search(req.user.id, q);
  res.json({ success: true, data: results });
}

module.exports = { search };
