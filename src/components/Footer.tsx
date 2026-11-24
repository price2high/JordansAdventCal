import { SITE_CONFIG } from '../config/siteConfig';
import { formatEasternNowLabel } from '../utils/easternTime';

interface FooterProps {
  previewDate: string | null;
  effectiveNowMs: number;
  unwrappedCount: number;
  onSelectPreviewDate: (isoDate: string | null) => void;
  onResetUnwrapped: () => void;
}

const PREVIEW_PRESETS: Array<{ label: string; value: string | null }> = [
  { label: 'Live PT', value: null },
  { label: 'Dec 1 (Launch)', value: '2026-12-01' },
  { label: 'Dec 12 (Mid-Season)', value: '2026-12-12' },
  { label: 'Dec 25 (Finale)', value: '2026-12-25' },
];

export function Footer({
  previewDate,
  effectiveNowMs,
  unwrappedCount,
  onSelectPreviewDate,
  onResetUnwrapped,
}: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand">{SITE_CONFIG.siteName}</div>
            <div style={{ marginTop: '0.2rem' }}>
              {SITE_CONFIG.heroLine} · {SITE_CONFIG.dietaryBadge}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="eyebrow" style={{ fontSize: '0.64rem' }}>
              Calendar Clock · America/Los_Angeles
            </div>
            <div style={{ marginTop: '0.2rem' }}>
              {formatEasternNowLabel(effectiveNowMs)}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {SITE_CONFIG.seasonYear} {SITE_CONFIG.siteName}. Doors unlock
            daily at 12:01 AM PST.
          </div>

          <div
            className="preview-controls"
            role="group"
            aria-label="Editorial date preview"
          >
            <span className="preview-controls__label">Date Preview:</span>
            {PREVIEW_PRESETS.map((preset) => {
              const active = previewDate === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={`preview-chip ${active ? 'preview-chip--active' : ''}`}
                  onClick={() => onSelectPreviewDate(preset.value)}
                  aria-pressed={active}
                >
                  {preset.label}
                </button>
              );
            })}
            {unwrappedCount > 0 && (
              <button
                type="button"
                className="preview-chip"
                onClick={onResetUnwrapped}
                title="Re-wrap all unwrapped gifts to replay the unwrap animation"
              >
                Re-wrap ({unwrappedCount})
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
