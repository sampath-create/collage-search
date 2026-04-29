# Find Your Collage

Production-grade full-stack web app to help students discover colleges, explore details, compare options, and predict eligibility.

## Repo structure

- `backend/` — Express + TypeScript + MongoDB (Mongoose)
- `frontend/` — Next.js + Tailwind
- `collage_suggest/` — earlier Vite sandbox (not used by the full-stack app)

## Local development

### 1) MongoDB Atlas

- Create a free cluster
- Create a DB user and allow your IP / 0.0.0.0/0 (for testing)
- Copy the connection string as `MONGODB_URI`

### 2) Backend

```bash
cd backend
cp .env.example .env
# edit .env with your MONGODB_URI
npm install
npm run seed:dev
npm run dev
+```

Backend runs on http://localhost:4000

### 3) Frontend

```bash
cd frontend
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
npm install
npm run dev
+```

Frontend runs on http://localhost:3000

## Deployment (mandatory)

### Database: MongoDB Atlas

- Keep using the same Atlas cluster

### Backend: Render / Railway

- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Env vars:
  - `MONGODB_URI`
  - `CORS_ORIGINS=https://<your-vercel-domain>`

### Frontend: Vercel

- Root directory: `frontend/`
- Env vars:
  - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`

## API

- `GET /api/colleges`
- `GET /api/colleges/:id`
- `POST /api/compare`
- `POST /api/predict`
