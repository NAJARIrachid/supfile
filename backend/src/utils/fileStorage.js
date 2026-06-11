/**
 * Gestion du stockage physique des fichiers (hors base de données)
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const AppError = require('./AppError');

/** Assure l'existence du répertoire uploads (et sous-dossier utilisateur) */
function ensureUploadDir(userId) {
  const base = path.resolve(config.upload.dir);
  const userDir = path.join(base, userId);
  if (!fs.existsSync(base)) {
    fs.mkdirSync(base, { recursive: true });
  }
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

/** Enregistre un buffer sur disque et retourne le chemin relatif stocké en BDD */
function saveUploadedFile(userId, originalName, buffer) {
  const userDir = ensureUploadDir(userId);
  const ext = path.extname(originalName) || '';
  const storedName = `${uuidv4()}${ext}`;
  const absolutePath = path.join(userDir, storedName);
  fs.writeFileSync(absolutePath, buffer);
  return path.join(userId, storedName).replace(/\\/g, '/');
}

function getAbsolutePath(relativePath) {
  return path.join(path.resolve(config.upload.dir), relativePath);
}

function deletePhysicalFile(relativePath) {
  const absolute = getAbsolutePath(relativePath);
  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
}

function fileExists(relativePath) {
  return fs.existsSync(getAbsolutePath(relativePath));
}

function sanitizeFilename(name) {
  return name.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'fichier';
}

module.exports = {
  ensureUploadDir,
  saveUploadedFile,
  getAbsolutePath,
  deletePhysicalFile,
  fileExists,
  sanitizeFilename,
};
