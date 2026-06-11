const { Router } = require('express');
const fileController = require('../controllers/file.controller');
const validate = require('../middleware/validate.middleware');
const { updateFileSchema } = require('../validators/file.validator');
const { authenticate } = require('../middleware/auth.middleware');
const { upload, handleMulterError } = require('../middleware/upload.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(fileController.list));
router.post(
  '/upload',
  upload.single('file'),
  handleMulterError,
  asyncHandler(fileController.upload)
);

router.get('/download/:id', asyncHandler(fileController.download));
router.put('/:id', validate(updateFileSchema), asyncHandler(fileController.update));
router.delete('/:id', asyncHandler(fileController.remove));

module.exports = router;
