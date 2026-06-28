# Umulkheiri Jalo — Ikigai Alignment Coaching

Brand & website for **Umulkheiri Jalo**, a certified Ikigai Alignment Coach (ID45632-28225) based in Nairobi, Kenya.

| Environment | URL |
|---|---|
| **Production** | [https://umumotherofgoodness-cpu.github.io/Ikigai-Babe/](https://umumotherofgoodness-cpu.github.io/Ikigai-Babe/) |
| **Staging** | [https://tich-labs.github.io/umulkheiri/](https://tich-labs.github.io/umulkheiri/) |
| **Admin** | `/admin/` on either environment (Supabase Auth) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Fonts | Ojuju (headings), Questrial (body) via `next/font` |
| Database | Supabase (Postgres) |
| Storage | Supabase Storage (image uploads) |
| Auth | Supabase Auth (email + password) |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
app/
├── public/                    # Static assets, handover docs
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 theme tokens
│   │   ├── layout.tsx         # Root layout (fonts, Navbar, Footer, metadata)
│   │   ├── page.tsx           # Home page (hero, pillars, ikigai elements, services, community, blog)
│   │   ├── services/          # Services page (packages, add-ons, corporate, FAQ)
│   │   ├── journal/           # Blog page + individual article pages
│   │   └── admin/             # Admin panel (password-gated Supabase Auth)
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky navbar with active link
│   │   ├── Footer.tsx         # Site footer
│   │   ├── ServiceCard.tsx    # Package card (compact & full variants)
│   │   ├── SectionHeading.tsx # Reusable section heading (font-display)
│   │   ├── TestimonialCard.tsx
│   │   ├── EmojiPicker.tsx    # Emoji palette picker for admin
│   │   └── ...
│   └── lib/
│       ├── supabase.ts        # Anon client (client-side)
│       ├── supabase-server.ts # Service-role client (build-time)
│       ├── path.ts            # Image path helper (basePath-aware)
│       └── slug.ts            # URL slugify
├── scripts/                   # Migration & utility scripts
├── next.config.ts
├── package.json
└── tailwind.config.ts
```

---

## Development

```bash
cd app
npm install
cp .env.example .env.local   # Fill in your Supabase credentials
npm run dev                   # http://localhost:3000
npm run build                 # Static export to out/
npm run lint
```

> **Note:** This app uses `output: "export"`. API routes are unavailable. Admin writes happen client-side via Supabase anon key with RLS policies.

---

## Deployment

### Workflow (`.github/workflows/deploy.yml`)

On push to `main`, GitHub Actions:
1. Checks out code
2. Installs dependencies
3. Builds with `npm run build` (injects env vars from Secrets)
4. Deploys `out/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`

### Required GitHub Secrets

| Secret | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page (anon/public key) |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page (service_role key — build-time only) |

### Required Supabase Setup

1. **RLS Policies** on `content` table — allow anon SELECT and UPDATE
2. **Storage bucket** `uploads` — public, allow anon INSERT
3. **Auth** → Providers → Email enabled
4. **Auth** → Users → Add User for admin login

---

## Contact

**Umulkheiri Jalo**
Certified Ikigai Alignment Coach · ID45632-28225

📧 [umulkheiri@yahoo.com](mailto:umulkheiri@yahoo.com)
📍 Nairobi, Kenya

---

© 2026 Umulkheiri Jalo. All rights reserved.
