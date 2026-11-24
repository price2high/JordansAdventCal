import type { TartanColorway } from '../config/siteConfig';

interface TartanPlaceholderProps {
  tartan: TartanColorway;
  ribbonLabel: string;
  altText: string;
  cardBorder: string;
}

/**
 * 4:5 vertical editorial tartan placeholder (§7):
 * Used wherever a per-door recipe photograph is not yet final, preserving
 * the exact alt text and 4:5 aspect ratio so real photos drop straight in.
 */
export function TartanPlaceholder({
  tartan,
  ribbonLabel,
  altText,
  cardBorder,
}: TartanPlaceholderProps) {
  return (
    <div
      className={`tartan-placeholder tartan-${tartan}`}
      role="img"
      aria-label={altText}
    >
      <span className="tartan-placeholder__ribbon">{ribbonLabel}</span>

      <div className="tartan-placeholder__card">
        <p className="tartan-placeholder__note">
          Photography Pending · 4:5 Heritage Frame · {cardBorder}
        </p>
        <p className="tartan-placeholder__alt">{altText}</p>
      </div>
    </div>
  );
}
