// Shared client-side theme logic for the auto day/night system.
// NOTE: the FOUC-prevention init in app/layout.tsx duplicates the tiny
// resolve logic as an inline string because it must run before any module
// loads. Keep NIGHT_START / NIGHT_END in sync with that script.

export type ThemeMode = 'auto' | 'day' | 'night';

export const THEME_STORAGE_KEY = 'theme-mode';
export const THEME_EVENT = 'themechange';

// Night runs 18:00 -> 05:59 local time.
const NIGHT_START = 18;
const NIGHT_END = 6;

export interface ThemeChangeDetail {
  mode: ThemeMode;
  isDark: boolean;
}

export function isNightHour(date: Date = new Date()): boolean {
  const h = date.getHours();
  return h >= NIGHT_START || h < NIGHT_END;
}

export function resolveIsDark(mode: ThemeMode, date: Date = new Date()): boolean {
  if (mode === 'day') return false;
  if (mode === 'night') return true;
  return isNightHour(date);
}

export function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const v = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'day' || v === 'night' || v === 'auto') return v;
  } catch {
    /* private mode / blocked storage */
  }
  return 'auto';
}

// Single source of truth: persists the mode, syncs the <html> class + dataset,
// and broadcasts so other mounted components can react without prop drilling.
export function applyThemeMode(mode: ThemeMode): boolean {
  const isDark = resolveIsDark(mode);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.dataset.themeMode = mode;
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(
    new CustomEvent<ThemeChangeDetail>(THEME_EVENT, { detail: { mode, isDark } }),
  );
  return isDark;
}

// While in auto mode, re-check on an interval so the theme flips across the
// 06:00 / 18:00 boundary on its own. Returns a cleanup fn.
export function startAutoSync(
  getMode: () => ThemeMode,
  onFlip: (isDark: boolean) => void,
): () => void {
  const tick = () => {
    if (getMode() !== 'auto') return;
    const shouldBeDark = resolveIsDark('auto');
    const isDark = document.documentElement.classList.contains('dark');
    if (shouldBeDark !== isDark) {
      applyThemeMode('auto');
      onFlip(shouldBeDark);
    }
  };
  const id = window.setInterval(tick, 30_000);
  return () => window.clearInterval(id);
}
