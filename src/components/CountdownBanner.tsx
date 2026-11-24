import { ArrowRight, Sparkles } from 'lucide-react';
import type { SafeDoorView } from '../types/advent';
import {
  formatUnlockDateLong,
  type SeasonClockState,
} from '../utils/easternTime';

interface CountdownBannerProps {
  clock: SeasonClockState;
  doors: SafeDoorView[];
  unwrappedDays: Set<number>;
  onOpenDoor: (day: number) => void;
}

export function CountdownBanner({
  clock,
  doors,
  unwrappedDays,
  onOpenDoor,
}: CountdownBannerProps) {
  const todaysRecord =
    clock.todaysDoor !== null
      ? doors.find(
          (d) => d.kind === 'unlocked' && d.day === clock.todaysDoor
        )
      : undefined;

  const isTodayUnwrapped =
    todaysRecord !== undefined && unwrappedDays.has(todaysRecord.day);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="status-band" aria-label="Advent Calendar Status">
      <div className="container status-band__grid">
        <div>
          {clock.phase === 'pre-launch' && (
            <>
              <span className="eyebrow">First Door Unlocks Soon</span>
              <h2 className="status-band__title">
                Door 01 opens December 1 at 12:01 AM PST
              </h2>
              <p className="status-band__copy">
                Every morning from December 1 through December 25, a single door
                unseals on Pacific Time — revealing a cozy bake, four dietary
                editions, and its paired healing drink.
              </p>
              <a href="#dispatch" className="btn btn--primary">
                Receive Door 01 at Dawn
              </a>
            </>
          )}

          {clock.phase === 'active' &&
            todaysRecord &&
            todaysRecord.kind === 'unlocked' && (
              <>
                <span className="eyebrow">
                  Today&apos;s Gift · {formatUnlockDateLong(todaysRecord.day)}
                </span>
                {isTodayUnwrapped ? (
                  <>
                    <h2 className="status-band__title">
                      Day {pad(todaysRecord.day)}: {todaysRecord.title}
                    </h2>
                    <p className="status-band__copy">
                      {todaysRecord.headnote}
                    </p>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => onOpenDoor(todaysRecord.day)}
                    >
                      Open Today&apos;s Recipe
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="status-band__title">
                      Day {pad(todaysRecord.day)} Is Ready to Unwrap
                    </h2>
                    <p className="status-band__copy">
                      Today&apos;s wrapped gift is waiting below in the 5×5
                      calendar. Untie the brass ribbon to reveal today&apos;s
                      bake and its paired healing drink.
                    </p>
                    <a href="#calendar" className="btn btn--primary">
                      Unwrap Day {pad(todaysRecord.day)} Below
                      <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </>
                )}
              </>
            )}

          {clock.phase === 'complete' && (
            <>
              <span className="eyebrow">Season Complete · All 25 Gifts Ready</span>
              <h2 className="status-band__title">
                The Complete 25-Day Fireside Collection
              </h2>
              <p className="status-band__copy">
                Every gift from December 1 through the gold-wrapped Christmas
                Morning finale is available for the rest of the season. Unwrap
                any remaining gifts below or return to your favorite recipes.
              </p>
              {unwrappedDays.has(25) ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => onOpenDoor(25)}
                >
                  <Sparkles size={15} aria-hidden="true" />
                  Visit Day 25 Finale
                </button>
              ) : (
                <a href="#calendar" className="btn btn--primary">
                  Unwrap the Day 25 Finale
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
              )}
            </>
          )}
        </div>

        <div>
          {clock.countdown && clock.nextDoor !== null ? (
            <>
              <div
                className="countdown-grid"
                role="timer"
                aria-live="off"
                aria-label={`Countdown to Door ${clock.nextDoor}`}
              >
                <div className="countdown-cell">
                  <span className="countdown-cell__value">
                    {pad(clock.countdown.days)}
                  </span>
                  <span className="countdown-cell__unit">Days</span>
                </div>
                <div className="countdown-cell">
                  <span className="countdown-cell__value">
                    {pad(clock.countdown.hours)}
                  </span>
                  <span className="countdown-cell__unit">Hours</span>
                </div>
                <div className="countdown-cell">
                  <span className="countdown-cell__value">
                    {pad(clock.countdown.minutes)}
                  </span>
                  <span className="countdown-cell__unit">Minutes</span>
                </div>
                <div className="countdown-cell">
                  <span className="countdown-cell__value">
                    {pad(clock.countdown.seconds)}
                  </span>
                  <span className="countdown-cell__unit">Seconds</span>
                </div>
              </div>
              <p className="countdown-caption">
                Until Door {pad(clock.nextDoor)} unlocks · Dec {clock.nextDoor},
                2026 at 12:01 AM America/Los_Angeles
              </p>
            </>
          ) : (
            <div className="countdown-cell" style={{ padding: '1.75rem 1.25rem' }}>
              <span className="eyebrow">December 25 Finale</span>
              <span
                className="countdown-cell__value"
                style={{ fontSize: '2.2rem', marginTop: '0.4rem' }}
              >
                25 / 25 Open
              </span>
              <span className="countdown-cell__unit" style={{ marginTop: '0.5rem' }}>
                All doors remain open for the season
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
