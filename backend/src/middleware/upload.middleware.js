/**
 * Configuration Multer — stockage en mémoire puis écriture disque via fileStorage (service)
 */
const multer = require('multer');
const config = require('../config');
const AppError = require('../utils/AppError');

const maxBytes = config.upload.maxFileSizeMb * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxBytes },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname) {
      return cb(new AppError('Fichier invalide', 400, 'INVALID_FILE'));
    }
    cb(null, true);
  },
});

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          `Fichier trop volumineux (max ${config.upload.maxFileSizeMb} Mo)`,
          413,
          'FILE_TOO_LARGE'
        )
      );
    }
    return next(new AppError(err.message, 400, 'UPLOAD_ERROR'));
  }
  next(err);
}

module.exports = { upload, handleMulterError };
