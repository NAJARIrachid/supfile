const { Router } = require('express');
const shareController = require('../controllers/share.controller');
const validate = require('../middleware/validate.middleware');
const { createShareSchema } = require('../validators/share.validator');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.post('/', authenticate, validate(createShareSchema), asyncHandler(shareController.create));

// Accès public via token (mot de passe optionnel en query)
router.get('/:token', asyncHandler(shareController.getByToken));

module.exports = router;
