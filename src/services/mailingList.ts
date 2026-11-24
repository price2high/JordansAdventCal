import { SITE_CONFIG } from '../config/siteConfig';

/**
 * Unified Mailing List service (§6).
 *
 * Both the Home Daily Dispatch signup form and every per-recipe PDF gate
 * feed this single mailing list. When `SITE_CONFIG.mailingListWebhookUrl`
 * is connected (e.g. to n8n "Advent Daily Dispatch" or a list provider),
 * submissions POST directly there in addition to updating local session state.
 */

export type SignupSource = 'home-dispatch' | 'recipe-pdf-gate';

export interface SubscriberRecord {
  email: string;
  firstName?: string;
  source: SignupSource;
  recipeDay?: number;
  subscribedAtIso: string;
  senderName: string;
  siteUrl: string;
}

const STORAGE_KEY_SUBSCRIBER = 'fireside_advent_subscriber_v1';
const STORAGE_KEY_LIST = 'fireside_advent_mailing_list_v1';

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function getStoredSubscriber(): SubscriberRecord | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_SUBSCRIBER);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SubscriberRecord;
    return parsed && parsed.email ? parsed : null;
  } catch {
    return null;
  }
}

export function clearStoredSubscriber(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY_SUBSCRIBER);
  } catch {
    // ignore storage failures in restricted contexts
  }
}

export async function subscribeToMailingList(params: {
  email: string;
  firstName?: string;
  source: SignupSource;
  recipeDay?: number;
}): Promise<{ ok: boolean; record?: SubscriberRecord; error?: string }> {
  const normalizedEmail = params.email.trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const record: SubscriberRecord = {
    email: normalizedEmail,
    firstName: params.firstName?.trim() || undefined,
    source: params.source,
    recipeDay: params.recipeDay,
    subscribedAtIso: new Date().toISOString(),
    senderName: SITE_CONFIG.senderName,
    siteUrl: SITE_CONFIG.siteUrl,
  };

  // Persist locally so returning visitors are recognized across Home & Recipe PDF gates
  try {
    window.localStorage.setItem(STORAGE_KEY_SUBSCRIBER, JSON.stringify(record));
    const existingRaw = window.localStorage.getItem(STORAGE_KEY_LIST);
    const existing: SubscriberRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const deduped = [
      ...existing.filter((item) => item.email !== normalizedEmail),
      record,
    ];
    window.localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(deduped));
  } catch {
    // Non-fatal in private browsing
  }

  // Forward to live mailing list / n8n webhook once configured (§6 & §9)
  if (SITE_CONFIG.mailingListWebhookUrl) {
    try {
      const response = await fetch(SITE_CONFIG.mailingListWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        return {
          ok: false,
          error: 'Could not reach the dispatch list right now. Please try again.',
        };
      }
    } catch {
      return {
        ok: false,
        error: 'Network error while subscribing. Please try again shortly.',
      };
    }
  }

  return { ok: true, record };
}
