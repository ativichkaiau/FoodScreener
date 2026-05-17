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

const MODES: { id: ThemeMode; label: string; icon: string }[] = [
  { id: 'day', label: 'Day', icon: '☀️' },
  { id: 'auto', label: 'Auto', icon: '◐' },
  { id: 'night', label: 'Night', icon: '🌙' },
];

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
    // Cross-tab sync: another tab changed the stored mode.
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

  const selectMode = (next: ThemeMode) => {
    modeRef.current = next;
    setMode(next);
    setIsDark(applyThemeMode(next));
  };

  if (!mounted) {
    return (
      <div className="h-9 w-[148px] rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 opacity-50 cursor-wait" />
    );
  }

  const autoResolvedDark = resolveIsDark('auto');

  return (
    <div
      className="group relative flex items-center gap-0.5 p-1 rounded-full bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm transition-colors duration-700"
      role="radiogroup"
      aria-label="Day / night mode"
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            role="radio"
            aria-checked={active}
            onClick={() => selectMode(m.id)}
            title={
              m.id === 'auto'
                ? `Auto · follows local time (currently ${autoResolvedDark ? 'Night' : 'Day'})`
                : `Force ${m.label}`
            }
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95 focus:outline-none ${
              active
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100'
            }`}
          >
            <span
              className={`text-[12px] leading-none transition-transform duration-500 ${
                active ? 'scale-110' : 'opacity-70'
              } ${m.id === 'auto' && active ? 'animate-spin-slow' : ''}`}
            >
              {m.icon}
            </span>
            <span className="hidden sm:inline leading-none">{m.label}</span>
          </button>
        );
      })}

      <span className="sr-only" aria-live="polite">
        {mode === 'auto'
          ? `Auto mode, currently ${isDark ? 'night' : 'day'}`
          : `${isDark ? 'Night' : 'Day'} mode`}
      </span>
    </div>
  );
}
