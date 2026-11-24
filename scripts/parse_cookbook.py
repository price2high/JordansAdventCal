#!/usr/bin/env python3
"""
Parse the extracted cookbook PDF text (sources/cookbook.txt) and merge it
with the exact §5 brief schedule metadata to produce public/data/advent-doors.json.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COOKBOOK_TXT = os.path.join(ROOT, "sources", "cookbook.txt")
OUT_JSON = os.path.join(ROOT, "public", "data", "advent-doors.json")

# Exact §5 brief index metadata (Door, Date, Title, Category, Prep, Cook, Serves)
BRIEF_INDEX = {
    1:  ("2026-12-01", "Soft-Baked Holiday Gingerbread Cookies (or Sugar Cookies)", "Dessert", 10, 25, 6),
    2:  ("2026-12-02", "Sparkling Candied Cranberries", "Edible Gift", 20, 25, 8),
    3:  ("2026-12-03", "Cinnamon Apple Chai Scones", "Breakfast", 15, 35, 4),
    4:  ("2026-12-04", "Warm Baked Stuffed Apples", "Dessert", 35, 45, 6),
    5:  ("2026-12-05", "Heirloom Holiday Apple Pie", "Dessert", 20, 35, 8),
    6:  ("2026-12-06", "Apple Pie Stuffed Cookies", "Dessert", 10, 20, 12),
    7:  ("2026-12-07", "Classic Vanilla Bean Ice Cream", "Dessert", 5, 10, 4),
    8:  ("2026-12-08", "Butter Pecan Ice Cream", "Dessert", 25, 35, 6),
    9:  ("2026-12-09", "Butter Pecan Cornbread with Whipped Pecan Praline Butter", "Side", 15, 25, 6),
    10: ("2026-12-10", "Southern Holiday Peach Cobbler", "Dessert", 20, 20, 4),
    11: ("2026-12-11", "Peach Cobbler Cookies", "Dessert", 25, 30, 8),
    12: ("2026-12-12", "Peach Cobbler Cheesecake Brownies", "Dessert", 15, 5, 16),
    13: ("2026-12-13", "Southern Banana Pudding", "Dessert", 10, 5, 4),
    14: ("2026-12-14", "Stuffed Churro Cheesecake Cookies", "Dessert", 20, 25, 8),
    15: ("2026-12-15", "Cinnamon Roll Focaccia", "Bread", 25, 50, 8),
    16: ("2026-12-16", "Sourdough Cinnamon Star Bread", "Bread", 20, 40, 4),
    17: ("2026-12-17", "Velvety Holiday Pumpkin Pie", "Dessert", 20, 12, 24),
    18: ("2026-12-18", "Mini-Pumpkin Crème Brûlée", "Dessert", 15, 10, 8),
    19: ("2026-12-19", "Soulful Sweet Potato Pie", "Dessert", 10, 10, 6),
    20: ("2026-12-20", "Velvet-Crumb Red Velvet Cake", "Dessert", 15, 15, 8),
    21: ("2026-12-21", "Decadent Dark Chocolate Cake", "Dessert", 20, 25, 8),
    22: ("2026-12-22", "Turtle Sweet Potato Pie (The Showstopper)", "Dessert", 20, 45, 6),
    23: ("2026-12-23", "Peppermint Bark Cheesecake", "Dessert", 30, 40, 8),
    24: ("2026-12-24", "Spiced Eggnog Tres Leches Cake", "Dessert", 40, 20, 10),
    25: ("2026-12-25", "Christmas Morning Sticky Toffee Cake", "Dessert", 20, 35, 10),
}

# One-line Italianno mood lines + "day + feeling + dish" headnotes (voice per §1)
EDITORIAL_VOICE = {
    1:  ("First warmth at the windowpane.",
         "Day one. December arrives quietly and the hearth takes its first real glow — soft-baked gingerbread cookies spiced deep with ginger and clove, paired with a ruby hibiscus-ginger sparkler."),
    2:  ("Frosted jewels for the winter sideboard.",
         "Day two. Crisp air outside and slow hands at the marble counter — sparkling candied cranberries rolled to a gentle frost, alongside a bright rosemary-cranberry digestive tonic."),
    3:  ("A slow morning before the house wakes.",
         "Day three. Kettle humming on the stove while frost lingers on the sill — tender cinnamon apple chai scones paired with golden turmeric-cardamom milk."),
    4:  ("Orchard warmth tucked into stoneware.",
         "Day four. The afternoon dims early and the kitchen calls for something unhurried — warm baked stuffed apples bubbling in cider, poured alongside toasted fennel and roasted cinnamon tea."),
    5:  ("An heirloom lattice, gilded and patient.",
         "Day five. Old linen aprons and wooden rolling pins come out of the pantry — heirloom holiday apple pie bubbling beneath a flaky crust, met with a warm chamomile-apple cider toddy."),
    6:  ("Pocket-sized orchard comfort.",
         "Day six. Rain taps softly against the glass while trays cool on brass racks — apple pie stuffed cookies hiding spiced fruit centers, served with a soothing ginger-lemon manuka elixir."),
    7:  ("Velvet cold against fireside amber.",
         "Day seven. Quiet luxury needs no ornament when the ingredients speak plainly — classic vanilla bean ice cream flecked with real pod, poured beside a warm peppermint-cacao nib infusion."),
    8:  ("Toasted pecans, brown butter, unhurried spoons.",
         "Day eight. The scent of pecans warming in a heavy skillet fills the hall — butter pecan ice cream with deep caramel notes, paired with a smoky roasted dandelion root espresso."),
    9:  ("Cast iron carried straight to the oak table.",
         "Day nine. Gather the chairs close around the hearth before dusk settles — butter pecan cornbread crowned with whipped pecan praline butter, steeped alongside honeybush and orange peel tea."),
    10: ("Southern warmth kept for a winter evening.",
         "Day ten. Even in mid-December, stone fruit remembers late summer sun — southern holiday peach cobbler baked golden and bubbling, balanced by chilled peach-tulsi iced tea."),
    11: ("Warm spice pressed into every thumbprint.",
         "Day eleven. A quiet afternoon meant for sharing plates across the hearth rug — peach cobbler cookies crowned in tender streusel, served with delicate white tea steeped with ginger and clove."),
    12: ("The house is quiet, the oven is warm.",
         "Day twelve. The house is quiet, the oven is warm — layered peach cobbler cheesecake brownies chilled to clean ribbons, paired with a restorative tart cherry and magnesium mocktail."),
    13: ("Layers of nostalgia in cut glass.",
         "Day thirteen. Old stories return as soon as the trifle bowl reaches the table — southern banana pudding layered thick and unhurried, poured alongside fragrant lemon balm and vanilla bean tea."),
    14: ("Crisp cinnamon edges, soft hearth centers.",
         "Day fourteen. Cold wind outside makes a cinnamon-dusted cookie tray feel like sanctuary — stuffed churro cheesecake cookies warm from parchment, paired with a steaming Ceylon cinnamon and star anise brew."),
    15: ("Dimpled dough, slow proof, quiet house.",
         "Day fifteen. Nothing anchors a December morning quite like patient bread dough — cinnamon roll focaccia pressed deep with spiced brown sugar, beside aromatic cardamom-rosewater green tea."),
    16: ("Eight braided points of winter light.",
         "Day sixteen. Flour on the dark oak board and braided dough rising unhurried — sourdough cinnamon star bread pulled warm from the oven, paired with a crisp nettle and mint morning refresher."),
    17: ("Silken spice in a gilded crust.",
         "Day seventeen. Candles lit before five o'clock and stoneware warmed on the trivet — velvety holiday pumpkin pie scented with ginger and clove, served with a spiced rooibos and nutmeg latte."),
    18: ("Amber sugar cracked with the back of a spoon.",
         "Day eighteen. A small ceremony at the end of a long winter evening — mini-pumpkin crème brûlée torched to a glass-crisp lid, brightened by a ginger-pear sparkling shrub."),
    19: ("Deep roots and velvet warmth.",
         "Day nineteen. Roasted sweet potatoes perfume the whole house long before dinner — soulful sweet potato pie baked tender and fragrant, paired with warming clove, ginger, and burdock root tea."),
    20: ("Deep claret crumb dressed in ivory.",
         "Day twenty. Velvet ribbons on the sideboard and brass catching the candlelight — velvet-crumb red velvet cake finished in whipped frosting, alongside a ruby beetroot-hibiscus heart tonic."),
    21: ("Darkest cocoa for the longest night.",
         "Day twenty-one. Winter solstice arrives with deep shadows and glowing embers — decadent dark chocolate cake layered rich and glossy, met with a grounding reishi mushroom and peppermint mocha."),
    22: ("Five layers built for the centerpiece table.",
         "Day twenty-two. Save the afternoon for craft worth lingering over — turtle sweet potato pie stacked in five showstopping layers, poured beside roasted cacao, orange peel, and ginger digestive tea."),
    23: ("Cool winter mint over velvety dark crust.",
         "Day twenty-three. Pine boughs on the mantel and snow quiet on the eaves — peppermint bark cheesecake finished with dark ganache, paired with soothing eucalyptus-mint and elderberry tea."),
    24: ("Christmas Eve, steeped in saffron and hush.",
         "Day twenty-four. The wrappings are tied and the fire burns low and steady — spiced eggnog tres leches cake chilled to silken richness, cradled with warm saffron, nutmeg, and ashwagandha milk."),
    25: ("Morning light across the gathered table.",
         "Day twenty-five. The grand finale at the heart of the lodge — Christmas morning sticky toffee cake drenched in warm amber sauce, toasted with a sparkling pomegranate, rosemary, and pine needle mocktail."),
}

DAY_WORDS = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
    "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three",
    "twenty-four", "twenty-five"
]


def clean_text(s: str) -> str:
    s = re.sub(r"\n=== PAGE \d+ ===\n?", "\n", s)
    # Fix soft hyphenated line breaks like "L-\ntheanine" -> "L-theanine" or "4–\n6" -> "4–6"
    s = re.sub(r"([A-Za-z0-9])-\n([A-Za-z0-9])", r"\1-\2", s)
    s = re.sub(r"([0-9])–\n([0-9])", r"\1–\2", s)
    return s


def split_ingredients_into_groups(raw_ing: str):
    """
    Parse labeled sub-sections inside a recipe's ingredients text
    (e.g., 'Crust: ... Filling: ... Glaze: ...') into structured groups.
    """
    text = " ".join(raw_ing.split())
    # Known sub-group labels that appear in the cookbook
    label_pattern = re.compile(
        r"(?:^|(?<=\.\s)|(?<=;\s))"
        r"(Glaze|Icing|Frosting|Ganache|Crust|Filling|Dough|Batter|Topping|Streusel|"
        r"Crumb Topping|Whipped Topping|Praline Butter|Spread|Base|Custard|Layers|"
        r"Coating|Swirl|Sponge|Soak|Cake|Toffee Sauce|Sauce|"
        r"Graham Crust|White Chocolate Cheesecake Layer|Cheesecake Layer|"
        r"Blondie/Brownie Layer|Blondie Layer|Peaches & Crumble|Peaches & Crumb|Peaches|"
        r"Pecan Praline Crust|Layer 1 \([^)]+\)|Layer 2 \([^)]+\)|Layer 3 \([^)]+\)|"
        r"Topping \([^)]+\)|No-Bake Crust|Pecan-oat crust|Almond flour crust|"
        r"Pecan-butter crust|Spelt-walnut crust):\s*"
    )

    matches = list(label_pattern.finditer(text))
    groups = []

    if not matches:
        items = split_ingredient_list(text)
        groups.append({"label": "The Bake", "items": items})
        return groups

    # Text before first matched label
    prefix = text[:matches[0].start()].strip(" .;:")
    if prefix:
        groups.append({"label": "The Bake", "items": split_ingredient_list(prefix)})

    for idx, m in enumerate(matches):
        lbl = m.group(1).strip()
        start = m.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        body = text[start:end].strip(" .;")
        if body:
            groups.append({"label": lbl, "items": split_ingredient_list(body)})

    return groups


def split_ingredient_list(chunk: str):
    """Split an ingredient string by commas/semicolons while preserving parenthetical notes."""
    items = []
    buf = []
    depth = 0
    for ch in chunk:
        if ch == "(":
            depth += 1
            buf.append(ch)
        elif ch == ")":
            depth = max(0, depth - 1)
            buf.append(ch)
        elif ch in (",", ";") and depth == 0:
            item = "".join(buf).strip(" .")
            if item:
                items.append(item)
            buf = []
        else:
            buf.append(ch)
    tail = "".join(buf).strip(" .")
    if tail:
        items.append(tail)
    return items


def split_method_into_steps(raw_method: str):
    """Split a method paragraph into clean numbered instruction sentences."""
    text = " ".join(raw_method.split()).strip()
    if not text:
        return []
    # Split on sentence boundaries (period followed by space and uppercase or opening paren)
    parts = re.split(r"(?<=\.)\s+(?=[A-Z(])", text)
    steps = [p.strip() for p in parts if p.strip()]
    return steps


def parse_variation_block(block: str):
    """
    Parse a single variation block (1. The Classic, 2. The Sculpt, etc.)
    handling both standard 'Ingredients: ... Method: ...' and multi-layer
    formats (Days 12 & 22).
    """
    # Split bullet items marked by '●'
    bullets = [b.strip() for b in block.split("●") if b.strip()]
    if not bullets:
        return {"ingredientGroups": [], "instructions": []}

    # First bullet may actually be the variation header line if split before ●
    # Remove leading header if it doesn't contain ':'
    content_bullets = bullets

    ing_groups = []
    method_texts = []

    for b in content_bullets:
        flat = " ".join(b.split())
        if flat.startswith("Ingredients:"):
            raw_ing = flat[len("Ingredients:"):].strip()
            ing_groups.extend(split_ingredients_into_groups(raw_ing))
        elif flat.startswith("Method:") or flat.startswith("Assembly:"):
            lbl_len = len("Method:") if flat.startswith("Method:") else len("Assembly:")
            method_texts.append(flat[lbl_len:].strip())
        else:
            # Multi-layer cards (Day 12, Day 22): each bullet is a named layer with ingredients & inline step!
            m = re.match(r"^([^:]{2,48}):\s*(.+)$", flat)
            if m:
                layer_label = m.group(1).strip()
                layer_body = m.group(2).strip()
                # Check if layer body ends with an instruction sentence (e.g., "Press into 9x13 pan...")
                sent_split = re.split(
                    r"(?<=\.)\s+(?=(?:Press|Spread|Pour|Pipe|Bake|Freeze|Chill|Layer|Assemble|Simmer|Whisk|Blend)\b)",
                    layer_body
                )
                ing_part = sent_split[0].strip()
                ing_groups.append({
                    "label": layer_label,
                    "items": split_ingredient_list(ing_part)
                })
                if len(sent_split) > 1:
                    method_texts.append(f"{layer_label}: " + " ".join(sent_split[1:]).strip())
            else:
                method_texts.append(flat)

    instructions = []
    for mt in method_texts:
        instructions.extend(split_method_into_steps(mt))

    # For multi-layer showstopper recipes (e.g. Day 22) where layer bullets embed
    # both components and brief directions without a trailing Method bullet,
    # preserve the 5-layer assembly sequence cleanly from the cookbook layers.
    if len(instructions) < 2 and len(ing_groups) >= 3:
        layer_steps = []
        for grp in ing_groups:
            joined = ", ".join(grp["items"])
            layer_steps.append(f"Prepare {grp['label']}: {joined}.")
        if instructions:
            layer_steps.extend(instructions)
        instructions = layer_steps

    return {
        "ingredientGroups": ing_groups,
        "instructions": instructions,
    }


def main():
    with open(COOKBOOK_TXT, "r", encoding="utf-8") as f:
        raw = clean_text(f.read())

    # Split into DAY 01 .. DAY 25 blocks
    day_splits = list(re.finditer(r"(?m)^DAY\s+(\d{2}):\s*(.+)$", raw))
    assert len(day_splits) == 25, f"Expected 25 days, found {len(day_splits)}"

    doors = []
    for i, m in enumerate(day_splits):
        day_num = int(m.group(1))
        start = m.start()
        end = day_splits[i + 1].start() if i + 1 < len(day_splits) else len(raw)
        section = raw[start:end].strip()

        unlock_date, brief_title, category, prep_min, cook_min, serves = BRIEF_INDEX[day_num]
        mood_line, headnote = EDITORIAL_VOICE[day_num]

        # Extract Card Border & Paired Healing Drink from header
        border_m = re.search(r"Card Border:\s*([^|]+?)\s*\|\s*Paired Healing Drink:\s*(.+?)(?=\n(?:\(|1\.\s+The Classic))", section, re.S)
        card_border = " ".join(border_m.group(1).split()) if border_m else "Royal Stewart Plaid"
        paired_drink_name = " ".join(border_m.group(2).split()) if border_m else ""

        # Optional tip/architecture note between header and "1. The Classic"
        note_m = re.search(r"\n(\([^)]+\))\s*\n1\.\s+The Classic", section, re.S)
        chef_note = " ".join(note_m.group(1).strip("()").split()) if note_m else None

        # Locate the 4 variations + Healing Pairing
        v1_m = re.search(r"(?m)^1\.\s+The Classic[^\n]*$", section)
        v2_m = re.search(r"(?m)^2\.\s+The Sculpt[^\n]*$", section)
        v3_m = re.search(r"(?m)^3\.\s+The Nourish[^\n]*$", section)
        v4_m = re.search(r"(?m)^4\.\s+The Pure[^\n]*$", section)
        hp_m = re.search(r"(?m)^Healing Pairing:\s*(.+)$", section)

        assert all([v1_m, v2_m, v3_m, v4_m, hp_m]), f"Missing section in Day {day_num}"

        v1_block = section[v1_m.end():v2_m.start()]
        v2_block = section[v2_m.end():v3_m.start()]
        v3_block = section[v3_m.end():v4_m.start()]
        v4_block = section[v4_m.end():hp_m.start()]
        hp_block = section[hp_m.start():]

        classic_parsed = parse_variation_block(v1_block)
        sculpt_parsed = parse_variation_block(v2_block)
        nourish_parsed = parse_variation_block(v3_block)
        pure_parsed = parse_variation_block(v4_block)

        # Parse Healing Pairing
        hp_bullets = [b.strip() for b in hp_block.split("●") if b.strip()]
        hp_title_line = " ".join(hp_bullets[0].replace("Healing Pairing:", "").split())
        drink_name = hp_title_line or paired_drink_name
        drink_benefits = ""
        drink_recipe = ""
        drink_serves = "Serves 2"

        for b in hp_bullets[1:]:
            flat = " ".join(b.split())
            if flat.startswith("Benefits:"):
                drink_benefits = flat[len("Benefits:"):].strip()
            elif flat.startswith("Recipe"):
                sm = re.match(r"Recipe\s*\(([^)]+)\):\s*(.+)", flat)
                if sm:
                    drink_serves = sm.group(1).strip()
                    drink_recipe = sm.group(2).strip()
                else:
                    drink_recipe = re.sub(r"^Recipe:\s*", "", flat).strip()

        drink_steps = split_method_into_steps(drink_recipe)

        # Slug for clean URLs & PDF filenames
        slug = re.sub(r"[^a-z0-9]+", "-", brief_title.lower()).strip("-")

        # Photo alt text grounded in the recipe & "same house" heritage rules
        hero_alt = (
            f"Overhead heritage still life of {brief_title} served on dark stoneware over "
            f"aged dark oak with antique brass utensils and {drink_name} in cut-crystal glassware, "
            f"warm directional fireside light."
        )
        close_alt = (
            f"Close-up 4:5 editorial detail of {brief_title} showing crumb and finish beside "
            f"a brass spoon on dark stone and folded tartan wool."
        )

        door_obj = {
            "day": day_num,
            "slug": slug,
            "unlockDate": unlock_date,
            "isFinale": day_num == 25,
            "title": brief_title,
            "category": category,
            "cardBorder": card_border,
            "moodLine": mood_line,
            "headnote": headnote,
            "chefNote": chef_note,
            "prepTimeMinutes": prep_min,
            "cookTimeMinutes": cook_min,
            "serves": serves,
            "photoAltText": {
                "hero": hero_alt,
                "close": close_alt,
            },
            # Per §7: per-door photos are not final; leave null to render styled tartan placeholders
            "photos": {
                "hero": None,
                "close": None,
            },
            # Default ingredients & instructions mirror Classic; UI switches dynamically per variation
            "ingredients": classic_parsed["ingredientGroups"],
            "instructions": classic_parsed["instructions"],
            "dietaryVariations": {
                "classic": {
                    "id": "classic",
                    "name": "The Classic",
                    "subtitle": "Traditional holiday indulgence with real butter, cream, and classic sugars.",
                    "ingredientGroups": classic_parsed["ingredientGroups"],
                    "instructions": classic_parsed["instructions"],
                },
                "sculpt": {
                    "id": "sculpt",
                    "name": "The Sculpt",
                    "subtitle": "High-protein, lower-calorie, blood-sugar friendly (Greek yogurt, almond/oat flour, monk fruit/allulose).",
                    "ingredientGroups": sculpt_parsed["ingredientGroups"],
                    "instructions": sculpt_parsed["instructions"],
                },
                "nourish": {
                    "id": "nourish",
                    "name": "The Nourish",
                    "subtitle": "Calorie- and nutrient-dense whole foods (grass-fed butter/ghee, nut butters, full-fat coconut milk, dates, maple syrup, hemp hearts, collagen).",
                    "ingredientGroups": nourish_parsed["ingredientGroups"],
                    "instructions": nourish_parsed["instructions"],
                },
                "pure": {
                    "id": "pure",
                    "name": "The Pure",
                    "subtitle": "Plant-based and alkaline-aligned (spelt/kamut/chickpea flour, date sugar/agave, sea moss gel, walnut/hemp milk, Ceylon cinnamon, ginger).",
                    "ingredientGroups": pure_parsed["ingredientGroups"],
                    "instructions": pure_parsed["instructions"],
                },
            },
            "healingDrink": {
                "name": drink_name,
                "serves": drink_serves,
                "benefits": drink_benefits,
                "recipe": drink_recipe,
                "steps": drink_steps,
            },
        }
        doors.append(door_obj)

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(
            {
                "season": 2026,
                "timezone": "America/Los_Angeles",
                "unlockTimeLocal": "00:01",
                "totalDoors": 25,
                "doors": doors,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    print(f"Wrote {len(doors)} doors to {OUT_JSON}")
    for d in doors:
        v_counts = [
            f"{k}:{sum(len(g['items']) for g in d['dietaryVariations'][k]['ingredientGroups'])}i/{len(d['dietaryVariations'][k]['instructions'])}s"
            for k in ("classic", "sculpt", "nourish", "pure")
        ]
        print(f"Day {d['day']:02d} | {d['unlockDate']} | {d['category']:11s} | {d['title'][:36]:36s} | {', '.join(v_counts)} | Drink: {d['healingDrink']['name'][:28]}")


if __name__ == "__main__":
    main()
