const { Router } = require('express');
const searchController = require('../controllers/search.controller');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(searchController.search));

module.exports = router;
