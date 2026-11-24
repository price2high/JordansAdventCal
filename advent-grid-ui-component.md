# Advent Grid UI Component — Mockdown

Standalone component spec for the Advent calendar grid. Drop this file in the project folder next to the main IDE brief (`advent-website-ide-brief.md`); brand tokens and content data are defined there and summarized here.

---

## 1. Purpose

The grid is the site's centerpiece: **25 gifts, one per December day (Dec 1–25, 2026)**. Each day is wrapped like a present. When its day arrives, the visitor unwraps the gift to reveal that day's recipe.

## 2. Layout

- **5×5 grid** — 25 tiles, perfect square.
- Numbers run **sequential, 1 → 25 in reading order** (top-left = 1, bottom-right = 25). No scattered arrangement.
- Framing: a Hunter tartan band around the grid; tiles sit on the Ivory Wool ground (`#F7F1E3`).
- Responsive: the 5×5 must hold on a phone without endless scrolling — tiles shrink, grid stays 5 across. Gutters tighten on small screens; the gift tag number stays legible at the smallest tile size.

## 3. Anatomy of a Gift Tile

Each tile is a wrapped present:

- **Wrapping paper:** Hunter tartan (`#1E3327` base colorway)
- **Ribbon & bow:** Antique Brass (`#B08D4F`), cross ribbon with a bow at top-center
- **Gift tag:** small Ivory Wool tag tied to the ribbon, carrying the door number in Cormorant Garamond
- **Beneath the wrap (hidden until unwrapped):** the dish photo (4:5), with the recipe title beneath it in Jost

## 4. States

| State | When | Appearance | Interaction |
|---|---|---|---|
| **Locked** | Before the door's date | Wrapped gift, still | Click → soft hint: "Opens Dec *n*". Cannot be unwrapped early |
| **Today** | On the door's date, not yet unwrapped | Wrapped gift + brass glow ring + "Unwrap today" tag | Click → plays the unwrap animation |
| **Unwrapped** | After unwrapping (stays for the season) | Paper opened, dish photo + title visible | Click → recipe page for that day |
| **Finale (Door 25)** | Dec 25 | Gold wrapping paper and ribbon, slightly larger presence | Same as Today/Unwrapped, elevated treatment |

Past days that were never unwrapped stay available: any door whose date has passed can be unwrapped at any later visit.

## 5. Unwrap Animation (the signature interaction)

- **Trigger:** click/tap on a gift whose date has arrived.
- **Sequence (~1s, ease):**
  1. Bow loosens, ribbon slides off the tile
  2. Wrapping paper folds/tears back from the center outward
  3. Dish photo is revealed underneath; title fades in beneath
- **One-time:** the gift unwraps once per visitor and stays unwrapped (persist in local storage so a returning visitor sees their opened gifts open).
- **Materials only:** paper and ribbon. No confetti, snow, sparkles, or sound. Heritage, not Hallmark.
- **Reduced motion:** visitors with `prefers-reduced-motion` get a simple fade/crossfade reveal instead — no paper movement.

## 6. Date & Unlock Logic

- Door *n* unlocks **December *n* at 00:01 AM America/New_York**.
- All date comparisons in America/New_York, regardless of the visitor's timezone.
- Locked gifts must not leak content: no recipe title, image, or alt text in the DOM/page source for a still-wrapped gift — only the door number and "Opens Dec *n*".

## 7. Copy

- Locked hint: **"Opens Dec *n*"**
- Today's tag: **"Unwrap today"**
- Section header above the grid (from the main brief's voice): one Italianno accent line maximum on the page.

## 8. Data the Component Consumes

One entry per door, modeled on `advent-doors.json`:

```json
{
  "door": 1,
  "unlockDate": "2026-12-01",
  "title": "Soft-Baked Holiday Gingerbread Cookies (or Sugar Cookies)",
  "category": "Dessert",
  "photoAltText": "…",
  "photoSrc": null
}
```

- `photoSrc` may be null (photos pending) — render the unwrapped state with a styled tartan placeholder + alt text until real photos land.
- The component derives state (locked / today / unwrapped-eligible) from `unlockDate` vs. today in America/New_York; it does not store unlock state itself. Only the *visitor's unwrapped set* persists (local storage).

## 9. Accessibility

- Each tile is a real button/link with an accessible label: "Day 12 — opens December 12" (locked) or "Day 12 — [recipe title]" (unwrapped).
- Keyboard: full grid navigable by tab; Enter/Space triggers unwrap or navigation.
- The unwrap animation is decorative — the state change (revealed title + link) is announced to screen readers.
- Brass on Hunter must meet contrast for the tag number at small sizes; if it fails, the tag is Ivory Wool with Hunter numerals (the tag is already Ivory — keep numerals Hunter on the tag).

## 10. Out of Scope for This Component

- Recipe page content (see the main brief, §4)
- Email capture and the PDF gate (main brief, §§4/6)
- Countdown timer (home hero, not the grid)
