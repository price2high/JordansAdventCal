import { SITE_CONFIG } from '../config/siteConfig';

export function AboutNote() {
  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-note">
          <span className="eyebrow">{SITE_CONFIG.essence}</span>
          <h2 id="about-heading" className="about-note__title">
            About the Calendar
          </h2>
          <div className="brass-divider" aria-hidden="true">
            <span className="brass-diamond" />
          </div>
          <p className="about-note__body">
            December moves quickly if you let it. {SITE_CONFIG.siteName} was
            built as an unhurried counter-rhythm: twenty-five mornings, one oven
            warmed at a time, and a healing cup poured to meet every bake at the
            table.
          </p>
          <p className="about-note__body" style={{ marginBottom: 0 }}>
            Every dish is {SITE_CONFIG.dietaryBadge.toLowerCase()} and written
            across four thoughtful editions — Classic, Sculpt, Nourish, and Pure
            — so everyone gathered around the hearth shares the same winter
            table.
          </p>
        </div>
      </div>
    </section>
  );
}
