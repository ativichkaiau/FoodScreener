'use client';

import { useEffect, useState } from 'react';
import { THEME_EVENT } from '../app/theme';

// PRE-FLIGHT — single-screen cinematic boot sequence. Returns on every
// reload (no localStorage skip). Auto-advances and dismisses so users
// don't have to click through; Esc / Enter / Space / click anywhere
// also skips. Echoes the hero's voice ("Where to eat, decided.") in the
// main app's teal palette + glass aesthetic.

const HOLD_MS = 3200; // visible duration before auto-exit
const FADE_MS = 600; // fade-out duration

type Phase = 'visible' | 'exiting' | 'gone';

const bootLog = [
  { delay: 700, label: 'Establishing Suan Dok grid telemetry' },
  { delay: 950, label: 'Calibrating 16-sector matrix sweep' },
  { delay: 1200, label: 'Wiring Google Places live feed' },
  { delay: 1450, label: 'Resolving day / night cycle' },
  { delay: 1700, label: 'RATION protocol — engaged' },
];

export default function IntroScreen() {
  const [phase, setPhase] = useState<Phase>('visible');
  const [cycle, setCycle] = useState('DAY_CYCLE');

  useEffect(() => {
    const sync = () =>
      setCycle(
        document.documentElement.classList.contains('dark')
          ? 'NIGHT_CYCLE'
          : 'DAY_CYCLE',
      );
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  useEffect(() => {
    if (phase !== 'visible') return;
    const id = window.setTimeout(() => setPhase('exiting'), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const id = window.setTimeout(() => setPhase('gone'), FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'visible') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        setPhase('exiting');
      }
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
      aria-label="RATION pre-flight"
      className={`fixed inset-0 z-[200] isolate flex items-center justify-center cursor-pointer select-none bg-[#FAFAFA] dark:bg-[#050505] transition-opacity duration-[600ms] ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ATMOSPHERE — teal + indigo + amber whispers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[18%] right-[6%] h-[60%] w-[54%] rounded-full bg-gradient-to-br from-blue-400/25 via-violet-400/20 to-purple-400/25 dark:from-blue-700/22 dark:via-indigo-700/15 dark:to-[#00A598]/18 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-aurora" />
        <div className="absolute -bottom-[18%] -left-[2%] h-[58%] w-[52%] rounded-full bg-gradient-to-tr from-pink-400/25 via-rose-300/15 to-teal-300/25 dark:from-purple-700/18 dark:via-fuchsia-700/12 dark:to-teal-600/18 blur-[130px] mix-blend-multiply dark:mix-blend-screen animate-aurora-rev" />
        <div className="absolute top-[28%] left-[28%] h-[44%] w-[40%] rounded-full bg-gradient-to-br from-amber-300/20 via-orange-300/15 to-[#00A598]/25 dark:from-cyan-700/15 dark:via-sky-700/12 dark:to-indigo-700/15 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-aurora-slow" />
        {/* faint grid */}
        <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.04] bg-[linear-gradient(rgba(15,23,42,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.6)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:88px_88px]" />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.10)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* SKIP — top-right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (phase === 'visible') setPhase('exiting');
        }}
        className="glass-surface absolute top-5 right-5 sm:top-7 sm:right-7 z-20 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.05] border border-white/55 dark:border-white/10 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-300 hover:text-[#00A598] dark:hover:text-[#00A598] transition-colors"
      >
        Skip
      </button>

      {/* PRE-FLIGHT label — top-left */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-20 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-500">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-[#00A598] opacity-75 animate-ping"></span>
          <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#00A598]"></span>
        </span>
        Pre-flight
      </div>

      {/* CENTER CARD */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-surface relative z-10 mx-5 w-full max-w-[640px] rounded-[28px] bg-white/55 dark:bg-white/[0.04] border border-white/45 dark:border-white/10 px-6 py-8 sm:px-10 sm:py-10"
      >
        {/* V logo */}
        <div className="flex justify-center mb-5">
          <div className="intro-pop w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[26px] sm:text-[30px] font-black shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_40px_rgba(0,165,152,0.28)] transition-colors duration-700">
            V
          </div>
        </div>

        {/* Wordmark */}
        <div
          className="intro-rise flex items-baseline justify-center font-black tracking-tighter text-[26px] sm:text-[34px] leading-none mb-3"
          style={{ animationDelay: '120ms' }}
        >
          <span className="text-neutral-900 dark:text-white transition-colors duration-700">VESTRIPPN</span>
          <span className="text-blue-600 dark:text-blue-400 transition-colors duration-700">3.0</span>
        </div>

        {/* RATION pill + node meta */}
        <div
          className="intro-rise flex items-center justify-center gap-2.5 mb-6"
          style={{ animationDelay: '240ms' }}
        >
          <span className="shimmer-sweep relative overflow-hidden shrink-0 whitespace-nowrap italic text-white dark:text-black bg-neutral-900 dark:bg-white px-2.5 py-1 rounded-[10px] shadow-sm border border-black/5 dark:border-white/5 text-[12px] sm:text-[13px] font-black leading-none tracking-wider transition-colors duration-700">
            RATION
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            <span className="tabular-nums">{cycle}</span>
            <span className="opacity-50">{' · '}</span>
            <span className="text-[#00A598] font-bold">SUAN DOK NODE</span>
          </span>
        </div>

        {/* Hero echo */}
        <h2
          className="intro-rise text-center font-black tracking-tighter leading-[0.95] text-[28px] sm:text-[36px] mb-7"
          style={{ animationDelay: '360ms' }}
        >
          <span className="block text-neutral-900 dark:text-white transition-colors duration-700">Where to eat,</span>
          <span className="block italic">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0ec3b4] via-[#00A598] to-[#057f76]">
              decided
            </span>
            <span className="text-[#00A598] not-italic">.</span>
          </span>
        </h2>

        {/* Boot log */}
        <ul className="space-y-1.5 mb-7 font-mono text-[11px] sm:text-[12px] text-neutral-600 dark:text-neutral-400 transition-colors duration-700">
          {bootLog.map((line, i) => (
            <li
              key={line.label}
              className="intro-log-line flex items-center gap-3"
              style={{ animationDelay: `${line.delay}ms` }}
            >
              <span className="font-bold text-[#00A598]">[OK]</span>
              <span className="flex-1">{line.label}</span>
              <span className="font-bold text-[#00A598] tabular-nums">
                {String(i + 1).padStart(2, '0')}/{String(bootLog.length).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ul>

        {/* Progress bar */}
        <div className="h-[3px] rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-[#0ec3b4] via-[#00A598] to-[#057f76] origin-left ${
              exiting ? '' : 'intro-progress'
            } shadow-[0_0_14px_rgba(0,165,152,0.65)]`}
          />
        </div>

        {/* Tap hint */}
        <p className="mt-5 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-neutral-400 dark:text-neutral-600 animate-pulse">
          Tap anywhere or press <span className="text-[#00A598] font-bold">↵</span> to engage
        </p>
      </div>

      {/* Scanlines on top of card too */}
      <div className="pointer-events-none absolute inset-0 intro-scanlines opacity-30 dark:opacity-20" />
    </div>
  );
}
