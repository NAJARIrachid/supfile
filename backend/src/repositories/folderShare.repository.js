/**
 * Couche d'accès aux données — partage de dossier entre utilisateurs
 */
const prisma = require('../config/database');

async function create(data) {
  return prisma.folderShare.create({
    data,
    include: { folder: true, targetUser: { select: { id: true, email: true, avatar: true } } },
  });
}

async function findByFolderAndTarget(folderId, targetUserId) {
  return prisma.folderShare.findUnique({
    where: { folderId_targetUserId: { folderId, targetUserId } },
  });
}

async function listSharedWithUser(targetUserId) {
  return prisma.folderShare.findMany({
    where: { targetUserId },
    include: { folder: true, owner: { select: { id: true, email: true } } },
  });
}

module.exports = { create, findByFolderAndTarget, listSharedWithUser };
