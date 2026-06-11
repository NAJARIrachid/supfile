/**
 * Couche d'accès aux données — dossiers
 */
const prisma = require('../config/database');

async function create(data) {
  return prisma.folder.create({ data });
}

async function findById(id) {
  return prisma.folder.findUnique({
    where: { id },
    include: {
      children: true,
      files: { where: { deletedAt: null } },
    },
  });
}

async function findByIdAndOwner(id, ownerId) {
  return prisma.folder.findFirst({
    where: { id, ownerId },
    include: {
      children: true,
      files: { where: { deletedAt: null } },
    },
  });
}

async function update(id, data) {
  return prisma.folder.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.folder.delete({ where: { id } });
}

async function countByOwner(ownerId) {
  return prisma.folder.count({ where: { ownerId } });
}

async function findRootFolders(ownerId) {
  return prisma.folder.findMany({
    where: { ownerId, parentId: null },
    include: { children: true },
  });
}

async function findByParent(ownerId, parentId) {
  return prisma.folder.findMany({
    where: {
      ownerId,
      parentId: parentId ?? null,
    },
    orderBy: { name: 'asc' },
  });
}

async function findByIdWithFiles(id, ownerId) {
  return prisma.folder.findFirst({
    where: { id, ownerId },
    include: { files: { where: { deletedAt: null } } },
  });
}

module.exports = {
  create,
  findById,
  findByIdAndOwner,
  update,
  remove,
  countByOwner,
  findRootFolders,
  findByParent,
  findByIdWithFiles,
};
