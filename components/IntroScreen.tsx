'use client';

import { useEffect, useState } from 'react';
import { THEME_EVENT } from '../app/theme';

// Hand-drawn-feel food map. A sketchy SVG (wobble via feTurbulence) with
// a paper rectangle, three wavy roads, four dashed teal walking routes
// radiating from the centre Suan Dok pin, and four colored food pins
// (noodle bowl / coffee / rice / chili) with simple line icons. The
// V-pin in the middle is rendered as a React overlay so the existing
// theme tokens (bg-neutral-900 dark:bg-white) work cleanly.
function HandDrawnFoodMap() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <svg
        viewBox="0 0 440 220"
        className="block w-full h-auto text-neutral-500 dark:text-neutral-500"
        aria-hidden="true"
      >
        <defs>
          <filter id="introMapSketch" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="0.026" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>

        {/* Paper border + wobbly roads */}
        <g filter="url(#introMapSketch)" opacity="0.4">
          <rect x="8" y="8" width="424" height="204" rx="14"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeDasharray="5 4" strokeLinecap="round" />
          <path d="M 12 115 Q 120 108 220 100 T 428 118"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 150 12 Q 160 70 150 110 T 165 208"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M 300 12 Q 290 75 305 110 T 290 208"
            fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Dashed teal walking routes — V to each food pin */}
        <g filter="url(#introMapSketch)" stroke="#00A598" fill="none"
          strokeWidth="1.6" strokeDasharray="3 4" strokeLinecap="round" opacity="0.85">
          <path d="M 220 110 Q 160 80 95 55" />
          <path d="M 220 110 Q 290 85 355 50" />
          <path d="M 220 110 Q 300 145 365 185" />
          <path d="M 220 110 Q 145 145 80 185" />
        </g>

        {/* Food pin: noodle bowl (top-left, amber) */}
        <g transform="translate(95, 55)">
          <circle r="15" fill="#F59E0B" />
          <circle r="15" fill="none" stroke="white" strokeWidth="2" />
          <line x1="-8" y1="-1" x2="8" y2="-1" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M -7 0 Q 0 7 7 0" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="3" y1="-8" x2="6" y2="-2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="5" y1="-8" x2="7" y2="-2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* Food pin: coffee cup (top-right, violet) */}
        <g transform="translate(355, 50)">
          <circle r="15" fill="#8B5CF6" />
          <circle r="15" fill="none" stroke="white" strokeWidth="2" />
          <path d="M -5 -4 L -5 4 Q -5 6 -3 6 L 3 6 Q 5 6 5 4 L 5 -4 Z"
            fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M 5 -2 Q 8 -2 8 1 Q 8 4 5 4" fill="none" stroke="white" strokeWidth="1.4" />
          <path d="M -2 -8 Q -3 -10 -2 -12" fill="none" stroke="white" strokeWidth="1.4"
            strokeLinecap="round" opacity="0.85" />
          <path d="M 2 -8 Q 1 -10 2 -12" fill="none" stroke="white" strokeWidth="1.4"
            strokeLinecap="round" opacity="0.85" />
        </g>

        {/* Food pin: rice bowl (bottom-right, emerald) */}
        <g transform="translate(365, 185)">
          <circle r="15" fill="#10B981" />
          <circle r="15" fill="none" stroke="white" strokeWidth="2" />
          <path d="M -8 0 L 8 0 Q 7 5 0 7 Q -7 5 -8 0 Z" fill="white" />
          <circle cx="-3" cy="-3" r="1.2" fill="white" />
          <circle cx="0" cy="-4" r="1.2" fill="white" />
          <circle cx="3" cy="-3" r="1.2" fill="white" />
        </g>

        {/* Food pin: chili (bottom-left, red) */}
        <g transform="translate(80, 185)">
          <circle r="15" fill="#EF4444" />
          <circle r="15" fill="none" stroke="white" strokeWidth="2" />
          <path d="M -3 -5 Q 4 -2 4 4 Q 2 8 -2 8 Q -5 4 -3 -5 Z" fill="white" />
          <path d="M -3 -5 Q -1 -8 2 -8" fill="none" stroke="white"
            strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Compass N (top-right corner) */}
        <g transform="translate(412, 28)" opacity="0.45">
          <text x="0" y="0" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">N</text>
          <path d="M 0 4 L 0 14 M -3 11 L 0 14 L 3 11"
            stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      {/* V pin overlay at SVG centre — uses Tailwind for theme tokens */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[20px] sm:text-[22px] font-black shadow-[0_8px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_28px_rgba(0,165,152,0.35)] transition-colors duration-700">
          V
        </div>
        <div className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          Suan Dok
        </div>
      </div>
    </div>
  );
}

// PRE-FLIGHT — single-screen cinematic boot sequence. Returns on every
// reload (no localStorage skip). Auto-advances and dismisses so users
// don't have to click through; Esc / Enter / Space / click anywhere
// also skips. Echoes the hero's voice ("Where to eat, decided.") in the
// main app's teal palette + glass aesthetic.

const HOLD_MS = 3200; // visible duration before auto-exit
const FADE_MS = 600; // fade-out duration

type Phase = 'visible' | 'exiting' | 'gone';

const bootLog = [
  { delay: 700, label: 'Mapping the Suan Dok kitchen perimeter' },
  { delay: 950, label: 'Surveying 16 cuisine sectors in parallel' },
  { delay: 1200, label: 'Tapping the live restaurant feed' },
  { delay: 1450, label: 'Reading the day-vs-night meal rhythm' },
  { delay: 1700, label: 'Ration locked — your fork is ready' },
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
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 px-4 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.05] border border-white/55 dark:border-white/10 backdrop-blur-md shadow-sm font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-300 hover:text-[#00A598] dark:hover:text-[#00A598] transition-colors"
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
        className="glass-surface relative z-10 mx-5 w-full max-w-[640px] rounded-[28px] bg-white/55 dark:bg-white/[0.04] backdrop-blur-xl border border-white/45 dark:border-white/10 px-6 py-8 sm:px-10 sm:py-10"
      >
        {/* Hand-drawn food map (now also contains the V centre pin) */}
        <div className="intro-pop mb-4 sm:mb-5">
          <HandDrawnFoodMap />
        </div>

        {/* Wordmark */}
        <div
          className="intro-rise flex items-baseline justify-center font-black tracking-tighter text-[22px] sm:text-[28px] leading-none mb-3"
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
          className="intro-rise text-center font-black tracking-tighter leading-[0.95] text-[22px] sm:text-[28px] mb-5"
          style={{ animationDelay: '360ms' }}
        >
          <span className="text-neutral-900 dark:text-white transition-colors duration-700">Where to eat, </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#0ec3b4] via-[#00A598] to-[#057f76]">decided</span>
          <span className="text-[#00A598]">.</span>
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
