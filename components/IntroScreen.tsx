'use client';

import { useEffect, useState } from 'react';
import { THEME_EVENT } from '../app/theme';

// Shows on every reload — no localStorage skip. The user explicitly
// wants the splash to return each time the page loads.

const HOLD_MS = 2200; // visible duration before auto-exit
const FADE_MS = 650; // fade-out animation duration

type Phase = 'visible' | 'exiting' | 'gone';

export default function IntroScreen() {
  const [phase, setPhase] = useState<Phase>('visible');
  const [cycleLabel, setCycleLabel] = useState('DAY_CYCLE');

  // Mirror the theme system so the splash matches the resolved theme live.
  useEffect(() => {
    const sync = () =>
      setCycleLabel(
        document.documentElement.classList.contains('dark')
          ? 'NIGHT_CYCLE'
          : 'DAY_CYCLE',
      );
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  // Auto-dismiss + cleanup unmount after the fade finishes.
  useEffect(() => {
    if (phase !== 'visible') return;
    const autoExit = window.setTimeout(() => setPhase('exiting'), HOLD_MS);
    return () => window.clearTimeout(autoExit);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const remove = window.setTimeout(() => setPhase('gone'), FADE_MS);
    return () => window.clearTimeout(remove);
  }, [phase]);

  // Click / Esc / any key skips the hold and starts the fade.
  useEffect(() => {
    if (phase !== 'visible') return;
    const skip = () => setPhase('exiting');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  if (phase === 'gone') return null;

  const exiting = phase === 'exiting';

  return (
    <div
      onClick={() => phase === 'visible' && setPhase('exiting')}
      role="dialog"
      aria-label="Booting RATION protocol"
      className={`fixed inset-0 z-[200] flex items-center justify-center cursor-pointer select-none bg-[#FAFAFA] dark:bg-[#050505] transition-opacity duration-[650ms] ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionProperty: 'opacity, backdrop-filter' }}
    >
      {/* INTRO ATMOSPHERE — same family as the main page, dimmer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[5%] w-[55%] h-[55%] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-50 bg-gradient-to-br from-blue-400/30 to-purple-400/30 dark:from-blue-600/20 dark:to-[#00A598]/15 animate-aurora" />
        <div className="absolute bottom-[-15%] left-[0%] w-[50%] h-[50%] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-45 bg-gradient-to-tr from-pink-400/25 to-teal-300/25 dark:from-purple-600/15 dark:to-teal-600/15 animate-aurora-rev" />
        <div className="absolute top-[35%] left-[40%] w-[35%] h-[35%] rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-45 bg-gradient-to-br from-amber-300/25 to-rose-300/20 dark:from-indigo-700/20 dark:to-fuchsia-700/15 animate-aurora-slow" />
      </div>

      {/* CENTER STAGE */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* V logo */}
        <div className="intro-pop mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[32px] sm:text-[40px] font-black shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,165,152,0.25)] transition-colors duration-700">
          V
        </div>

        {/* Wordmark */}
        <div
          className="intro-rise font-black tracking-tighter text-[28px] sm:text-[36px] lg:text-[44px] leading-none mb-5 flex items-baseline"
          style={{ animationDelay: '120ms' }}
        >
          <span className="text-neutral-900 dark:text-white transition-colors duration-700">VESTRIPPN</span>
          <span className="text-blue-600 dark:text-blue-400 transition-colors duration-700">3.0</span>
        </div>

        {/* ///RATION pill + screening matrix */}
        <div
          className="intro-rise flex items-center gap-3 mb-8 text-[16px] sm:text-[20px] font-black tracking-tighter"
          style={{ animationDelay: '240ms' }}
        >
          <span className="shimmer-sweep relative overflow-hidden shrink-0 whitespace-nowrap italic text-white dark:text-black bg-neutral-900 dark:bg-white px-2.5 py-1 rounded-[10px] shadow-sm border border-black/5 dark:border-white/5 leading-none transition-colors duration-700">
            {'///RATION'}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 transition-colors duration-700">
            Screening Matrix
          </span>
        </div>

        {/* Progress bar — fills over the hold duration */}
        <div
          className="intro-rise w-[220px] sm:w-[280px] h-[3px] rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-4"
          style={{ animationDelay: '360ms' }}
        >
          <div
            className={`h-full bg-[#00A598] origin-left ${exiting ? '' : 'intro-progress'} shadow-[0_0_12px_rgba(0,165,152,0.6)]`}
          />
        </div>

        {/* Boot caption */}
        <p
          className="intro-rise font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 transition-colors duration-700"
          style={{ animationDelay: '420ms' }}
        >
          <span className="tabular-nums">{cycleLabel}</span>
          {' // '}
          <span className="text-[#00A598] font-bold">
            Booting RATION Protocol<span className="intro-dots" aria-hidden="true" />
          </span>
        </p>

        {/* Tap hint */}
        <p
          className="intro-rise mt-10 font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-600 animate-pulse"
          style={{ animationDelay: '900ms' }}
        >
          Tap to engage
        </p>
      </div>

      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 intro-scanlines opacity-40 dark:opacity-25" />
    </div>
  );
}
