/**
 * Couche d'accès aux données — liens de partage publics
 */
const prisma = require('../config/database');

async function create(data) {
  return prisma.shareLink.create({
    data,
    include: { file: true, folder: true },
  });
}

async function findByToken(token) {
  return prisma.shareLink.findUnique({
    where: { token },
    include: {
      file: true,
      folder: { include: { files: { where: { deletedAt: null } } } },
    },
  });
}

async function remove(id) {
  return prisma.shareLink.delete({ where: { id } });
}

module.exports = { create, findByToken, remove };
