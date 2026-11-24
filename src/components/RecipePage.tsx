import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';
import type { TartanColorway } from '../config/siteConfig';
import type { SubscriberRecord } from '../services/mailingList';
import type {
  DietaryVariationKey,
  SafeDoorView,
  UnlockedDoorView,
} from '../types/advent';
import { formatUnlockDateLong } from '../utils/easternTime';
import { PdfGateCard } from './PdfGateCard';
import { TartanPlaceholder } from './TartanPlaceholder';

interface RecipePageProps {
  door: SafeDoorView | undefined;
  allDoors: SafeDoorView[];
  tartan: TartanColorway;
  subscriber: SubscriberRecord | null;
  onSubscribed: (record: SubscriberRecord) => void;
  onClearSubscriber: () => void;
  onGoHome: () => void;
  onOpenDoor: (day: number) => void;
}

const VARIATION_ORDER: Array<{
  key: DietaryVariationKey;
  shortLabel: string;
  tag: string;
}> = [
  { key: 'classic', shortLabel: 'Classic', tag: 'Heirloom' },
  { key: 'sculpt', shortLabel: 'Sculpt', tag: 'High-Protein' },
  { key: 'nourish', shortLabel: 'Nourish', tag: 'Whole-Food' },
  { key: 'pure', shortLabel: 'Pure', tag: 'Alkaline · Vegan' },
];

export function RecipePage({
  door,
  allDoors,
  tartan,
  subscriber,
  onSubscribed,
  onClearSubscriber,
  onGoHome,
  onOpenDoor,
}: RecipePageProps) {
  const [variationKey, setVariationKey] =
    useState<DietaryVariationKey>('classic');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Reset checklist & scroll to top when switching doors
  useEffect(() => {
    setCheckedItems({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [door?.day]);

  // Guard: Door not found or still locked -> strictly render sealed door only (§3 & §10)
  if (!door || door.kind === 'locked') {
    const lockedDay = door?.day ?? 1;
    const lockedTartan = door?.isFinale ? 'tartan-claret' : `tartan-${tartan}`;

    return (
      <main className="sealed-page">
        <div className={`sealed-card ${lockedTartan}`}>
          <div className="sealed-card__inner">
            <Lock
              size={26}
              color="var(--brass-bright)"
              style={{ margin: '0 auto 0.85rem' }}
              aria-hidden="true"
            />
            <span className="eyebrow">Door {String(lockedDay).padStart(2, '0')} Sealed</span>
            <h1
              className="display-heading"
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 2.75rem)',
                color: 'var(--ivory)',
                margin: '0.5rem 0 0.75rem',
              }}
            >
              Opens {formatUnlockDateLong(lockedDay)}
            </h1>
            <p style={{ color: 'var(--ivory-muted)', margin: '0 0 1.65rem' }}>
              This door unseals at 12:01 AM America/New_York. Return to the
              calendar to explore open doors or join the morning dispatch.
            </p>
            <button type="button" className="btn btn--primary" onClick={onGoHome}>
              <ArrowLeft size={15} aria-hidden="true" />
              Return to the 25 Doors
            </button>
          </div>
        </div>
      </main>
    );
  }

  const unlocked: UnlockedDoorView = door;
  const activeVariation = unlocked.dietaryVariations[variationKey];

  const unlockedList = allDoors.filter(
    (d): d is UnlockedDoorView => d.kind === 'unlocked'
  );
  const currentIdx = unlockedList.findIndex((d) => d.day === unlocked.day);
  const prevUnlocked = currentIdx > 0 ? unlockedList[currentIdx - 1] : null;
  const nextUnlocked =
    currentIdx >= 0 && currentIdx < unlockedList.length - 1
      ? unlockedList[currentIdx + 1]
      : null;

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="recipe-page">
      {/* Dark Hunter / Claret Finale Editorial Header */}
      <header
        className={`recipe-hero-band ${
          unlocked.isFinale ? 'recipe-hero-band--finale' : ''
        }`}
      >
        <div className="container container--narrow">
          <div className="recipe-topbar">
            <button type="button" className="back-link" onClick={onGoHome}>
              <ArrowLeft size={15} aria-hidden="true" />
              All 25 Doors
            </button>

            <div className="recipe-day-nav">
              {prevUnlocked && (
                <button
                  type="button"
                  className="back-link"
                  onClick={() => onOpenDoor(prevUnlocked.day)}
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Day {String(prevUnlocked.day).padStart(2, '0')}
                </button>
              )}
              {nextUnlocked && (
                <button
                  type="button"
                  className="back-link"
                  onClick={() => onOpenDoor(nextUnlocked.day)}
                >
                  Day {String(nextUnlocked.day).padStart(2, '0')}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="recipe-header">
            {unlocked.isFinale && (
              <div className="finale-crest">
                <Sparkles size={13} aria-hidden="true" />
                Day 25 · The Christmas Morning Finale
              </div>
            )}

            <div className="recipe-header__meta">
              <span className="eyebrow">
                Day {String(unlocked.day).padStart(2, '0')} ·{' '}
                {formatUnlockDateLong(unlocked.day)}
              </span>
              <span className="category-pill">{unlocked.category}</span>
            </div>

            <h1 className="recipe-header__title">{unlocked.title}</h1>

            {/* Strictly ONE Italianno accent line on the Recipe page (§1 & §4) */}
            <p className="accent-script">{unlocked.moodLine}</p>

            <p className="recipe-header__headnote">{unlocked.headnote}</p>

            <div className="recipe-stats" aria-label="Recipe timing and yield">
              <div className="recipe-stat">
                <span className="recipe-stat__label">Prep Time</span>
                <span className="recipe-stat__value">
                  {unlocked.prepTimeMinutes} min
                </span>
              </div>
              <div className="recipe-stat">
                <span className="recipe-stat__label">Cook Time</span>
                <span className="recipe-stat__value">
                  {unlocked.cookTimeMinutes} min
                </span>
              </div>
              <div className="recipe-stat">
                <span className="recipe-stat__label">Serves</span>
                <span className="recipe-stat__value">{unlocked.serves}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`tartan-band ${
          unlocked.isFinale ? 'tartan-claret' : `tartan-${tartan}`
        }`}
        aria-hidden="true"
      />

      {/* Main Editorial Ivory Wool Body */}
      <div className="container container--narrow recipe-body">
        {/* Dual 4:5 Photography Frame (§1, §4, §7) */}
        <section
          className="recipe-photos"
          aria-label="Recipe photography"
        >
          <div className="photo-slot">
            {unlocked.photos.hero ? (
              <img
                src={unlocked.photos.hero}
                alt={unlocked.photoAltText.hero}
                className="photo-slot__img"
              />
            ) : (
              <TartanPlaceholder
                tartan={unlocked.isFinale ? 'claret' : tartan}
                ribbonLabel="Hero Overhead · 4:5"
                altText={unlocked.photoAltText.hero}
                cardBorder={unlocked.cardBorder}
              />
            )}
          </div>

          <div className="photo-slot">
            {unlocked.photos.close ? (
              <img
                src={unlocked.photos.close}
                alt={unlocked.photoAltText.close}
                className="photo-slot__img"
              />
            ) : (
              <TartanPlaceholder
                tartan={unlocked.isFinale ? 'hunter' : tartan}
                ribbonLabel="Close Detail · 4:5"
                altText={unlocked.photoAltText.close}
                cardBorder={unlocked.cardBorder}
              />
            )}
          </div>
        </section>

        {/* 4-Way Dietary Variation Switcher (§4) */}
        <section
          className="variation-panel"
          aria-labelledby="variations-heading"
        >
          <div className="variation-panel__header">
            <span id="variations-heading" className="eyebrow eyebrow--dark">
              Four Dietary Editions
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              Switch ingredients &amp; method below
            </span>
          </div>

          <div
            className="variation-tabs"
            role="tablist"
            aria-label="Dietary variations"
          >
            {VARIATION_ORDER.map((item) => {
              const active = variationKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`variation-tab ${
                    active ? 'variation-tab--active' : ''
                  }`}
                  onClick={() => setVariationKey(item.key)}
                >
                  <span className="variation-tab__name">{item.shortLabel}</span>
                  <span className="variation-tab__tag">{item.tag}</span>
                </button>
              );
            })}
          </div>

          <p className="variation-subtitle">
            <strong>{activeVariation.name}:</strong> {activeVariation.subtitle}
          </p>
        </section>

        {/* Grouped Ingredients + Numbered Instructions */}
        <section className="recipe-columns" aria-label="Recipe ingredients and instructions">
          <div className="recipe-card-block">
            <h2 className="recipe-section-title">Ingredients</h2>

            {activeVariation.ingredientGroups.map((group, gIdx) => (
              <div key={`${variationKey}-${gIdx}`} className="ingredient-group">
                <h3 className="ingredient-group__label">{group.label}</h3>
                <ul className="ingredient-list">
                  {group.items.map((item, iIdx) => {
                    const checkId = `${unlocked.day}-${variationKey}-${gIdx}-${iIdx}`;
                    const checked = Boolean(checkedItems[checkId]);
                    return (
                      <li
                        key={checkId}
                        className={`ingredient-item ${
                          checked ? 'ingredient-item--checked' : ''
                        }`}
                      >
                        <label htmlFor={checkId}>
                          <input
                            id={checkId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleItem(checkId)}
                          />
                          <span>{item}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Paired Healing Drink summary inside grouped ingredients per §4 */}
            <div className="ingredient-group" style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(176, 141, 79, 0.35)' }}>
              <h3 className="ingredient-group__label">
                The Drink · {unlocked.healingDrink.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                {unlocked.healingDrink.recipe}
              </p>
            </div>
          </div>

          <div className="recipe-card-block">
            <h2 className="recipe-section-title">
              Instructions · {activeVariation.name}
            </h2>

            <ol className="instruction-list">
              {activeVariation.instructions.map((step, sIdx) => (
                <li key={`${variationKey}-step-${sIdx}`} className="instruction-step">
                  <span className="instruction-step__num" aria-hidden="true">
                    {sIdx + 1}
                  </span>
                  <p className="instruction-step__text">{step}</p>
                </li>
              ))}
            </ol>

            {unlocked.chefNote && (
              <div className="chef-note-box">
                <strong>Kitchen Note:</strong> {unlocked.chefNote}
              </div>
            )}
          </div>
        </section>

        {/* Paired Healing Drink Highlight Band (Claret) */}
        <section
          className="drink-pairing"
          aria-labelledby="drink-pairing-heading"
        >
          <div className="drink-pairing__inner">
            <div>
              <span className="eyebrow">Paired Healing Drink</span>
              <h2 id="drink-pairing-heading" className="drink-pairing__title">
                {unlocked.healingDrink.name}
              </h2>
              <p className="drink-pairing__benefits">
                {unlocked.healingDrink.benefits}
              </p>
              <span className="drink-pairing__serves">
                {unlocked.healingDrink.serves}
              </span>
            </div>

            <div>
              <span className="eyebrow">Preparation</span>
              <ol className="drink-pairing__steps">
                {unlocked.healingDrink.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Door 25 Finale Keepsake Note */}
        {unlocked.isFinale && (
          <section
            style={{
              background: '#fdfaf3',
              border: '1px solid var(--brass)',
              padding: '1.75rem 2rem',
              textAlign: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <span className="eyebrow eyebrow--dark">
              Day 25 · The Season Complete
            </span>
            <h2
              className="display-heading"
              style={{
                fontSize: '1.9rem',
                color: 'var(--hunter)',
                margin: '0.45rem 0 0.6rem',
              }}
            >
              Merry Christmas from Around the Hearth
            </h2>
            <p
              style={{
                margin: '0 auto',
                maxWidth: '58ch',
                color: 'var(--ink-muted)',
                fontSize: '0.96rem',
              }}
            >
              Twenty-five doors opened, one patient evening at a time. Every
              recipe in this calendar remains unlocked for the rest of the
              winter season whenever the oven calls again.
            </p>
          </section>
        )}

        {/* Email-Gated PDF Download (§4 Launch Requirement) */}
        <PdfGateCard
          door={unlocked}
          variationKey={variationKey}
          subscriber={subscriber}
          onSubscribed={onSubscribed}
          onClearSubscriber={onClearSubscriber}
        />
      </div>
    </main>
  );
}
