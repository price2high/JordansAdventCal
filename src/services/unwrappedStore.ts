/**
 * Persists the visitor's set of unwrapped door numbers in localStorage (§5 & §8).
 *
 * Unlock eligibility is ALWAYS derived live from `unlockDate` in America/New_York;
 * this store tracks ONLY which eligible gifts the visitor has unwrapped.
 */

const STORAGE_KEY_UNWRAPPED = 'fireside_advent_unwrapped_doors_v1';

export function loadUnwrappedDays(): Set<number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_UNWRAPPED);
    if (!raw) return new Set<number>();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<number>();
    return new Set<number>(
      parsed.filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 25)
    );
  } catch {
    return new Set<number>();
  }
}

export function saveUnwrappedDays(days: Set<number>): void {
  try {
    const sorted = Array.from(days).sort((a, b) => a - b);
    window.localStorage.setItem(STORAGE_KEY_UNWRAPPED, JSON.stringify(sorted));
  } catch {
    // Non-fatal in private browsing
  }
}

export function clearUnwrappedDays(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY_UNWRAPPED);
  } catch {
    // ignore
  }
}
