# Umulkheiri Jalo — Next.js App

Next.js 16 static site for Ikigai Alignment Coach Umulkheiri Jalo. Built with App Router, TypeScript, Tailwind CSS v4, and Supabase.

## Quick Start

```bash
npm install
cp .env.example .env.local   # Add Supabase credentials
npm run dev                   # http://localhost:3000
npm run build                 # Static export to out/
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Static export build |
| `npm run lint` | ESLint |
| `node scripts/check-content.mjs` | Check Supabase content data |
| `node scripts/migrate-uploads.mjs` | Upload local images to Supabase Storage |

## Key Architecture

- **Static export** — `output: "export"` in next.config.ts; no API routes
- **Supabase at build time** — content fetched server-side for public pages
- **Supabase at runtime** — admin panel writes via anon key + RLS
- **Admin auth** — Supabase Auth (email + password) gating the admin UI
