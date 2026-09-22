# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LAPRITEL is a full-stack e-commerce website for a handmade beaded bag brand. The catalog centers on the **Ivy Bag**, available in multiple colors (plus a curated set of custom, made-to-order colors), alongside standalone single-color bags such as **Bag Marine** and **Daisy**. The brand identity is elegant, feminine, and premium.

This project is being built from scratch — there is no existing codebase yet. Use the architecture and conventions below when scaffolding and building features.

### Design references
- Product/photography feel: craftorria.com (beaded bags, artisan quality)
- Site flow and shopping experience: staysixteen.com (announcement bar, nav, collection pages, PDP, cart, checkout)

### Brand styling
- Primary: Burgundy `#800020`
- Background: White `#FFFFFF`
- Accent (light sections): `#f5e6ea`
- Text: Near-black `#1a1a1a`
- Headings font: serif, elegant (e.g. Playfair Display)
- Body font: clean sans-serif (e.g. Inter)
- Mobile-first responsive design is required on every page.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database/Auth**: Supabase
- **Payments**: Paystack (Ghana-based; GHS + cards)
- **Image hosting**: Cloudinary or Supabase Storage

## Repository Structure

```
lapritel/
├── client/                  (React + Vite frontend)
│   ├── public/
│   ├── src/
│   │   ├── assets/          (images, fonts, icons)
│   │   ├── components/      (reusable UI: Navbar, Footer, ProductCard, etc.)
│   │   ├── pages/           (HomePage, ShopPage, ProductPage, CartPage, etc.)
│   │   ├── context/         (CartContext, AuthContext)
│   │   ├── hooks/           (custom React hooks)
│   │   ├── services/        (API call functions)
│   │   ├── utils/           (helper functions)
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
├── server/                  (Node.js + Express backend)
│   ├── controllers/         (logic for each route)
│   ├── routes/              (API route definitions)
│   ├── middleware/          (auth check, rate limiter, validation)
│   ├── models/              (Supabase table query functions)
│   ├── utils/               (paystack helpers, email sender, etc.)
│   ├── config/              (supabase client setup, env config)
│   └── index.js             (entry point)
│
├── .env                     (all secrets — never commit this)
├── .gitignore
└── README.md
```

Client and server are separate workspaces with their own `package.json`/dependencies and are run independently (e.g. Vite dev server for `client`, Node/Express for `server`).

## Pages & Features

1. **Homepage** — announcement bar, sticky nav (logo, cart icon, account icon), hero with CTA, featured Ivy Bag section, color variants showcase, brand story snippet, testimonials, Instagram-style photo strip, newsletter signup, footer.
2. **Shop/Collection Page** — grid of Ivy Bag color variants, filter by color, sort by price, quick-add from card.
3. **Product Detail Page** — image gallery, color selector that switches the displayed image, description, size/care accordion, Add to Cart, related products.
4. **Cart Page** — item list, quantity controls, subtotal, checkout CTA.
5. **Checkout Page** — customer details, delivery address, order summary, Paystack payment.
6. **Order Confirmation Page** — thank-you message, order number, order summary.
7. **Account Pages** — Register, Login, My Orders, Profile.
8. **Admin Dashboard** (protected) — orders, order status updates, product/color-variant management, customer list.
9. **About Page** — brand story, craftsmanship, values.
10. **Contact Page** — contact form, social links, WhatsApp button.

## Security Requirements (non-negotiable)

- JWT authentication via secure `httpOnly` cookies.
- Input validation and sanitization on every form, both client and server side.
- Paystack webhooks must verify the signature header before trusting payload data.
- Rate limiting on API routes.
- CORS configured explicitly (no wildcard origins in production).
- All secrets in environment variables — never hardcoded, never committed.
- Admin routes protected by auth + role-check middleware on the server, not just hidden in the UI.

## Working Conventions

- Write complete, working code — no placeholders or "add logic here" comments.
- Build one section or page at a time to stay focused; don't jump ahead to unrelated pages/features.
- After delivering a piece of work, state what the logical next step is.
- When there are multiple valid approaches, pick the best one and briefly explain why, rather than presenting an exhaustive list of options.
- Apply the security requirements above by default, without being asked each time.
- Every page must be mobile-responsive, designed mobile-first.
