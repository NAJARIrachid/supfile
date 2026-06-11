const { Router } = require('express');
const folderController = require('../controllers/folder.controller');
const validate = require('../middleware/validate.middleware');
const { createFolderSchema, updateFolderSchema } = require('../validators/folder.validator');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(authenticate);

router.get('/download/:id', asyncHandler(folderController.download));
router.get('/', asyncHandler(folderController.list));
router.post('/', validate(createFolderSchema), asyncHandler(folderController.create));
router.get('/:id', asyncHandler(folderController.getById));
router.put('/:id', validate(updateFolderSchema), asyncHandler(folderController.update));
router.delete('/:id', asyncHandler(folderController.remove));

module.exports = router;
