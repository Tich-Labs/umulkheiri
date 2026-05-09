# Umulkheiri Jalo — Ikigai Alignment Coaching Website

Brand & website design for Umulkheiri Jalo, a certified Ikigai Alignment Coach based in Nairobi.

## Project Structure

```
├── umulkheiri-ikigai-website-design.html   # Design brief (live on GitHub Pages)
├── dashboard.html                            # Feedback dashboard (passcode-gated)
├── .nojekyll                                 # GitHub Pages config (no Jekyll)
└── README.md                                 # This file
```

## Design Brief

The design brief is a self-contained HTML document covering the full visual spec:

- Colour system ("The Garden Palette")
- Typography (Playfair Display + DM Sans)
- Page structure and hero concept
- Site architecture (7 core pages)
- Services/pricing UI
- Key features (quiz, booking, M-Pesa, etc.)
- UX flow diagrams
- UI component library

**Live URL:** `https://tich-labs.github.io/umulkheiri/`

### Feedback Mechanism

Each section of the design brief has two feedback buttons:

| Button | What it does |
|--------|-------------|
| 👍 | One-click positive reaction. Instantly logged. |
| 💡 Could Be Better | Opens a modal form pre-tagged with the section name. Client types feedback and submits. |

Feedback is stored in a **Supabase** `feedback` table with the following schema:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint (PK) | Auto-incrementing ID |
| `section` | text | Section name the feedback refers to |
| `reaction` | text | `thumbs_up` or `could_be_better` |
| `feedback` | text | Free-text feedback (only for `could_be_better`) |
| `name` | text | Optional client name |
| `email` | text | Optional client email |
| `created_at` | timestamptz | Auto-generated timestamp |

## Feedback Dashboard

A private dashboard to view all incoming feedback.

**URL:** `https://tich-labs.github.io/umulkheiri/dashboard.html`

- Passcode-gated (default: `umulkheiri2025`)
- Shows overall stats: total reactions, thumbs up, could-be-better
- Per-section cards with expandable feedback entries
- Timestamps and optional client details

## Tech Stack (Planned)

| Layer | Technology |
|-------|-----------|
| Frontend | React |
| Backend/Database | Supabase |
| Hosting | GitHub Pages (brief + dashboard) |

## Getting Started

1. **View the design brief:** Open the live URL or open `umulkheiri-ikigai-website-design.html` locally
2. **View feedback dashboard:** Open the dashboard URL, enter the passcode
3. **Check Supabase data:** Go to Supabase dashboard → Table Editor → `feedback` table

## Supabase Setup

The `feedback` table uses Row Level Security with two policies:
- `Anyone can insert feedback` — allows anonymous submissions from the design brief
- `Anyone can view feedback` — allows the dashboard to read feedback (gate is client-side)

## Deployment

The `gh-pages` branch serves the design brief and dashboard as a static site. To deploy updates:

```bash
git checkout gh-pages
git show main:umulkheiri-ikigai-website-design.html > index.html
git show main:dashboard.html > dashboard.html
git commit -m "Update"
git push origin gh-pages --force
git checkout main
```
