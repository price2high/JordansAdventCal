import { SITE_CONFIG, type TartanColorway } from '../config/siteConfig';

interface HeaderProps {
  tartan: TartanColorway;
  onChangeTartan: (colorway: TartanColorway) => void;
  onGoHome: () => void;
  isRecipeView: boolean;
}

export function Header({
  tartan,
  onChangeTartan,
  onGoHome,
  isRecipeView,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button
          type="button"
          className="brand-lockup"
          onClick={onGoHome}
          aria-label={`${SITE_CONFIG.siteName} — return to home`}
        >
          <span className="brand-lockup__name">{SITE_CONFIG.siteName}</span>
          <span className="brand-lockup__sub">December 1–25, {SITE_CONFIG.seasonYear}</span>
        </button>

        <div className="header-controls">
          {!isRecipeView && (
            <nav className="header-nav" aria-label="Primary">
              <a className="header-nav__link" href="#calendar">
                The 25 Doors
              </a>
              <a className="header-nav__link" href="#dispatch">
                Daily Dispatch
              </a>
              <a className="header-nav__link" href="#about">
                About
              </a>
            </nav>
          )}

          <div
            className="tartan-switcher"
            role="group"
            aria-label="Preview tartan colorway"
          >
            <span className="tartan-switcher__label">Tartan</span>
            {SITE_CONFIG.tartanColorways.map((cw) => {
              const active = tartan === cw.id;
              return (
                <button
                  key={cw.id}
                  type="button"
                  onClick={() => onChangeTartan(cw.id)}
                  className={`tartan-switcher__btn tartan-${cw.id} ${
                    active ? 'tartan-switcher__btn--active' : ''
                  }`}
                  aria-label={`${cw.label} tartan (${cw.note})`}
                  aria-pressed={active}
                  title={`${cw.label} — ${cw.note}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
