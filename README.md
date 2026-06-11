# SUPFile

Plateforme cloud de stockage de fichiers (projet universitaire) — concurrent simplifié de Dropbox / Google Drive.

## Stack

- **Backend** : Node.js, Express, PostgreSQL, Prisma, JWT, Docker
- **Frontend** : React 19, Vite, MUI, TanStack Query, React Router

## Démarrage rapide

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

- API : http://localhost:3000/api/health
- Frontend : http://localhost:5173

## Développement local

### Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
