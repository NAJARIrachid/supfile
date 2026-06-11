/**
 * Couche d'accès aux données — utilisateurs
 */
const prisma = require('../config/database');

const publicSelect = {
  id: true,
  email: true,
  avatar: true,
  provider: true,
  createdAt: true,
  updatedAt: true,
};

async function findById(id) {
  return prisma.user.findUnique({ where: { id }, select: { ...publicSelect, password: true } });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function create(data) {
  return prisma.user.create({ data });
}

async function update(id, data) {
  return prisma.user.update({ where: { id }, data });
}

module.exports = {
  findById,
  findByEmail,
  create,
  update,
  publicSelect,
};
