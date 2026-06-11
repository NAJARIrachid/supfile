const { Router } = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validators/user.validator');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(authenticate);
router.patch('/me', validate(updateProfileSchema), asyncHandler(userController.updateMe));

module.exports = router;
