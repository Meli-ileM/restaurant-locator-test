# TOPOS

Application full-stack de gestion d'emplacements de restaurants, orientée qualité des données géospatiales.

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL (ou Supabase PostgreSQL)
- Une variable d'environnement `DATABASE_URL` valide côté backend

### 1) Cloner et installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2) Configurer l'environnement backend

Créer un fichier `.env` dans le dossier `backend` avec :

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
PORT=3000
```

### 3) Lancer l'application

```bash
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm run dev
```

- API backend : `http://localhost:3000/api/restaurants`
- Frontend Vite : URL affichée par `npm run dev`

## Technologies

- Frontend : Vue 3 (Composition API)
- Backend : Node.js + Express
- Base de données : PostgreSQL / Supabase
- Cartographie : Leaflet + OpenStreetMap

## Architecture rapide

- `backend/src/controllers` : règles métier et validation des entrées
- `backend/src/models` : accès SQL paramétré
- `frontend/src/views/Dashboard.vue` : orchestration UI (dashboard + carte)
- `frontend/src/components` : composants UI/layout réutilisables
- `frontend/src/api/restaurantApi.js` : couche d'accès API frontend

## Points d'attention

### Précision décimale géospatiale

Les coordonnées sont stockées en `DECIMAL` côté base pour éviter les dérives de précision liées aux flottants binaires.

- Latitude : `DECIMAL(10,8)`
- Longitude : `DECIMAL(11,8)`

Ce choix est important pour une application orientée cartographie : on conserve une précision suffisante pour des affichages et filtrages stables.

### Cas limites géographiques

Le backend valide systématiquement les bornes géodésiques :

- Latitude dans `[-90, 90]`
- Longitude dans `[-180, 180]`

Cas à tester explicitement :

- Frontières valides : `-90`, `90`, `-180`, `180`
- Dépassements invalides : `90.0001`, `-180.0001`
- Valeurs non numériques

### Qualité des données métier

- Normalisation des cuisines (accents et variantes d'écriture)
- Prévention des doublons (`name` + `address`)
- Messages d'erreur API explicites pour faciliter le diagnostic côté frontend

## API disponible

- `POST /api/restaurants`
- `GET /api/restaurants`
- `GET /api/restaurants/search?q=...`
- `GET /api/restaurants/filter?cuisine=...`

## 6. Déploiement et Infrastructure

Hébergement Backend : Déployé sur Railway (Instance Node.js). Le serveur bénéficie d'un cycle de déploiement continu (CI/CD) lié à la branche main du dépôt GitHub.

Hébergement Frontend : Déployé sur Vercel, offrant des performances optimales pour le rendu de la Single Page Application (SPA) Vue.

Base de Données : Instance PostgreSQL managée sur Supabase, garantissant la haute disponibilité et la persistance sécurisée des données avec le type DECIMAL.

Accès direct à la solution :

Application en ligne : https://restaurant-locator-test.vercel.app/
## Auteur

Melissa MEDJBER — TOPOS (test Geoptis 2026)
