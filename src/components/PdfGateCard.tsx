import { useState, type FormEvent } from 'react';
import { Check, Download, Lock } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  clearStoredSubscriber,
  subscribeToMailingList,
  type SubscriberRecord,
} from '../services/mailingList';
import type { DietaryVariationKey, UnlockedDoorView } from '../types/advent';
import { downloadRecipePdf } from '../utils/recipePdf';

interface PdfGateCardProps {
  door: UnlockedDoorView;
  variationKey: DietaryVariationKey;
  subscriber: SubscriberRecord | null;
  onSubscribed: (record: SubscriberRecord) => void;
  onClearSubscriber: () => void;
}

/**
 * Email-gated PDF download (§4 launch requirement & §6 unified list).
 * Visitors must submit a valid email address before downloading the PDF card.
 */
export function PdfGateCard({
  door,
  variationKey,
  subscriber,
  onSubscribed,
  onClearSubscriber,
}: PdfGateCardProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const variationName = door.dietaryVariations[variationKey].name;

  const handleGateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    const result = await subscribeToMailingList({
      email,
      source: 'recipe-pdf-gate',
      recipeDay: door.day,
    });

    if (!result.ok || !result.record) {
      setStatus('error');
      setFeedback(result.error ?? 'Please enter a valid email address.');
      return;
    }

    onSubscribed(result.record);
    setEmail('');
    setStatus('idle');
    setFeedback(`PDF unlocked — downloading your ${variationName} recipe card.`);
    await downloadRecipePdf(door, variationKey);
  };

  const handleDirectDownload = async () => {
    if (!subscriber) return;
    await downloadRecipePdf(door, variationKey);
    setFeedback(
      `Downloaded Day ${String(door.day).padStart(2, '0')} (${variationName}) PDF.`
    );
  };

  const handleSwitchEmail = () => {
    clearStoredSubscriber();
    onClearSubscriber();
    setFeedback('');
  };

  return (
    <section className="pdf-gate" aria-labelledby="pdf-gate-heading">
      <div>
        <span className="eyebrow">
          <Lock
            size={11}
            style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: '-1px' }}
            aria-hidden="true"
          />
          Keepsake Recipe Card · PDF
        </span>
        <h2 id="pdf-gate-heading" className="pdf-gate__title">
          Save Day {String(door.day).padStart(2, '0')} for Your Kitchen Binder
        </h2>
        <p className="pdf-gate__copy">
          Enter your email to unlock the formatted PDF for{' '}
          <strong>{door.title}</strong> ({variationName} edition) plus its{' '}
          {door.healingDrink.name} pairing. Joining also adds you to the{' '}
          {SITE_CONFIG.siteName} morning dispatch.
        </p>
      </div>

      <div>
        {subscriber ? (
          <div className="pdf-gate__unlocked">
            <p className="pdf-gate__subscriber">
              <Check
                size={14}
                style={{
                  display: 'inline',
                  marginRight: '0.35rem',
                  verticalAlign: '-2px',
                  color: 'var(--brass-bright)',
                }}
                aria-hidden="true"
              />
              Unlocked for <strong>{subscriber.email}</strong>
            </p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleDirectDownload}
            >
              <Download size={15} aria-hidden="true" />
              Download {variationName} PDF
            </button>
            <button
              type="button"
              className="pdf-gate__switch"
              onClick={handleSwitchEmail}
            >
              Use a different email address
            </button>
          </div>
        ) : (
          <form className="pdf-gate__form" onSubmit={handleGateSubmit} noValidate>
            <label className="sr-only" htmlFor="pdf-gate-email">
              Email address to unlock PDF
            </label>
            <input
              id="pdf-gate-email"
              type="email"
              required
              className="field-input"
              placeholder="Enter your email to unlock PDF"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={status === 'submitting'}
            >
              <Download size={15} aria-hidden="true" />
              {status === 'submitting'
                ? 'Unlocking…'
                : `Unlock & Download ${variationName} PDF`}
            </button>
          </form>
        )}

        {feedback && (
          <p
            className={`form-message ${
              status === 'error' ? 'form-message--error' : ''
            }`}
            role={status === 'error' ? 'alert' : 'status'}
            style={{ marginTop: '0.75rem', marginBottom: 0 }}
          >
            {feedback}
          </p>
        )}
      </div>
    </section>
  );
}
