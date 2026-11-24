# Advent Recipe Website — IDE Build Brief

Build a cozy holiday Advent calendar recipe website: **25 doors, December 1–25, 2026**, one recipe revealed per day. Each day pairs a holiday dessert/bake with a healing drink. All recipes are **100% Vegan & Halal verified**. Launch: **December 1, 2026, 12:01 AM EST** (Door 1 unlocks at 00:01 America/New_York).

This brief is the source of truth. Brand values below are transcribed from the project's Brand Cards deck. Recipe content comes from the cookbook PDF and the tracker export listed under **Content Sources** — do not invent recipes, names, or photo links.

---

## 1. Brand

**Essence:** Gathered, heritage, unhurried.
**Hero line:** "Cozy Holiday, Done Properly."
**Direction:** Ralph Lauren cozy holiday — plaid, rich, warm luxury. Heritage lodge, not overtly Christmas-themed: no Santa/cartoon/red-and-green-cliché styling.

### Color palette (use in a 60 / 25 / 15 ratio)

| Color | Hex | Role |
|---|---|---|
| Hunter | `#1E3327` | Primary — dominant ground (60%) |
| Ivory Wool | `#F7F1E3` | Light ground / text on dark |
| Antique Brass | `#B08D4F` | Accent metal — rules, numbers, details (15%) |
| Claret | `#5E2129` | Secondary accent (25% band with Hunter) |
| Midnight Navy | `#1C2A3A` | Depth / alternate ground |
| Chestnut | `#6B3F2A` | Warm wood tone / secondary text accent |

### Typography

- **Display:** Cormorant Garamond
- **Accent:** Italianno (or italic serif) — one line per page, never more
- **Body:** Jost

### Tartan

Three tartan colorways exist in the brand deck; **Hunter is the primary/recommended** colorway. Tartan is the locked-door texture and a recurring band/texture element — not a full-page background.

### Photography — "same house" rules

Every photo should look like it was shot in the same house:

- Warm side light
- Dark wood and stone surfaces
- Props: brass, stoneware, wooden spoons
- Per recipe: one hero overhead shot + one close shot
- Vertical 4:5 ratio confirmed for recipe photography

### Naming — NOT locked (open item)

No site name has been chosen. The brand deck offers three options, with the first flagged recommended:

1. **The Fireside Advent** — recommended in the deck
2. Tartan & Thyme
3. The Lodge Table

Implement the site name and domain as a single config value so it can be swapped in one place when chosen. Do not hard-code any of the three as final.

### Voice

- Recipe intros follow the template: **day + feeling + dish** (e.g., "Day twelve. The house is quiet, the oven is warm — …").
- The brand deck's Card 07 carries the full say-this / never-say-this lists, and Card 01 carries the lean-into / leave-out lists. **Copy those lists verbatim from the Brand Cards deck** — they are not reproduced here.

---

## 2. Site Structure

1. **Home**
   - Hero (fireside imagery, hero line, one accent-italic line)
   - Countdown / "today's door" state
   - The 25-door Advent grid (below)
   - Email signup (feeds the daily dispatch list — see §6)
   - About note (short, voice per §1)
   - Footer
2. **Recipe page** (one per door, template in §4)
3. No other pages are in scope for launch.

## 3. Advent Grid Behavior

- 25 doors, numbered 1–25, one per December date (Door *n* unlocks December *n*).
- **Locked state** (date not reached): tartan face with the door number in Antique Brass. No recipe title or image visible.
- **Unlocked state**: the door reveals the dish (photo + title). Once unlocked, a door stays open for the rest of the season.
- Unlock moment: **00:01 AM America/New_York** on the door's date. All date logic in America/New_York regardless of visitor timezone.
- Clicking an unlocked door goes to that day's recipe page. Clicking a locked door does nothing (a gentle "opens Dec *n*" hint is fine).

## 4. Recipe Page Template

Fields per door (all present in the content sources):

- Day number + unlock date
- Mood line (the Italianno accent line for the page)
- Category (Dessert / Edible Gift / Breakfast / Side / Bread)
- Title
- Headnote (short intro, voice per §1 — includes the day's healing-drink pairing)
- Prep time, cook time, servings
- Ingredients (grouped: the bake, any glaze/filling, and the drink)
- Instructions (numbered)
- **Dietary variations** — every recipe carries four variations, shown as a switchable set:
  - **Classic** · **Sculpt** · **Nourish** · **Pure**
- Photo (hero overhead + close shot, with the alt text from the content source)
- **Email-gated PDF download**: the visitor enters an email to receive/download that recipe's PDF. The gate is a launch requirement — do not make PDFs directly downloadable without it.

## 5. Content — the 25 Doors

Full recipe text (ingredients, instructions, variations, headnotes, photo alt text) lives in the content sources. Index:

| Door | Date | Title | Category | Prep | Cook | Serves |
|---|---|---|---|---|---|---|
| 1 | Dec 1 | Soft-Baked Holiday Gingerbread Cookies (or Sugar Cookies) | Dessert | 10 | 25 | 6 |
| 2 | Dec 2 | Sparkling Candied Cranberries | Edible Gift | 20 | 25 | 8 |
| 3 | Dec 3 | Cinnamon Apple Chai Scones | Breakfast | 15 | 35 | 4 |
| 4 | Dec 4 | Warm Baked Stuffed Apples | Dessert | 35 | 45 | 6 |
| 5 | Dec 5 | Heirloom Holiday Apple Pie | Dessert | 20 | 35 | 8 |
| 6 | Dec 6 | Apple Pie Stuffed Cookies | Dessert | 10 | 20 | 12 |
| 7 | Dec 7 | Classic Vanilla Bean Ice Cream | Dessert | 5 | 10 | 4 |
| 8 | Dec 8 | Butter Pecan Ice Cream | Dessert | 25 | 35 | 6 |
| 9 | Dec 9 | Butter Pecan Cornbread with Whipped Pecan Praline Butter | Side | 15 | 25 | 6 |
| 10 | Dec 10 | Southern Holiday Peach Cobbler | Dessert | 20 | 20 | 4 |
| 11 | Dec 11 | Peach Cobbler Cookies | Dessert | 25 | 30 | 8 |
| 12 | Dec 12 | Peach Cobbler Cheesecake Brownies | Dessert | 15 | 5 | 16 |
| 13 | Dec 13 | Southern Banana Pudding | Dessert | 10 | 5 | 4 |
| 14 | Dec 14 | Stuffed Churro Cheesecake Cookies | Dessert | 20 | 25 | 8 |
| 15 | Dec 15 | Cinnamon Roll Focaccia | Bread | 25 | 50 | 8 |
| 16 | Dec 16 | Sourdough Cinnamon Star Bread | Bread | 20 | 40 | 4 |
| 17 | Dec 17 | Velvety Holiday Pumpkin Pie | Dessert | 20 | 12 | 24 |
| 18 | Dec 18 | Mini-Pumpkin Crème Brûlée | Dessert | 15 | 10 | 8 |
| 19 | Dec 19 | Soulful Sweet Potato Pie | Dessert | 10 | 10 | 6 |
| 20 | Dec 20 | Velvet-Crumb Red Velvet Cake | Dessert | 15 | 15 | 8 |
| 21 | Dec 21 | Decadent Dark Chocolate Cake | Dessert | 20 | 25 | 8 |
| 22 | Dec 22 | Turtle Sweet Potato Pie (The Showstopper) | Dessert | 20 | 45 | 6 |
| 23 | Dec 23 | Peppermint Bark Cheesecake | Dessert | 30 | 40 | 8 |
| 24 | Dec 24 | Spiced Eggnog Tres Leches Cake | Dessert | 40 | 20 | 10 |
| 25 | Dec 25 | Christmas Morning Sticky Toffee Cake | Dessert | 20 | 35 | 10 |

Times in minutes. Door 25 (Dec 25) is the finale — give it the fullest treatment.

### Content sources

- **Cookbook PDF:** `Holiday_Dessert___Healing_Drink_Advent_Calendar_Cookbook__Days_1_25.pdf` (34 pages, Days 1–25) — the full recipe text.
- **Structured export:** `advent-doors.json` (same project folder) — per-door fields matching §4, including `dietaryVariations` (classic/sculpt/nourish/pure), `ingredients`, `instructions`, `photoAltText`, `unlockDate`. Model the site's door data on this schema.
- **Tracker (live source):** Google Sheet `1JgYwCUUQofHoS7ZSNnlPrj8bWofQHa3D4WWG8PMOw`, "Advent Content Database" tab, rows 8–32 = Doors 1–25.

> Note: the Brand Cards deck was built earlier at 24 doors with placeholder specimen recipes (its Card 08 says so). **This brief supersedes it: 25 doors, real recipes from the sources above.** The deck's specimen titles (mulled cider, roast chicken, etc.) are layout samples — do not use them as content.

## 6. Email & Daily Dispatch

- The site captures emails two ways: the signup form (§2) and the per-recipe PDF gate (§4). Both feed one mailing list.
- A daily email goes out each morning Dec 1–25 featuring that day's unlocked recipe. This is sent by an existing n8n workflow, **"Advent Daily Dispatch"** (built, currently inactive). The site's job is clean list capture; the workflow reads the tracker and sends. Leave a config placeholder for the site URL and sender name (sender name = the site name, pending §1 naming).

## 7. Assets

From the Brand Cards deck (reference/hero use):

- `hero-fireside.webp` — hero image
- `detail-cider.webp` — photography example (drink detail)
- `detail-bake.webp` — photography example (bake detail)

Per-door recipe photos are **not final** (photo briefs exist in the tracker; a few briefs name different dishes than the final recipes — reconcile before use). Build with the alt text from the content source and a tartan placeholder in the deck's style where a photo is missing.

## 8. Interactions to Reproduce

From the brand deck — carry these behaviors into the site where they fit:

- Palette swatches copy their hex on click (brand/deck context; optional on the site itself)
- Tartan switcher previewing the three colorways (Hunter default)
- Day preview pattern: selecting a day swaps number, mood, category, title, description, time, serves — this is the model for the grid → recipe-page relationship

## 9. Open Items — Do Not Invent

- **Site name & domain:** not chosen (see §1). Config placeholder only.
- **Recipe photos:** pending; briefs need reconciling (§7).
- **Voice say/never + lean-into/leave-out lists:** copy verbatim from Brand Cards Cards 01 and 07.
- **Mailing list provider hookup** for the dispatch workflow: recipients source to be connected before Dec 1.

## 10. Tech Notes

- Static-first build is fine; door data as a single JSON file modeled on `advent-doors.json`.
- All unlock/date logic in **America/New_York**.
- Fully responsive; the grid must work one-handed on a phone.
- Accessibility: locked doors must not expose recipe content to screen readers or page source beyond the title-free locked state.
