import { SITE_CONFIG } from '../config/siteConfig';

interface HeroProps {
  todaysDoor: number | null;
  isTodayUnwrapped: boolean;
  onOpenDoor: (day: number) => void;
}

export function Hero({
  todaysDoor,
  isTodayUnwrapped,
  onOpenDoor,
}: HeroProps) {
  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero__media" aria-hidden="true">
        <img
          src={SITE_CONFIG.assets.heroImage}
          alt=""
          className="hero__img"
          loading="eager"
        />
        <div className="hero__scrim" />
      </div>

      <div className="container hero__content">
        <div className="hero__badge">
          <span>25 Doors · Dec 1–25, {SITE_CONFIG.seasonYear}</span>
          <span aria-hidden="true">·</span>
          <span>{SITE_CONFIG.dietaryBadge}</span>
        </div>

        <h1 className="hero__title">{SITE_CONFIG.heroLine}</h1>

        {/* Strictly ONE Italianno accent line on the Home page (§1) */}
        <p className="accent-script hero__accent">{SITE_CONFIG.homeAccentLine}</p>

        <div className="brass-divider" aria-hidden="true">
          <span className="brass-diamond" />
        </div>

        <p className="hero__lead">
          One quiet ritual each morning at 12:01 AM Eastern: an heirloom holiday
          bake paired with a functional healing drink, crafted across four dietary
          editions.
        </p>

        <div className="hero__actions">
          {todaysDoor !== null && isTodayUnwrapped ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onOpenDoor(todaysDoor)}
            >
              Open Day {String(todaysDoor).padStart(2, '0')} Recipe
            </button>
          ) : todaysDoor !== null ? (
            <a href="#calendar" className="btn btn--primary">
              Unwrap Day {String(todaysDoor).padStart(2, '0')}
            </a>
          ) : (
            <a href="#calendar" className="btn btn--primary">
              Explore the 25 Gifts
            </a>
          )}
          <a href="#dispatch" className="btn btn--ghost">
            Join the Daily Dispatch
          </a>
        </div>
      </div>
    </section>
  );
}
