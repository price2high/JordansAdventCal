export type DietaryVariationKey = 'classic' | 'sculpt' | 'nourish' | 'pure';

export type RecipeCategory =
  | 'Dessert'
  | 'Edible Gift'
  | 'Breakfast'
  | 'Side'
  | 'Bread';

export interface IngredientGroup {
  label: string;
  items: string[];
}

export interface DietaryVariation {
  id: DietaryVariationKey;
  name: string;
  subtitle: string;
  ingredientGroups: IngredientGroup[];
  instructions: string[];
}

export interface HealingDrink {
  name: string;
  serves: string;
  benefits: string;
  recipe: string;
  steps: string[];
}

export interface RawDoorRecord {
  day: number;
  slug: string;
  unlockDate: string; // YYYY-MM-DD (America/Los_Angeles)
  isFinale: boolean;
  title: string;
  category: RecipeCategory;
  cardBorder: string;
  moodLine: string;
  headnote: string;
  chefNote: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  serves: number;
  photoAltText: {
    hero: string;
    close: string;
  };
  photos: {
    hero: string | null;
    close: string | null;
  };
  ingredients: IngredientGroup[];
  instructions: string[];
  dietaryVariations: Record<DietaryVariationKey, DietaryVariation>;
  healingDrink: HealingDrink;
}

export interface AdventDoorsFile {
  season: number;
  timezone: string;
  unlockTimeLocal: string;
  totalDoors: number;
  doors: RawDoorRecord[];
}

/**
 * Title-free locked door representation (§3 & §10).
 * Ensures locked doors NEVER pass recipe titles, descriptions, ingredients,
 * or image references into React props, DOM attributes, or screen readers.
 */
export interface LockedDoorView {
  kind: 'locked';
  day: number;
  unlockDate: string;
  isFinale: boolean;
  cardBorder: string;
}

export interface UnlockedDoorView extends RawDoorRecord {
  kind: 'unlocked';
}

export type SafeDoorView = LockedDoorView | UnlockedDoorView;
