/**
 * Single source of truth for site identity, brand palette, and dispatch config.
 *
 * OPEN ITEM (§1 & §9): Site name & domain are not locked yet.
 * Swap `siteName` and `domain` here — every component, page title, email dispatch
 * label, and exported PDF header reads from this single config object.
 *
 * Brand Deck candidates:
 *  1. "The Fireside Advent" (recommended in Brand Cards deck)
 *  2. "Tartan & Thyme"
 *  3. "The Lodge Table"
 */

export type TartanColorway = 'hunter' | 'claret' | 'navy';

export interface PaletteSwatch {
  name: string;
  hex: string;
  role: string;
  ratio?: string;
}

export const SITE_CONFIG = {
  /** Swap in one place once final naming is locked (§1 & §9). */
  siteName: 'The Fireside Advent',
  /** Candidate names from the Brand Cards deck (for reference only). */
  candidateNames: [
    'The Fireside Advent',
    'Tartan & Thyme',
    'The Lodge Table',
  ] as const,
  /** Config placeholder — update before Dec 1 launch (§6 & §9). */
  domain: 'example-advent-domain.com',
  siteUrl: 'https://houseofjnb.com',
  /** Daily Dispatch sender name mirrors siteName per §6. */
  get senderName(): string {
    return this.siteName;
  },

  /** Brand essentials (§1) */
  essence: 'Gathered, heritage, unhurried.',
  heroLine: 'Cozy Holiday, Done Properly.',
  /** Strictly ONE Italianno accent line on the Home page (§1). */
  homeAccentLine: 'Twenty-five unhurried evenings by the hearth.',
  dietaryBadge: '100% Vegan & Halal Verified',
  seasonYear: 2026,
  timezone: 'America/Los_Angeles',
  launchIsoET: '2026-12-01T00:01:00-08:00',

  /**
   * Mailing list & n8n "Advent Daily Dispatch" integration (§6 & §9).
   * Connect your list provider or n8n webhook URL before Dec 1.
   * When empty, captures are persisted locally in the browser for review.
   */
  mailingListWebhookUrl: 'https://script.google.com/macros/s/AKfycbxpjxuY7ty8EZorAwPSkzr4ObNT6lB0mWYim64BaDzzBSdSw7O-oHzQz9OQ7WQ-kr1L5g/exec',
  dispatchWorkflowName: 'Advent Daily Dispatch',

  /**
   * Drop-in paths for Brand Cards editorial photography (§7).
   * Replace files in /public/images/ with final .webp exports whenever ready.
   */
  assets: {
    heroImage: '/images/hero-fireside.jpg',
    detailBakeImage: '/images/detail-bake.jpg',
    detailDrinkImage: '/images/detail-cider.jpg',
  },

  /**
   * Brand palette in 60 / 25 / 15 ratio (§1).
   * Swatches copy their hex value on click (§8).
   */
  palette: [
    { name: 'Hunter', hex: '#1E3327', role: 'Primary ground', ratio: '60%' },
    { name: 'Claret', hex: '#5E2129', role: 'Secondary accent', ratio: '25%' },
    { name: 'Antique Brass', hex: '#B08D4F', role: 'Accent metal & numbers', ratio: '15%' },
    { name: 'Ivory Wool', hex: '#F7F1E3', role: 'Light ground & type' },
    { name: 'Midnight Navy', hex: '#1C2A3A', role: 'Depth & alternate ground' },
    { name: 'Chestnut', hex: '#6B3F2A', role: 'Warm wood & secondary text' },
  ] as PaletteSwatch[],

  /**
   * Three tartan colorways from the brand deck (§1 & §8).
   * Hunter is primary / default.
   */
  tartanColorways: [
    { id: 'hunter' as TartanColorway, label: 'Hunter', swatch: '#1E3327', note: 'Primary' },
    { id: 'claret' as TartanColorway, label: 'Claret', swatch: '#5E2129', note: 'Royal Stewart' },
    { id: 'navy' as TartanColorway, label: 'Midnight Navy', swatch: '#1C2A3A', note: 'Black Watch' },
  ],

  /**
   * OPEN ITEM (§1 & §9): Copy verbatim say-this / never-say-this (Card 07)
   * and lean-into / leave-out (Card 01) lists directly from the Brand Cards deck.
   * Intentionally left empty here rather than invented.
   */
  voiceGuidelines: {
    card01LeanInto: [] as string[],
    card01LeaveOut: [] as string[],
    card07SayThis: [] as string[],
    card07NeverSayThis: [] as string[],
  },
} as const;
