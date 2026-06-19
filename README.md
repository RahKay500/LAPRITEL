# LAPRITEL

Full-stack e-commerce website for LAPRITEL, a handmade beaded bag brand.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (`client/`)
- **Backend**: Node.js + Express (`server/`)
- **Database/Auth**: Supabase
- **Payments**: Paystack
- **Image hosting**: Cloudinary or Supabase Storage

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
cp .env.example .env   # fill in Supabase, JWT, Paystack, Cloudinary, email vars
npm run dev
```

Runs at http://localhost:5000. `GET /api/health` returns `{ status: "ok" }` once it's up.

See `CLAUDE.md` for full architecture, page list, and security requirements.
