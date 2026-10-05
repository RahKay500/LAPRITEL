# LAPRITEL

Full-stack e-commerce website for LAPRITEL, a handmade beaded bag brand.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (`client/`)
- **Backend**: Node.js + Express (`server/`)
- **Database/Auth**: Supabase
- **Payments**: Paystack
- **Image hosting**: Supabase Storage

## Getting Started

### Client

```bash
cd client
npm install
cp .env.example .env   # fill in VITE_PAYSTACK_PUBLIC_KEY
npm run dev
```

Runs at http://localhost:5173.

### Server

```bash
cd server
npm install
cp .env.example .env   # fill in Supabase, JWT, Paystack, email vars and PORT=5001
npm run dev
```

Runs at http://localhost:5001. `GET /api/health` returns `{ status: "ok" }` once it's up.

## Tests

```bash
cd client && npm test          # unit tests
cd client && npm run test:e2e  # browser tests (builds the site first)
cd server && npm test          # server tests
node shared/sync.mjs --check   # confirms the shared validation copies are current
```

Shared validation rules live in `shared/validation.js`. Run `node shared/sync.mjs` after editing them to refresh the copies in `client/src/shared` and `server/shared`.

## Database

Schema changes are SQL files in `supabase/migrations/`. Run each new file in the Supabase SQL editor, in order.

See `CLAUDE.md` for full architecture, page list, and security requirements.
