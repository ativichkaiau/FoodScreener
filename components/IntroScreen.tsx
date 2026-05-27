'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const FADE_MS = 520;

type Phase = 'visible' | 'exiting' | 'gone';

const introSteps = [
  {
    eyebrow: '01',
    label: 'SCAN',
    title: 'Open the Food Matrix',
    copy: 'Start from Suan Dok Grid and watch the system map nearby food signals before any choice is made.',
    badge: 'Radius sweep',
  },
  {
    eyebrow: '02',
    label: 'FILTER',
    title: 'Tune hunger constraints',
    copy: 'Distance, cost, and category weight the signal so the matrix ignores noise and keeps useful targets in range.',
    badge: 'Cost gate',
  },
  {
    eyebrow: '03',
    label: 'SELECT',
    title: 'Lock a ration target',
    copy: 'The matrix isolates one primary option, keeps alternates ready, and lets you reroll the grid when the mission changes.',
    badge: 'Target lock',
  },
] as const;

export default function IntroScreen() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('visible');
  const [step, setStep] = useState(0);

  const current = introSteps[step];
  const isLast = step === introSteps.length - 1;
  const exiting = phase === 'exiting';

  const diagramClass = useMemo(() => `intro-map intro-map-${step + 1}`, [step]);

  useEffect(() => {
    dialogRef.current?.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const remove = window.setTimeout(() => setPhase('gone'), FADE_MS);
    return () => window.clearTimeout(remove);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'visible') return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPhase('exiting');
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        if (isLast) setPhase('exiting');
        else setStep((value) => Math.min(value + 1, introSteps.length - 1));
        return;
      }

      if (event.key === 'ArrowRight') {
        setStep((value) => Math.min(value + 1, introSteps.length - 1));
        return;
      }

      if (event.key === 'ArrowLeft') {
        setStep((value) => Math.max(value - 1, 0));
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast, phase]);

  if (phase === 'gone') return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Food Matrix introduction"
      className={`fixed inset-0 z-[200] isolate overflow-hidden bg-[#080807] text-white transition-opacity duration-[520ms] ease-out ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:88px_88px] opacity-35" />
        <div className="absolute -left-[18%] -top-[16%] h-[58%] w-[52%] rounded-full bg-[radial-gradient(circle,rgba(244,181,78,0.28),transparent_68%)] blur-[90px] animate-aurora" />
        <div className="absolute -right-[12%] bottom-[-18%] h-[58%] w-[48%] rounded-full bg-[radial-gradient(circle,rgba(92,78,174,0.28),transparent_70%)] blur-[100px] animate-aurora-rev" />
        <div className="absolute left-[36%] top-[26%] h-[44%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(0,165,152,0.18),transparent_68%)] blur-[110px] animate-aurora-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(0,0,0,0.28)_60%,rgba(0,0,0,0.72)_100%)]" />
      </div>

      <button
        type="button"
        onClick={() => setPhase('exiting')}
        className="absolute right-5 top-5 z-20 rounded-full border border-white/12 bg-white/[0.035] px-5 py-2 text-[12px] font-black uppercase tracking-[0.18em] text-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:border-[#F3BF5B]/45 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F3BF5B]/50 sm:right-8 sm:top-8"
      >
        Skip Intro
      </button>

      <div className="relative z-10 flex h-full items-center justify-center px-4 py-3 sm:px-6 lg:px-10">
        <section className="intro-sequence-card w-full max-w-[860px] rounded-[26px] border border-white/12 bg-[#101414]/72 px-5 py-5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:px-7 sm:py-6 lg:px-8">
          <div className="text-center">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#F3BF5B]/82">
              Food Matrix Orientation
            </p>
            <h1 className="text-[34px] font-black leading-[0.95] tracking-tight text-white sm:text-[46px] lg:text-[52px]">
              Ration <span className="text-[#F3BF5B]">Targeting</span> Matrix
            </h1>
            <p className="mx-auto mt-2.5 max-w-[620px] text-[14px] font-semibold leading-relaxed text-white/62 sm:text-[15px]">
              Scan the grid. Filter the signal. Pick the table.
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-[#071011]/68 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.35)] sm:mt-5">
            <div className={diagramClass} aria-hidden="true">
              <div className="intro-map-grid" />
              <div className="intro-map-node intro-map-home">
                <span>V</span>
              </div>
              <div className="intro-map-node intro-map-scan">
                <span />
              </div>
              <div className="intro-map-node intro-map-target">
                <span />
              </div>
              <div className="intro-map-route intro-route-base" />
              <div className="intro-map-route intro-route-active" />
              <div className="intro-map-route intro-route-dashed" />
              <div className="intro-map-arrow" />
              <div className="intro-map-label intro-label-home">Suan Dok</div>
              <div className="intro-map-label intro-label-scan">Scan Ring</div>
              <div className="intro-map-label intro-label-target">Food Target</div>
              <div className="intro-map-badge">{current.badge}</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-4 text-[#F3BF5B]">
              <span className="font-mono text-[13px] font-black tracking-[0.18em]">{current.eyebrow}</span>
              <span className="h-px w-9 bg-[#F3BF5B]/55" />
              <span className="text-[13px] font-black uppercase tracking-[0.2em]">{current.label}</span>
            </div>
            <h2 className="mt-2 text-[23px] font-black tracking-tight text-white sm:text-[27px]">
              {current.title}
            </h2>
            <p className="mt-1.5 max-w-[780px] text-[15px] font-semibold leading-relaxed text-white/64 sm:text-[16px]">
              {current.copy}
            </p>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {introSteps.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setStep(index)}
                    aria-label={`Go to intro step ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === step
                        ? 'w-14 bg-[#F3BF5B] shadow-[0_0_22px_rgba(243,191,91,0.6)]'
                        : index < step
                          ? 'w-9 bg-[#F3BF5B]/55'
                          : 'w-9 bg-white/14 hover:bg-white/24'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((value) => Math.max(value - 1, 0))}
                  className="min-w-[100px] rounded-full border border-white/12 bg-white/[0.025] px-6 py-3 text-[15px] font-black text-white/70 transition hover:border-white/24 hover:text-white disabled:pointer-events-none disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isLast) setPhase('exiting');
                    else setStep((value) => Math.min(value + 1, introSteps.length - 1));
                  }}
                  className="min-w-[112px] rounded-full bg-[#F3BF5B] px-6 py-3 text-[15px] font-black text-[#161109] shadow-[0_15px_40px_rgba(243,191,91,0.28)] transition hover:bg-[#ffd37a] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F3BF5B]/55"
                >
                  {isLast ? 'Begin' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
