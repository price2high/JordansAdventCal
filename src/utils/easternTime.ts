/**
 * Strict America/Los_Angeles date & unlock logic (§3 & §10).
 *
 * Every door unlocks at 00:01 AM America/Los_Angeles (PST, UTC-8 in December)
 * regardless of the visitor's local browser timezone.
 */

export const SEASON_YEAR = 2026;
export const EASTERN_TZ = 'America/Los_Angeles';

/**
 * Exact UTC epoch ms when Door `day` (1..25) unlocks:
 * December `day`, 2026 at 00:01:00 PST (-08:00).
 * Note: US Daylight Saving Time ends Nov 1, 2026, so all of Dec 2026 is PST (-08:00).
 */
export function getDoorUnlockEpochMs(day: number): number {
  const dd = String(day).padStart(2, '0');
  return Date.parse(`${SEASON_YEAR}-12-${dd}T00:01:00-08:00`);
}

/**
 * Check whether Door `day` is unlocked at the given epoch timestamp.
 */
export function isDoorUnlocked(day: number, nowMs: number): boolean {
  return nowMs >= getDoorUnlockEpochMs(day);
}

/**
 * Parse an optional preview date string (YYYY-MM-DD, interpreted as 12:00 PM PST)
 * so reviewers can test locked/unlocked states prior to Dec 1 without altering live logic.
 */
export function previewDateToEpochMs(isoDate: string | null): number | null {
  if (!isoDate) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const ms = Date.parse(`${isoDate}T12:00:00-08:00`);
  return Number.isNaN(ms) ? null : ms;
}

export interface EasternCalendarParts {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
  hour: number;
  minute: number;
  second: number;
}

export function getEasternParts(nowMs: number): EasternCalendarParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(new Date(nowMs));
  const lookup = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? '0');

  return {
    year: lookup('year'),
    month: lookup('month'),
    day: lookup('day'),
    hour: lookup('hour') % 24,
    minute: lookup('minute'),
    second: lookup('second'),
  };
}

export type SeasonPhase = 'pre-launch' | 'active' | 'complete';

export interface SeasonClockState {
  phase: SeasonPhase;
  unlockedCount: number;
  /** The most recently unlocked door (1..25), or null before launch. */
  todaysDoor: number | null;
  /** Next door to unlock (1..25), or null once all 25 are open. */
  nextDoor: number | null;
  /** Epoch ms of next unlock, or null when season is complete. */
  nextUnlockMs: number | null;
  /** Remaining time to next unlock in d/h/m/s. */
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
}

export function getSeasonClockState(nowMs: number): SeasonClockState {
  let unlockedCount = 0;
  for (let d = 1; d <= 25; d++) {
    if (isDoorUnlocked(d, nowMs)) {
      unlockedCount = d;
    } else {
      break;
    }
  }

  const phase: SeasonPhase =
    unlockedCount === 0
      ? 'pre-launch'
      : unlockedCount < 25
        ? 'active'
        : 'complete';

  const todaysDoor = unlockedCount > 0 ? unlockedCount : null;
  const nextDoor = unlockedCount < 25 ? unlockedCount + 1 : null;
  const nextUnlockMs = nextDoor ? getDoorUnlockEpochMs(nextDoor) : null;

  let countdown: SeasonClockState['countdown'] = null;
  if (nextUnlockMs !== null) {
    const diffSec = Math.max(0, Math.floor((nextUnlockMs - nowMs) / 1000));
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    countdown = { days, hours, minutes, seconds };
  }

  return {
    phase,
    unlockedCount,
    todaysDoor,
    nextDoor,
    nextUnlockMs,
    countdown,
  };
}

export function formatUnlockDateLong(day: number): string {
  return `December ${day}, ${SEASON_YEAR}`;
}

export function formatUnlockDateShort(day: number): string {
  return `Dec ${day}`;
}

export function formatEasternNowLabel(nowMs: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TZ,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(nowMs));
}
