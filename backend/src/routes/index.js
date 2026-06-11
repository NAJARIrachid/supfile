/**
 * Agrégation de toutes les routes API sous le préfixe /api
 */
const { Router } = require('express');
const authRoutes = require('./auth.routes');
const folderRoutes = require('./folder.routes');
const fileRoutes = require('./file.routes');
const trashRoutes = require('./trash.routes');
const searchRoutes = require('./search.routes');
const shareRoutes = require('./share.routes');
const dashboardRoutes = require('./dashboard.routes');
const userRoutes = require('./user.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/folders', folderRoutes);
router.use('/files', fileRoutes);
router.use('/trash', trashRoutes);
router.use('/search', searchRoutes);
router.use('/share', shareRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', service: 'SUPFile API' });
});

module.exports = router;
