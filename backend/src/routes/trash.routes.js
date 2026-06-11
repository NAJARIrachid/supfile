const { Router } = require('express');
const trashController = require('../controllers/trash.controller');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(trashController.list));
router.post('/restore/:id', asyncHandler(trashController.restore));

module.exports = router;
