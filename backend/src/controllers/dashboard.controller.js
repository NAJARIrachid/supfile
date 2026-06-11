/**
 * Contrôleurs HTTP — tableau de bord
 */
const dashboardService = require('../services/dashboard.service');

async function getDashboard(req, res) {
  const data = await dashboardService.getDashboard(req.user.id);
  res.json({ success: true, data });
}

module.exports = { getDashboard };
