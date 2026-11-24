import { useEffect, useMemo, useState } from 'react';
import { SITE_CONFIG, type TartanColorway } from './config/siteConfig';
import { buildSafeDoors, loadRawDoors } from './services/doorsService';
import {
  getStoredSubscriber,
  type SubscriberRecord,
} from './services/mailingList';
import {
  clearUnwrappedDays,
  loadUnwrappedDays,
  saveUnwrappedDays,
} from './services/unwrappedStore';
import type { RawDoorRecord } from './types/advent';
import {
  formatEasternNowLabel,
  getSeasonClockState,
  previewDateToEpochMs,
} from './utils/easternTime';
import { AboutNote } from './components/AboutNote';
import { AdventGrid } from './components/AdventGrid';
import { CountdownBanner } from './components/CountdownBanner';
import { EditorialCraft } from './components/EditorialCraft';
import { EmailSignup } from './components/EmailSignup';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RecipePage } from './components/RecipePage';

function parseRouteFromHash(): { page: 'home' } | { page: 'door'; day: number } {
  const hash = window.location.hash.replace(/^#/, '');
  const match = hash.match(/^\/?door\/(\d{1,2})$/);
  if (match) {
    const day = Number(match[1]);
    if (day >= 1 && day <= 25) {
      return { page: 'door', day };
    }
  }
  return { page: 'home' };
}

function getInitialPreviewDate(): string | null {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('preview');
  return previewDateToEpochMs(p) !== null ? p : null;
}

export default function App() {
  const [rawDoors, setRawDoors] = useState<RawDoorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [tartan, setTartan] = useState<TartanColorway>('hunter');
  const [route, setRoute] = useState(parseRouteFromHash);
  const [liveNowMs, setLiveNowMs] = useState<number>(() => Date.now());
  const [previewDate, setPreviewDate] = useState<string | null>(
    getInitialPreviewDate
  );
  const [subscriber, setSubscriber] = useState<SubscriberRecord | null>(() =>
    getStoredSubscriber()
  );
  const [unwrappedDays, setUnwrappedDays] = useState<Set<number>>(() =>
    loadUnwrappedDays()
  );

  // Sync document title with single configurable site name (§1 & §9)
  useEffect(() => {
    if (route.page === 'door') {
      document.title = `Day ${String(route.day).padStart(2, '0')} — ${SITE_CONFIG.siteName}`;
    } else {
      document.title = `${SITE_CONFIG.siteName} — ${SITE_CONFIG.heroLine}`;
    }
  }, [route]);

  // Load single JSON recipe source
  useEffect(() => {
    let active = true;
    loadRawDoors()
      .then((doors) => {
        if (active) {
          setRawDoors(doors);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (active) {
          setLoadError(err.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  // Tick every second for accurate America/Los_Angeles countdown & midnight unlock
  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Listen for hash route changes
  useEffect(() => {
    const handleHashChange = () => setRoute(parseRouteFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Effective Pacific timestamp (live real-time by default, or reviewer preview date)
  const effectiveNowMs = useMemo(() => {
    const previewMs = previewDateToEpochMs(previewDate);
    if (previewMs === null) return liveNowMs;
    // Keep seconds ticking smoothly during preview too
    const secOffset = liveNowMs % 60_000;
    return previewMs + secOffset;
  }, [liveNowMs, previewDate]);

  const clock = useMemo(
    () => getSeasonClockState(effectiveNowMs),
    [effectiveNowMs]
  );

  // Strictly sanitized door list: locked doors are title-free stubs (§3 & §10)
  const safeDoors = useMemo(
    () => buildSafeDoors(rawDoors, effectiveNowMs),
    [rawDoors, effectiveNowMs]
  );

  const navigateHome = () => {
    window.location.hash = '';
    setRoute({ page: 'home' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateDoor = (day: number) => {
    // Ensure directly navigated unlocked doors are recorded as unwrapped
    const target = safeDoors.find((d) => d.day === day);
    if (target && target.kind === 'unlocked' && !unwrappedDays.has(day)) {
      const next = new Set(unwrappedDays);
      next.add(day);
      setUnwrappedDays(next);
      saveUnwrappedDays(next);
    }
    window.location.hash = `/door/${day}`;
    setRoute({ page: 'door', day });
  };

  const handleUnwrapDoor = (day: number) => {
    setUnwrappedDays((prev) => {
      if (prev.has(day)) return prev;
      const next = new Set(prev);
      next.add(day);
      saveUnwrappedDays(next);
      return next;
    });
  };

  const handleResetUnwrapped = () => {
    clearUnwrappedDays();
    setUnwrappedDays(new Set());
  };

  const handleSelectPreviewDate = (isoDate: string | null) => {
    setPreviewDate(isoDate);
    const url = new URL(window.location.href);
    if (isoDate) {
      url.searchParams.set('preview', isoDate);
    } else {
      url.searchParams.delete('preview');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="app-shell">
      <Header
        tartan={tartan}
        onChangeTartan={setTartan}
        onGoHome={navigateHome}
        isRecipeView={route.page === 'door'}
      />

      {previewDate && (
        <div className="preview-ribbon" role="status">
          <div className="container preview-ribbon__inner">
            <span>
              <strong>Editorial Date Preview:</strong> Viewing calendar as{' '}
              {formatEasternNowLabel(effectiveNowMs)} ({clock.unlockedCount}/25
              doors open)
            </span>
            <button
              type="button"
              className="preview-ribbon__reset"
              onClick={() => handleSelectPreviewDate(null)}
            >
              Return to Live Pacific Time
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <main
          className="sealed-page"
          style={{ textAlign: 'center', color: 'var(--ivory-muted)' }}
        >
          <p className="eyebrow">Preparing the 25 Doors…</p>
        </main>
      ) : loadError ? (
        <main className="sealed-page">
          <div className="sealed-card tartan-hunter">
            <div className="sealed-card__inner">
              <span className="eyebrow">Data Source Unavailable</span>
              <p style={{ color: 'var(--ivory-muted)' }}>{loadError}</p>
            </div>
          </div>
        </main>
      ) : route.page === 'door' ? (
        <RecipePage
          door={safeDoors.find((d) => d.day === route.day)}
          allDoors={safeDoors}
          tartan={tartan}
          subscriber={subscriber}
          onSubscribed={setSubscriber}
          onClearSubscriber={() => setSubscriber(null)}
          onGoHome={navigateHome}
          onOpenDoor={navigateDoor}
        />
      ) : (
        <main>
          <Hero
            todaysDoor={clock.todaysDoor}
            isTodayUnwrapped={
              clock.todaysDoor !== null && unwrappedDays.has(clock.todaysDoor)
            }
            onOpenDoor={navigateDoor}
          />

          <CountdownBanner
            clock={clock}
            doors={safeDoors}
            unwrappedDays={unwrappedDays}
            onOpenDoor={navigateDoor}
          />

          <div className={`tartan-band tartan-${tartan}`} aria-hidden="true" />

          <AdventGrid
            doors={safeDoors}
            todaysDoor={clock.todaysDoor}
            unwrappedDays={unwrappedDays}
            tartan={tartan}
            onUnwrapDoor={handleUnwrapDoor}
            onOpenDoor={navigateDoor}
          />

          <EditorialCraft />

          <div className={`tartan-band tartan-${tartan}`} aria-hidden="true" />

          <EmailSignup
            subscriber={subscriber}
            onSubscribed={setSubscriber}
          />

          <AboutNote />
        </main>
      )}

      <Footer
        previewDate={previewDate}
        effectiveNowMs={effectiveNowMs}
        unwrappedCount={unwrappedDays.size}
        onSelectPreviewDate={handleSelectPreviewDate}
        onResetUnwrapped={handleResetUnwrapped}
      />
    </div>
  );
}
