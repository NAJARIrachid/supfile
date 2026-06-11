#!/bin/sh
set -e

echo "[entrypoint] Application des migrations Prisma..."
npx prisma migrate deploy

echo "[entrypoint] Demarrage de l'API..."
exec node src/server.js
