# SUPFile — Backend API

API REST Node.js / Express pour le stockage cloud universitaire SUPFile.

## Démarrage rapide (Docker)

```bash
# Depuis la racine SUPFile/
cp backend/.env.example backend/.env
# Éditer JWT_SECRET et variables Google si besoin

docker compose up --build
```

API : `http://localhost:3000/api/health`

## Développement local

```bash
cd backend
cp .env.example .env
# DATABASE_URL=postgresql://supfile:supfile_secret@localhost:5432/supfile

npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Routes principales

| Méthode | Route | Auth |
|---------|-------|------|
| POST | `/api/auth/register` | Non |
| POST | `/api/auth/login` | Non |
| GET | `/api/auth/google` | Non |
| GET | `/api/auth/google/callback` | Non |
| POST | `/api/folders` | JWT |
| GET | `/api/folders/:id` | JWT |
| PUT | `/api/folders/:id` | JWT |
| DELETE | `/api/folders/:id` | JWT |
| POST | `/api/files/upload` | JWT (multipart `file`) |
| GET | `/api/files/download/:id` | JWT |
| PUT | `/api/files/:id` | JWT |
| DELETE | `/api/files/:id` | JWT |
| GET | `/api/trash` | JWT |
| POST | `/api/trash/restore/:id` | JWT |
| GET | `/api/search?q=` | JWT |
| POST | `/api/share` | JWT |
| GET | `/api/share/:token` | Non |
| GET | `/api/dashboard` | JWT |
