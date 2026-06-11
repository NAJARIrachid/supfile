/**
 * Point d'entrée — démarre le serveur HTTP
 */
const app = require('./app');
const config = require('./config');
const prisma = require('./config/database');

const server = app.listen(config.port, () => {
  console.log(`[SUPFile] API démarrée sur le port ${config.port} (${config.env})`);
});

async function shutdown(signal) {
  console.log(`[SUPFile] Arrêt (${signal})...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
