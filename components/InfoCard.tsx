'use client';

import { useEffect, useState } from 'react';
import { THEME_EVENT } from '../app/theme';

// "Operating Brief" — a deliberately information-dense, left-aligned spec
// readout. Unlike the inspiration's hero card pattern (centered, huge
// headline, two big CTAs, product chip row), this is a compact technical
// brief: thin metadata header + 3-column input/method/output, no CTAs, no
// large display type. Designed to live on every tab as a steady orientation
// strip, not a re-pitch of the product.

export default function InfoCard() {
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

  return (
    <section
      aria-labelledby="operating-brief-heading"
      className="glass-surface rounded-[20px] lg:rounded-[24px] bg-white/55 dark:bg-white/[0.04] border border-white/40 dark:border-white/10 p-5 lg:p-7 transition-all duration-700"
    >
      {/* Header — metadata strip, not a hero */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/10">
        <h3
          id="operating-brief-heading"
          className="flex items-center gap-2 font-bold text-[13px] tracking-tight text-neutral-900 dark:text-white transition-colors duration-700"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[#00A598] opacity-70 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#00A598]"></span>
          </span>
          Operating Brief
          <span className="ml-1 text-[9px] font-black text-[#00A598] border border-[#00A598]/30 bg-[#00A598]/10 px-1.5 py-0.5 rounded uppercase tracking-widest">
            v3.0
          </span>
        </h3>
        <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-500 transition-colors duration-700">
          ration-matrix
          <span className="opacity-50">{' · '}</span>
          suan-dok node
          <span className="opacity-50">{' · '}</span>
          <span className="text-[#00A598] font-bold tabular-nums">{cycle}</span>
        </div>
      </div>

      {/* Three-column technical body */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 pt-5">
        {/* INPUT VECTORS */}
        <div className="space-y-3 sm:pr-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 transition-colors duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Input Vectors
          </div>
          <ul className="space-y-1.5 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300 transition-colors duration-700">
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">→</span>
              <span>
                <span className="font-bold">Radius dial</span> · 0.5 → 10 km
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">→</span>
              <span>
                <span className="font-bold">Capital ceiling</span> · ≤100 / ≤500 / ≤1000+ THB
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">→</span>
              <span>
                <span className="font-bold">Time-of-day</span> · auto-resolved
              </span>
            </li>
          </ul>
        </div>

        {/* MATRIX SWEEP — column with side dividers on sm+ */}
        <div className="space-y-3 sm:px-6 sm:border-x sm:border-black/5 sm:dark:border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00A598] transition-colors duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A598]"></span>
            Matrix Sweep
          </div>
          <ul className="space-y-1.5 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300 transition-colors duration-700">
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">⇆</span>
              <span>
                <span className="font-bold">16 sectors</span> · fetched in parallel
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">⇆</span>
              <span>
                <span className="font-bold">Dual fetch</span> · wide radius + rank-by-distance
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">⇆</span>
              <span>
                <span className="font-bold">Dedupe → rate</span> · rating-sorted
              </span>
            </li>
          </ul>
        </div>

        {/* OUTPUT EXTRACT */}
        <div className="space-y-3 sm:pl-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 transition-colors duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Output Extract
          </div>
          <ul className="space-y-1.5 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-300 transition-colors duration-700">
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">◉</span>
              <span>
                <span className="font-bold">1 primary target</span> · acquired
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">◉</span>
              <span>
                <span className="font-bold">Secondary vectors</span> · category-grouped
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400 dark:text-neutral-600 font-mono">◉</span>
              <span>
                <span className="font-bold">Reroll</span> · map handoff
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer status strip */}
      <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-500 transition-colors duration-700">
        <span>
          <span className="text-[#00A598] font-bold">●</span>{' '}
          Engine nominal
        </span>
        <span>
          Powered by Google Places
          <span className="opacity-50">{' · '}</span>
          Built for the Suan Dok grid
        </span>
      </div>
    </section>
  );
}
