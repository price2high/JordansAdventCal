import { useState, type FormEvent } from 'react';
import { Check, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  subscribeToMailingList,
  type SubscriberRecord,
} from '../services/mailingList';

interface EmailSignupProps {
  subscriber: SubscriberRecord | null;
  onSubscribed: (record: SubscriberRecord) => void;
}

export function EmailSignup({ subscriber, onSubscribed }: EmailSignupProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

    const result = await subscribeToMailingList({
      email,
      firstName,
      source: 'home-dispatch',
    });

    if (!result.ok || !result.record) {
      setStatus('error');
      setMessage(result.error ?? 'Could not complete signup.');
      return;
    }

    onSubscribed(result.record);
    setStatus('success');
    setMessage(
      `You're on the ${SITE_CONFIG.siteName} morning list. Watch for Door 01 on December 1.`
    );
    setEmail('');
    setFirstName('');
  };

  return (
    <section
      id="dispatch"
      className="dispatch-section"
      aria-labelledby="dispatch-heading"
    >
      <div className="container">
        <div className="dispatch-card">
          <span className="eyebrow">Morning Dispatch · Dec 1–25</span>
          <h2 id="dispatch-heading" className="dispatch-card__title">
            Each Morning&apos;s Door, Delivered Quietly
          </h2>
          <p className="dispatch-card__copy">
            Join the {SITE_CONFIG.siteName} list to receive each unlocked bake
            and its paired healing drink every morning from December 1 through
            Christmas Day — plus instant access to printable recipe PDFs.
          </p>

          {subscriber && status !== 'error' ? (
            <div className="form-message" role="status">
              <p style={{ margin: '0 0 0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Check size={16} aria-hidden="true" />
                Subscribed as <strong>{subscriber.email}</strong>
              </p>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ivory-soft)' }}>
                {message ||
                  `You're enrolled in the daily morning dispatch and every recipe PDF card is ready to download.`}
              </p>
            </div>
          ) : (
            <form className="dispatch-form" onSubmit={handleSubmit} noValidate>
              <label className="sr-only" htmlFor="dispatch-name">
                First name (optional)
              </label>
              <input
                id="dispatch-name"
                type="text"
                className="field-input"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />

              <label className="sr-only" htmlFor="dispatch-email">
                Email address
              </label>
              <input
                id="dispatch-email"
                type="email"
                required
                className="field-input"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === 'submitting'}
              >
                <Mail size={15} aria-hidden="true" />
                {status === 'submitting' ? 'Joining…' : 'Join the Dispatch'}
              </button>
            </form>
          )}

          {status === 'error' && message && (
            <p className="form-message form-message--error" role="alert">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
