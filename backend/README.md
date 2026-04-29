# Route to your collage - Backend

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   - `npm install`
3. Seed the database:
   - `npm run seed`
4. Start the API:
   - `npm run dev`

## Endpoints
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/colleges` (search, filters, pagination)
- `GET /api/colleges/:id`
- `GET /api/compare?ids=...`
- `GET /api/saved`
- `POST /api/saved/colleges`
- `POST /api/saved/comparisons`
- `DELETE /api/saved/:id`
