import { SITE_CONFIG } from '../config/siteConfig';
import type { DietaryVariationKey, UnlockedDoorView } from '../types/advent';
import { formatUnlockDateLong } from './easternTime';

/**
 * Generates and downloads an editorial heritage recipe card PDF
 * for an unlocked door + selected dietary variation.
 *
 * STRICT GATE (§4): Only invoked after the visitor's email has been
 * captured via `subscribeToMailingList` in `PdfGateCard`.
 */
export async function downloadRecipePdf(
  door: UnlockedDoorView,
  variationKey: DietaryVariationKey
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const variation = door.dietaryVariations[variationKey];
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 52;

  const paintPageBackground = () => {
    // Ivory Wool ground (#F7F1E3)
    doc.setFillColor(247, 241, 227);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer Hunter frame (#1E3327)
    doc.setDrawColor(30, 51, 39);
    doc.setLineWidth(2);
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

    // Inner Antique Brass hairline (#B08D4F)
    doc.setDrawColor(176, 141, 79);
    doc.setLineWidth(0.75);
    doc.rect(26, 26, pageWidth - 52, pageHeight - 52);
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 64) {
      doc.addPage();
      paintPageBackground();
      y = 56;
    }
  };

  paintPageBackground();

  // Top Header Strip
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(176, 141, 79); // Antique Brass
  const dayTag = `DAY ${String(door.day).padStart(2, '0')}  •  ${formatUnlockDateLong(door.day).toUpperCase()}  •  ${door.category.toUpperCase()}`;
  doc.text(dayTag, pageWidth / 2, y, { align: 'center' });
  y += 16;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 63, 42); // Chestnut
  doc.text(
    `${SITE_CONFIG.siteName.toUpperCase()}  —  ${SITE_CONFIG.dietaryBadge.toUpperCase()}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  );
  y += 26;

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 51, 39); // Hunter
  const titleLines = doc.splitTextToSize(door.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
  y += titleLines.length * 24 + 4;

  // Mood line (italic)
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(94, 33, 41); // Claret
  doc.text(door.moodLine, pageWidth / 2, y, { align: 'center' });
  y += 18;

  // Brass rule
  doc.setDrawColor(176, 141, 79);
  doc.setLineWidth(0.8);
  doc.line(margin + 80, y, pageWidth - margin - 80, y);
  y += 18;

  // Meta bar
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(107, 63, 42);
  const metaText = `Prep: ${door.prepTimeMinutes} min   |   Cook: ${door.cookTimeMinutes} min   |   Serves: ${door.serves}   |   Edition: ${variation.name}`;
  doc.text(metaText, pageWidth / 2, y, { align: 'center' });
  y += 22;

  // Headnote
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(44, 30, 24);
  const headnoteLines = doc.splitTextToSize(door.headnote, contentWidth - 20);
  doc.text(headnoteLines, margin + 10, y);
  y += headnoteLines.length * 15 + 10;

  if (door.chefNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(107, 63, 42);
    const noteLines = doc.splitTextToSize(`Note: ${door.chefNote}`, contentWidth - 20);
    doc.text(noteLines, margin + 10, y);
    y += noteLines.length * 13 + 8;
  }

  // Variation Subtitle Banner
  ensureSpace(40);
  doc.setFillColor(30, 51, 39); // Hunter
  doc.rect(margin, y, contentWidth, 24, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(247, 241, 227);
  doc.text(`${variation.name.toUpperCase()} EDITION`, margin + 12, y + 15);
  y += 32;

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(107, 63, 42);
  const subLines = doc.splitTextToSize(variation.subtitle, contentWidth);
  doc.text(subLines, margin, y);
  y += subLines.length * 13 + 12;

  // Ingredients
  ensureSpace(32);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 51, 39);
  doc.text('Ingredients', margin, y);
  y += 16;

  for (const group of variation.ingredientGroups) {
    ensureSpace(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(94, 33, 41); // Claret
    doc.text(group.label.toUpperCase(), margin, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(44, 30, 24);
    for (const item of group.items) {
      const wrapped = doc.splitTextToSize(`•  ${item}`, contentWidth - 10);
      ensureSpace(wrapped.length * 13 + 4);
      doc.text(wrapped, margin + 6, y);
      y += wrapped.length * 13 + 3;
    }
    y += 6;
  }

  // Instructions
  y += 4;
  ensureSpace(36);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 51, 39);
  doc.text('Method', margin, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(44, 30, 24);
  variation.instructions.forEach((step, idx) => {
    const wrapped = doc.splitTextToSize(`${idx + 1}.  ${step}`, contentWidth - 8);
    ensureSpace(wrapped.length * 14 + 6);
    doc.text(wrapped, margin + 4, y);
    y += wrapped.length * 14 + 5;
  });

  // Paired Healing Drink Box (Claret accented)
  y += 12;
  const benefitLines = doc.splitTextToSize(
    `Benefits: ${door.healingDrink.benefits}`,
    contentWidth - 28
  );
  const drinkRecipeLines = doc.splitTextToSize(
    `Preparation (${door.healingDrink.serves}): ${door.healingDrink.recipe}`,
    contentWidth - 28
  );
  const boxHeight =
    46 + benefitLines.length * 13 + drinkRecipeLines.length * 13 + 16;

  ensureSpace(boxHeight + 16);
  doc.setFillColor(94, 33, 41); // Claret
  doc.rect(margin, y, contentWidth, boxHeight, 'F');
  doc.setDrawColor(176, 141, 79);
  doc.setLineWidth(0.75);
  doc.rect(margin + 4, y + 4, contentWidth - 8, boxHeight - 8);

  let dy = y + 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(176, 141, 79);
  doc.text('PAIRED HEALING DRINK', margin + 14, dy);
  dy += 16;

  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(247, 241, 227);
  doc.text(door.healingDrink.name, margin + 14, dy);
  dy += 15;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(247, 241, 227);
  doc.text(benefitLines, margin + 14, dy);
  dy += benefitLines.length * 13 + 6;
  doc.text(drinkRecipeLines, margin + 14, dy);

  // Footer
  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 63, 42);
  doc.text(
    `${SITE_CONFIG.siteName}  •  ${SITE_CONFIG.heroLine}  •  ${SITE_CONFIG.domain}`,
    pageWidth / 2,
    pageHeight - 34,
    { align: 'center' }
  );

  const filename = `day-${String(door.day).padStart(2, '0')}-${door.slug}-${variationKey}.pdf`;
  doc.save(filename);
}
