import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Users } from 'lucide-react';
import type { UnlockedDoorView } from '../types/advent';
import { formatUnlockDateLong } from '../utils/easternTime';

interface DayPreviewStripProps {
  unlockedDoors: UnlockedDoorView[];
  onOpenDoor: (day: number) => void;
}

/**
 * Day Preview interaction (§8):
 * Selecting any unlocked day swaps number, mood, category, title, description,
 * time, and serves — previewing the door-to-recipe relationship right above the grid.
 */
export function DayPreviewStrip({
  unlockedDoors,
  onOpenDoor,
}: DayPreviewStripProps) {
  const latestDay =
    unlockedDoors.length > 0
      ? unlockedDoors[unlockedDoors.length - 1].day
      : null;

  const [selectedDay, setSelectedDay] = useState<number | null>(latestDay);

  useEffect(() => {
    if (
      latestDay !== null &&
      !unlockedDoors.some((d) => d.day === selectedDay)
    ) {
      setSelectedDay(latestDay);
    }
  }, [latestDay, selectedDay, unlockedDoors]);

  if (unlockedDoors.length === 0 || selectedDay === null) {
    return null;
  }

  const active =
    unlockedDoors.find((d) => d.day === selectedDay) ??
    unlockedDoors[unlockedDoors.length - 1];

  return (
    <div className="day-preview" aria-label="Unlocked day preview">
      <div className="day-preview__header">
        <div>
          <span className="eyebrow eyebrow--dark">Day Preview</span>
          <span
            style={{
              marginLeft: '0.65rem',
              fontSize: '0.82rem',
              color: 'var(--ink-muted)',
            }}
          >
            Select an open door to preview its bake &amp; healing pairing
          </span>
        </div>

        <div className="day-preview__pills" role="tablist" aria-label="Open doors">
          {unlockedDoors.map((d) => (
            <button
              key={d.day}
              type="button"
              role="tab"
              aria-selected={d.day === active.day}
              className={`day-pill ${
                d.day === active.day ? 'day-pill--active' : ''
              }`}
              onClick={() => setSelectedDay(d.day)}
            >
              {String(d.day).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div className="day-preview__body" role="tabpanel">
        <div className="day-preview__numeral">
          {String(active.day).padStart(2, '0')}
        </div>

        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="eyebrow eyebrow--dark">
              {formatUnlockDateLong(active.day)}
            </span>
            <span aria-hidden="true" style={{ color: 'var(--brass)' }}>·</span>
            <span className="eyebrow eyebrow--dark">{active.category}</span>
          </div>

          <h3 className="day-preview__title">{active.title}</h3>
          <p className="day-preview__mood">{active.moodLine}</p>
          <p className="day-preview__desc">{active.headnote}</p>

          <div className="day-preview__meta">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} aria-hidden="true" />
              Prep {active.prepTimeMinutes}m · Cook {active.cookTimeMinutes}m
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} aria-hidden="true" />
              Serves {active.serves}
            </span>
            <span>Pairing: {active.healingDrink.name}</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn btn--hunter"
            onClick={() => onOpenDoor(active.day)}
          >
            Read Recipe
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
