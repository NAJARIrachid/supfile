/**
 * Logique métier — recherche de fichiers par nom
 */
const fileRepository = require('../repositories/file.repository');
const prisma = require('../config/database');
const { serializeFile } = require('./file.service');

async function search(ownerId, query) {
  if (!query || query.trim().length < 2) {
    return { files: [], folders: [] };
  }

  const q = query.trim();

  const [files, folders] = await Promise.all([
    fileRepository.search(ownerId, q),
    prisma.folder.findMany({
      where: {
        ownerId,
        name: { contains: q, mode: 'insensitive' },
      },
      take: 50,
    }),
  ]);

  return {
    files: files.map(serializeFile),
    folders,
  };
}

module.exports = { search };
