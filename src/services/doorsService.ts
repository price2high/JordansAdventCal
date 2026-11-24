import type {
  AdventDoorsFile,
  LockedDoorView,
  RawDoorRecord,
  SafeDoorView,
  UnlockedDoorView,
} from '../types/advent';
import { isDoorUnlocked } from '../utils/easternTime';

let cachedDoorsPromise: Promise<RawDoorRecord[]> | null = null;

/**
 * Loads the single JSON data source modeled on advent-doors.json (§5 & §10).
 */
export function loadRawDoors(): Promise<RawDoorRecord[]> {
  if (!cachedDoorsPromise) {
    cachedDoorsPromise = fetch('/data/advent-doors.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load advent-doors.json (${res.status})`);
        }
        return res.json() as Promise<AdventDoorsFile>;
      })
      .then((payload) => {
        if (!payload || !Array.isArray(payload.doors)) {
          throw new Error('Invalid advent-doors.json schema: missing doors array');
        }
        return [...payload.doors].sort((a, b) => a.day - b.day);
      });
  }
  return cachedDoorsPromise;
}

/**
 * Produces strictly sanitized UI door objects for the given Eastern timestamp.
 * Locked doors are stripped to title-free stubs so no recipe content can reach
 * component props, DOM nodes, or assistive technology (§3 & §10).
 */
export function buildSafeDoors(
  rawDoors: RawDoorRecord[],
  nowMs: number
): SafeDoorView[] {
  return rawDoors.map((door) => {
    if (!isDoorUnlocked(door.day, nowMs)) {
      const locked: LockedDoorView = {
        kind: 'locked',
        day: door.day,
        unlockDate: door.unlockDate,
        isFinale: door.isFinale,
        cardBorder: door.cardBorder,
      };
      return locked;
    }
    const unlocked: UnlockedDoorView = {
      ...door,
      kind: 'unlocked',
    };
    return unlocked;
  });
}
