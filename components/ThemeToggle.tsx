'use client';

import { useEffect, useRef, useState } from 'react';
import {
  type ThemeMode,
  THEME_EVENT,
  THEME_STORAGE_KEY,
  applyThemeMode,
  getStoredMode,
  resolveIsDark,
  startAutoSync,
} from '../app/theme';

// Single-pill cycle toggle: Auto → Day → Night → Auto.
const ORDER: readonly ThemeMode[] = ['auto', 'day', 'night'] as const;
const META: Record<ThemeMode, { label: string; icon: string }> = {
  auto: { label: 'Auto', icon: '◐' },
  day: { label: 'Day', icon: '☀️' },
  night: { label: 'Night', icon: '🌙' },
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(false);
  const modeRef = useRef<ThemeMode>('auto');

  useEffect(() => {
    setMounted(true);
    const stored = getStoredMode();
    modeRef.current = stored;
    setMode(stored);
    setIsDark(document.documentElement.classList.contains('dark'));

    const onThemeChange = () => {
      const m = getStoredMode();
      modeRef.current = m;
      setMode(m);
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) {
        applyThemeMode(getStoredMode());
      }
    };

    window.addEventListener(THEME_EVENT, onThemeChange);
    window.addEventListener('storage', onStorage);
    const stopAutoSync = startAutoSync(
      () => modeRef.current,
      (dark) => setIsDark(dark),
    );

    return () => {
      window.removeEventListener(THEME_EVENT, onThemeChange);
      window.removeEventListener('storage', onStorage);
      stopAutoSync();
    };
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(modeRef.current) + 1) % ORDER.length];
    modeRef.current = next;
    setMode(next);
    setIsDark(applyThemeMode(next));
  };

  if (!mounted) {
    return (
      <div className="h-11 w-[96px] rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 opacity-50 cursor-wait" />
    );
  }

  const m = META[mode];
  const autoResolvedDark = resolveIsDark('auto');
  const title =
    mode === 'auto'
      ? `Auto · follows local time (currently ${autoResolvedDark ? 'Night' : 'Day'}). Click to cycle to Day.`
      : mode === 'day'
        ? 'Day · click to cycle to Night'
        : 'Night · click to cycle to Auto';

  return (
    <button
      type="button"
      onClick={cycle}
      title={title}
      aria-label={`Mode: ${m.label}. Click to cycle.`}
      className="clay-button flex flex-col items-center justify-center px-5 py-1.5 rounded-full bg-white/80 dark:bg-white/[0.06] border border-white/55 dark:border-white/10 backdrop-blur-md font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A598]/40"
    >
      <span className="font-mono text-[8px] uppercase tracking-[0.28em] font-bold text-neutral-500 dark:text-neutral-400 leading-none mb-1">
        Mode
      </span>
      <span className="flex items-center gap-1.5 text-[12px] font-bold text-neutral-900 dark:text-white leading-none">
        <span>{m.label}</span>
        <span
          className={`text-[13px] leading-none ${mode === 'auto' ? 'animate-spin-slow inline-block' : ''}`}
          aria-hidden="true"
        >
          {m.icon}
        </span>
      </span>
      <span className="sr-only" aria-live="polite">
        {mode === 'auto'
          ? `Auto mode, currently ${isDark ? 'night' : 'day'}`
          : `${isDark ? 'Night' : 'Day'} mode`}
      </span>
    </button>
  );
}
