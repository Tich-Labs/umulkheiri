# Umulkheiri Jalo — Ikigai Alignment Coaching

Brand & website for **Umulkheiri Jalo**, a certified Ikigai Alignment Coach (ID45632-28225) based in Nairobi, Kenya.

---

## Overview

This monorepo contains two generations of the coaching website:

| Version | Location | Stack |
|---------|----------|-------|
| **Current (Next.js)** | `app/` | Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS v4 |
| **Legacy (GitHub Pages)** | Root level (`index.html`, `site.html`, etc.) | Vanilla HTML/CSS/JS + Supabase |

---

## Next.js App (`app/`)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Fonts | Playfair Display (serif), DM Sans (sans-serif) via `next/font` |
| Linting | ESLint + Prettier |

### Project Structure

```
app/
├── public/                    # Static assets (SVGs)
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 theme tokens & base styles
│   │   ├── layout.tsx         # Root layout (fonts, Navbar, Footer)
│   │   ├── page.tsx           # Home page (hero, pillars, venn, features, services, blog, newsletter)
│   │   └── services/
│   │       └── page.tsx       # Services page (packages, add-ons, corporate, FAQ, booking modal)
│   ├── components/
│   │   ├── BookingModal.tsx   # 3-step booking modal with package/add-on/payment/discount flow
│   │   ├── Button.tsx         # Reusable button/link (primary/secondary/ghost/teal variants)
│   │   ├── FeatureCard.tsx    # Feature card with icon, title, description, tags
│   │   ├── Footer.tsx         # Site footer with nav, philosophy, booking CTA
│   │   ├── Navbar.tsx         # Sticky navbar with mobile menu & booking CTA
│   │   ├── SectionHeading.tsx # Reusable section heading (label, title, description)
│   │   ├── ServiceCard.tsx    # Package card (badge, price, title, description, CTA)
│   │   └── TestimonialCard.tsx# Testimonial card with quote and attribution
│   └── lib/
│       └── utils.ts           # cn() class name utility
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── postcss.config.mjs
```

### Pages

- **`/` (Home)** — Hero section with 3 pillars (Ikigai, Ubuntu, Kihooto), SVG Ikigai Venn diagram, feature cards, service cards, testimonial, community offerings, blog preview, newsletter signup
- **`/services`** — Coaching packages (Discovery/Journey/Transformation/VIP Day), add-ons, corporate offerings, payment info, FAQ accordion, booking modal

### Design System

#### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| `deep-night` | `#1a1028` | Hero backgrounds, footer, dark cards |
| `midnight-bloom` | `#2e1a47` | Secondary dark |
| `bloom-pink` | `#f47bb4` | Primary accent, CTAs |
| `sunset-gold` | `#f5a623` | Highlights |
| `garden-teal` | `#1d9e75` | Success states, secondary accents |
| `warm-sand` | `#f5efe6` | Alt section background |
| `soft-white` | `#fdfaf7` | Primary page background |

#### Typography

- **Playfair Display** (serif) — Headings, featured text
- **DM Sans** (sans-serif) — Body copy, UI text

### Development

```bash
cd app
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

---

## Legacy Site (GitHub Pages)

The root-level files (`index.html`, `site.html`, `dashboard.html`) form the original coaching website:
- **`index.html`** — Design brief with section-level feedback buttons connected to Supabase
- **`site.html`** — 7-page vanilla JS SPA (Home, About, Services, Philosophy, Journal, Community, Contact)
- **`dashboard.html`** — Passcode-gated admin dashboard for feedback analytics
- Deployed via `gh-pages` branch at `https://tich-labs.github.io/umulkheiri/`

---

## Contact

**Umulkheiri Jalo**
Certified Ikigai Alignment Coach · ID45632-28225

📧 [umulkheiri@yahoo.com](mailto:umulkheiri@yahoo.com)
💬 [+254 140 565 335](https://wa.me/254140565335)
📍 Nairobi, Kenya

---

## License

© 2026 Umulkheiri Jalo. All rights reserved.
