# Image Node.js LTS pour l'API SUPFile
FROM node:20-alpine

WORKDIR /app

# Dépendances système minimales pour bcrypt / Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

# Répertoire uploads (monté en volume dans docker-compose)
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
EXPOSE 3000

# sed : corrige les fins de ligne CRLF (Windows) qui cassent le shebang sous Linux
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
