/**
 * Couche d'accès aux données — fichiers (métadonnées)
 */
const prisma = require('../config/database');

async function create(data) {
  return prisma.file.create({ data });
}

async function findById(id) {
  return prisma.file.findUnique({ where: { id } });
}

async function findByIdAndOwner(id, ownerId) {
  return prisma.file.findFirst({ where: { id, ownerId } });
}

async function update(id, data) {
  return prisma.file.update({ where: { id }, data });
}

async function softDelete(id) {
  return prisma.file.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

async function restore(id) {
  return prisma.file.update({
    where: { id },
    data: { deletedAt: null },
  });
}

async function hardDelete(id) {
  return prisma.file.delete({ where: { id } });
}

async function findTrashByOwner(ownerId) {
  return prisma.file.findMany({
    where: { ownerId, deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
  });
}

async function search(ownerId, query) {
  return prisma.file.findMany({
    where: {
      ownerId,
      deletedAt: null,
      name: { contains: query, mode: 'insensitive' },
    },
    take: 50,
  });
}

async function aggregateStats(ownerId) {
  const [fileCount, totalSize, trashCount] = await Promise.all([
    prisma.file.count({ where: { ownerId, deletedAt: null } }),
    prisma.file.aggregate({
      where: { ownerId, deletedAt: null },
      _sum: { size: true },
    }),
    prisma.file.count({ where: { ownerId, deletedAt: { not: null } } }),
  ]);
  return {
    fileCount,
    totalSize: totalSize._sum.size || BigInt(0),
    trashCount,
  };
}

async function findRecent(ownerId, limit = 10) {
  return prisma.file.findMany({
    where: { ownerId, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}

async function findByFolder(ownerId, folderId) {
  return prisma.file.findMany({
    where: {
      ownerId,
      deletedAt: null,
      folderId: folderId ?? null,
    },
    orderBy: { name: 'asc' },
  });
}

async function findAllActive(ownerId) {
  return prisma.file.findMany({
    where: { ownerId, deletedAt: null },
    select: { mimeType: true, size: true },
  });
}

module.exports = {
  create,
  findById,
  findByIdAndOwner,
  update,
  softDelete,
  restore,
  hardDelete,
  findTrashByOwner,
  search,
  aggregateStats,
  findRecent,
  findByFolder,
  findAllActive,
};
