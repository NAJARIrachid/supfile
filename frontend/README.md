# SUPFile — Frontend

React 19 + Vite + MUI

## Développement

```bash
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173

Assurez-vous que le backend tourne sur http://localhost:3000 (CORS `http://localhost:5173`).

## Build Docker

Depuis la racine SUPFile :

```bash
docker compose up --build
```

Frontend : http://localhost:5173 (nginx, port mappé)

## Fonctionnalités

- Authentification JWT (login, register, OAuth callback)
- Explorateur fichiers (grille / liste, dossiers, upload drag & drop)
- Prévisualisation (images, PDF, texte, audio, vidéo)
- Recherche globale avec filtres
- Partage par lien (+ page publique `/share/:token`)
- Dashboard (quota 15 Go, graphique Recharts)
- Corbeille et restauration
- Paramètres (profil, thème clair/sombre)

**Rebuild backend** après mise à jour API : `docker compose up --build`
