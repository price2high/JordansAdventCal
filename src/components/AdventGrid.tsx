import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import type { TartanColorway } from '../config/siteConfig';
import type { SafeDoorView, UnlockedDoorView } from '../types/advent';
import { formatUnlockDateShort } from '../utils/easternTime';
import { DayPreviewStrip } from './DayPreviewStrip';

interface AdventGridProps {
  doors: SafeDoorView[];
  todaysDoor: number | null;
  unwrappedDays: Set<number>;
  tartan: TartanColorway;
  onUnwrapDoor: (day: number) => void;
  onOpenDoor: (day: number) => void;
}

const UNWRAP_DURATION_MS = 1020;

/**
 * Sculptural Antique Brass ribbon bow at top-center of each wrapped gift (§3).
 * Pure heritage satin material — no confetti, snow, or sparkles (§5).
 */
function GiftBowSvg({ isFinale }: { isFinale: boolean }) {
  const mainFill = isFinale ? '#d8b773' : '#b08d4f';
  const highlightFill = isFinale ? '#f0d89e' : '#d2b274';
  const shadowStroke = isFinale ? '#5e2129' : '#6b4f21';

  return (
    <svg
      className="gift-bow"
      viewBox="0 0 64 44"
      fill="none"
      aria-hidden="true"
    >
      {/* Ribbon tails */}
      <path
        d="M28 24 L17 41 L24 39 L31 26 Z"
        fill={mainFill}
        stroke={shadowStroke}
        strokeWidth="1"
      />
      <path
        d="M36 24 L47 41 L40 39 L33 26 Z"
        fill={mainFill}
        stroke={shadowStroke}
        strokeWidth="1"
      />
      {/* Left loop */}
      <path
        d="M31 22 C24 8, 6 7, 8 20 C10 30, 24 28, 31 23 Z"
        fill={mainFill}
        stroke={shadowStroke}
        strokeWidth="1.2"
      />
      <path
        d="M28 21 C23 12, 12 12, 12 19 C13 24, 22 24, 28 22 Z"
        fill={highlightFill}
        opacity="0.65"
      />
      {/* Right loop */}
      <path
        d="M33 22 C40 8, 58 7, 56 20 C54 30, 40 28, 33 23 Z"
        fill={mainFill}
        stroke={shadowStroke}
        strokeWidth="1.2"
      />
      <path
        d="M36 21 C41 12, 52 12, 52 19 C51 24, 42 24, 36 22 Z"
        fill={highlightFill}
        opacity="0.65"
      />
      {/* Center knot */}
      <rect
        x="27"
        y="17"
        width="10"
        height="10"
        rx="3"
        fill={highlightFill}
        stroke={shadowStroke}
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function AdventGrid({
  doors,
  todaysDoor,
  unwrappedDays,
  tartan,
  onUnwrapDoor,
  onOpenDoor,
}: AdventGridProps) {
  const [unwrappingDays, setUnwrappingDays] = useState<Set<number>>(
    () => new Set()
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const timersRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, []);

  // Only expose doors in DayPreviewStrip that are BOTH date-unlocked AND unwrapped (§6)
  const unwrappedDoors = doors.filter(
    (d): d is UnlockedDoorView =>
      d.kind === 'unlocked' && unwrappedDays.has(d.day)
  );

  const handleLockedClick = (day: number) => {
    setStatusMessage(`Opens ${formatUnlockDateShort(day)}`);
  };

  const handleBeginUnwrap = (door: UnlockedDoorView) => {
    if (unwrappingDays.has(door.day)) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const duration = prefersReduced ? 440 : UNWRAP_DURATION_MS;

    setUnwrappingDays((prev) => {
      const next = new Set(prev);
      next.add(door.day);
      return next;
    });

    setStatusMessage(
      `Day ${door.day} unwrapped — ${door.title}. Select again to open the recipe.`
    );

    const timerId = window.setTimeout(() => {
      onUnwrapDoor(door.day);
      setUnwrappingDays((prev) => {
        const next = new Set(prev);
        next.delete(door.day);
        return next;
      });
      timersRef.current.delete(door.day);
    }, duration);

    timersRef.current.set(door.day, timerId);
  };

  return (
    <section
      id="calendar"
      className="calendar-section"
      aria-labelledby="calendar-heading"
    >
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">December 1–25, 2026 · Pacific Time</span>
          <h2 id="calendar-heading" className="section-header__title">
            Twenty-Five Wrapped Gifts
          </h2>
          <p className="section-header__copy">
            One gift unlocks each morning at 12:01 AM America/Los_Angeles. Tap an
            open day to unwrap its bake and healing pairing; once unwrapped, it
            stays open all season.
          </p>
        </div>

        <DayPreviewStrip
          unlockedDoors={unwrappedDoors}
          onOpenDoor={onOpenDoor}
        />

        <div aria-live="polite" aria-atomic="true">
          {statusMessage && (
            <div className="grid-status-toast" role="status">
              <Lock size={14} color="var(--brass-bright)" aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Hunter Tartan Band framing the Ivory Wool 5×5 Gift Tray (§2) */}
        <div className={`advent-grid-frame tartan-${tartan}`}>
          <div className="advent-grid-tray">
            <div className="gift-grid" role="list" aria-label="25-day Advent calendar">
              {doors.map((door) => {
                const isDateUnlocked = door.kind === 'unlocked';
                const isUnwrapped =
                  isDateUnlocked && unwrappedDays.has(door.day);
                const isUnwrapping =
                  isDateUnlocked && unwrappingDays.has(door.day);
                const isTodayEligible =
                  isDateUnlocked &&
                  !isUnwrapped &&
                  !isUnwrapping &&
                  todaysDoor === door.day;
                const isPastEligible =
                  isDateUnlocked &&
                  !isUnwrapped &&
                  !isUnwrapping &&
                  todaysDoor !== door.day;

                const paperClass = door.isFinale
                  ? 'paper-gold'
                  : `tartan-${tartan}`;

                // Accessible label per §9:
                // Locked: "Day 12 — opens December 12"
                // Today/Available: "Day 12 — Unwrap today" / "Day 12 — Unwrap gift"
                // Unwrapped: "Day 12 — [recipe title]"
                let ariaLabel = `Day ${door.day} — opens December ${door.day}`;
                if (isUnwrapped && door.kind === 'unlocked') {
                  ariaLabel = `Day ${door.day} — ${door.title}`;
                } else if (isTodayEligible) {
                  ariaLabel = `Day ${door.day} — Unwrap today`;
                } else if (isPastEligible) {
                  ariaLabel = `Day ${door.day} — Unwrap gift`;
                } else if (isUnwrapping && door.kind === 'unlocked') {
                  ariaLabel = `Unwrapping Day ${door.day} — ${door.title}`;
                }

                const tileClasses = [
                  'gift-tile',
                  door.isFinale ? 'gift-tile--finale' : '',
                  isTodayEligible ? 'gift-tile--today' : '',
                  isPastEligible ? 'gift-tile--available' : '',
                  isUnwrapped ? 'gift-tile--unwrapped' : '',
                  isUnwrapping ? 'gift-tile--unwrapping' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                const handleClick = () => {
                  if (!isDateUnlocked) {
                    handleLockedClick(door.day);
                    return;
                  }
                  if (isUnwrapped) {
                    onOpenDoor(door.day);
                    return;
                  }
                  handleBeginUnwrap(door);
                };

                return (
                  <div key={door.day} role="listitem">
                    <button
                      type="button"
                      className={tileClasses}
                      onClick={handleClick}
                      aria-label={ariaLabel}
                      aria-disabled={isUnwrapping}
                    >
                      {/* Underneath layer: ONLY mounted when unwrapped or actively unwrapping (§6) */}
                      {door.kind === 'unlocked' &&
                        (isUnwrapped || isUnwrapping) && (
                          <div className="gift-underneath">
                            <div className="gift-underneath__media">
                              <span className="gift-underneath__day-stamp">
                                {door.day}
                              </span>

                              {door.photos.hero ? (
                                <img
                                  src={door.photos.hero}
                                  alt={door.photoAltText.hero}
                                  className="gift-underneath__img"
                                  loading="lazy"
                                />
                              ) : (
                                <div
                                  className={`gift-underneath__placeholder ${
                                    door.isFinale
                                      ? 'paper-gold'
                                      : `tartan-${tartan}`
                                  }`}
                                  role="img"
                                  aria-label={door.photoAltText.hero}
                                >
                                  <span className="gift-underneath__category-chip">
                                    {door.category}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="gift-underneath__caption">
                              <p className="gift-underneath__title">
                                {door.title}
                              </p>
                            </div>
                          </div>
                        )}

                      {/* Wrapping Paper + Antique Brass Cross Ribbon + Bow + Ivory Tag (§3) */}
                      {!isUnwrapped && (
                        <div className="gift-wrap" aria-hidden="true">
                          <div
                            className={`gift-paper-half gift-paper-half--left ${paperClass}`}
                          />
                          <div
                            className={`gift-paper-half gift-paper-half--right ${paperClass}`}
                          />
                          <div className="gift-ribbon-v" />
                          <div className="gift-ribbon-h" />
                          <GiftBowSvg isFinale={door.isFinale} />

                          <div className="gift-tag">
                            <span className="gift-tag__num">{door.day}</span>
                          </div>

                          {isTodayEligible && (
                            <span className="gift-today-pill">Unwrap today</span>
                          )}

                          {isPastEligible && (
                            <span className="gift-today-pill gift-today-pill--past">
                              Unwrap
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
