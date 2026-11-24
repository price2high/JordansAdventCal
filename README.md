# Advent Calendar Recipe Website (React + Vite)

A heritage holiday Advent calendar recipe website featuring **25 doors (December 1–25, 2026)**, one recipe unlocked daily at **12:01 AM America/Los_Angeles**, pairing each dessert/bake across **four dietary editions** (`Classic`, `Sculpt`, `Nourish`, `Pure`) with a functional **healing drink**.

---

## Quick Start

```bash
npm install
npm run dev
```

Build for static deployment:

```bash
npm run build
```

Output is written to `dist/` and can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, Firebase Hosting, GitHub Pages).

---

## Single-Place Configuration & Open Items

All open items from the IDE Build Brief are isolated in single config/data files so nothing is hard-coded:

1. **Site Name, Domain & Dispatch Sender (`src/config/siteConfig.ts`)**
   - Update `siteName`, `domain`, and `siteUrl` in `SITE_CONFIG`.
   - Every header, `<title>`, email dispatch label, PDF card header, and footer updates automatically.
2. **Mailing List & n8n "Advent Daily Dispatch" (`src/config/siteConfig.ts`)**
   - Set `SITE_CONFIG.mailingListWebhookUrl` to connect both the Home signup form and the per-recipe email-gated PDF downloads to your unified mailing list / n8n webhook.
3. **Recipe Data (`public/data/advent-doors.json`)**
   - Modeled directly on the cookbook PDF (`Days 1–25`) and the §5 index.
   - To add final per-door 4:5 photography, place images in `public/images/doors/` and populate `photos.hero` and `photos.close` in `advent-doors.json`. Doors with `null` photo paths automatically render styled 4:5 tartan placeholders with the recipe's alt text.
4. **Hero & Craft Photography (`public/images/`)**
   - Drop in your Brand Cards exports at `public/images/hero-fireside.jpg` (or update paths in `SITE_CONFIG.assets` to `.webp`).
5. **Brand Deck Voice Lists (`src/config/siteConfig.ts`)**
   - Paste verbatim Card 01 (`leanInto` / `leaveOut`) and Card 07 (`sayThis` / `neverSayThis`) lists into `SITE_CONFIG.voiceGuidelines`.

---

## Pre-Launch Date Preview

By default, all unlock checks and countdowns run strictly in **America/Los_Angeles** (`00:01 AM PST`).

To test unlocked doors, the Day Preview strip, recipe pages, and the Day 25 Finale prior to December 1:
- Use the **Date Preview** buttons in the footer (`Live PT`, `Dec 1`, `Dec 12`, `Dec 25`), or
- Append `?preview=2026-12-12` to the URL.
