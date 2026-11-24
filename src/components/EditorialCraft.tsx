import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

/**
 * Editorial "Same House" Craft Showcase (§1 & §7) +
 * Interactive Brand Palette Swatches (copy hex on click, §8).
 */
export function EditorialCraft() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      window.setTimeout(() => {
        setCopiedHex((prev) => (prev === hex ? null : prev));
      }, 1800);
    } catch {
      setCopiedHex(hex);
    }
  };

  return (
    <section className="craft-section" aria-labelledby="craft-heading">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow eyebrow--dark">Every Evening, Paired</span>
          <h2
            id="craft-heading"
            className="section-header__title section-header__title--dark"
          >
            The Bake &amp; The Healing Cup
          </h2>
          <p className="section-header__copy section-header__copy--dark">
            Each door pairs an heirloom holiday bake — offered in Classic,
            Sculpt, Nourish, and Pure editions — with a botanical drink built to
            steady and restore.
          </p>
        </div>

        <div className="craft-grid">
          <article className="craft-card">
            <div className="craft-card__frame">
              <img
                src={SITE_CONFIG.assets.detailBakeImage}
                alt="Soft-baked spiced holiday cookies glazed in ivory vanilla on dark stoneware beside a vintage brass spoon and hunter-green tartan wool."
                className="craft-card__img"
                loading="lazy"
              />
            </div>
            <div className="craft-card__meta">
              <span className="eyebrow eyebrow--dark">Four Editions Per Bake</span>
              <h3 className="craft-card__title">Classic · Sculpt · Nourish · Pure</h3>
              <p className="craft-card__text">
                Switch seamlessly between traditional heirloom baking,
                high-protein blood-sugar-steady builds, nutrient-dense whole
                foods, and alkaline plant-based editions.
              </p>
            </div>
          </article>

          <article className="craft-card">
            <div className="craft-card__frame">
              <img
                src={SITE_CONFIG.assets.detailDrinkImage}
                alt="Spiced ruby holiday drink in cut-crystal glassware garnished with rosemary and frosted cranberries on dark stone beside brass tray and whole star anise."
                className="craft-card__img"
                loading="lazy"
              />
            </div>
            <div className="craft-card__meta">
              <span className="eyebrow eyebrow--dark">Functional Pairings</span>
              <h3 className="craft-card__title">Twenty-Five Healing Drinks</h3>
              <p className="craft-card__text">
                From hibiscus-ginger sparklers and roasted dandelion espresso to
                saffron ashwagandha warm milk — every cup balances the dish on
                the plate.
              </p>
            </div>
          </article>
        </div>

        {/* Palette Swatches — click to copy hex (§8) */}
        <div className="palette-strip">
          <div className="palette-strip__top">
            <span className="eyebrow eyebrow--dark">
              House Palette · 60 / 25 / 15 Ratio
            </span>
            <span className="palette-strip__hint">
              {copiedHex
                ? `Copied ${copiedHex} to clipboard`
                : 'Click any swatch to copy its hex value'}
            </span>
          </div>

          <div className="palette-swatches">
            {SITE_CONFIG.palette.map((swatch) => {
              const isCopied = copiedHex === swatch.hex;
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  className="swatch-btn"
                  onClick={() => handleCopyHex(swatch.hex)}
                  aria-label={`Copy ${swatch.name} hex ${swatch.hex}`}
                >
                  <span
                    className="swatch-btn__chip"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="swatch-btn__info">
                    <span className="swatch-btn__name">
                      {swatch.name}
                      {swatch.ratio ? ` · ${swatch.ratio}` : ''}
                    </span>
                    <span className="swatch-btn__hex">
                      {isCopied ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={11} aria-hidden="true" /> Copied
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Copy size={10} aria-hidden="true" /> {swatch.hex}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
