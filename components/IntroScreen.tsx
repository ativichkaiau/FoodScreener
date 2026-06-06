'use client';

import { useEffect, useState } from 'react';
import { THEME_EVENT } from '../app/theme';

const STEP_MS = 1800;
const FINAL_STEP_MS = 2200;
const FADE_MS = 600;

type Phase = 'visible' | 'exiting' | 'gone';

const introSteps = [
  {
    kicker: '01 - Scout',
    title: 'Map the nearby eats',
    copy:
      'Pull the Suan Dok food field into view before hunger turns into guesswork.',
    status: 'Places found',
  },
  {
    kicker: '02 - Screen',
    title: 'Filter what matters',
    copy:
      'Balance distance, price, rating, and category into a shortlist that still feels local.',
    status: 'Budget matched',
  },
  {
    kicker: '03 - Decide',
    title: 'Lock the meal pick',
    copy:
      'Promote one place, keep the backups nearby, and move straight to the map handoff.',
    status: 'Meal locked',
  },
];

const targetCards = [
  { name: 'Khao Soi', meta: '0.8 km', tone: 'bg-[#5eead4]' },
  { name: 'Rice Bar', meta: '< 500 THB', tone: 'bg-[#f6c85f]' },
  { name: 'Noodle Cart', meta: '4.6 rating', tone: 'bg-[#ff8f70]' },
];

function FoodScreenerBoard({
  status,
  stepIndex,
}: {
  status: string;
  stepIndex: number;
}) {
  return (
    <div
      className="intro-rise relative mx-auto mt-5 w-full max-w-[610px] rounded-[22px] border border-[#274043] bg-[#061011] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_24px_70px_rgba(0,0,0,0.34)] sm:mt-6 sm:p-4"
      style={{ animationDelay: '180ms' }}
      aria-hidden="true"
    >
      <div className="relative h-[168px] overflow-hidden rounded-[17px] border border-[#1b2b2d] bg-[#071112] sm:h-[188px]">
        <div className="food-screen-grid absolute inset-0" />
        <div className="food-screen-sweep absolute inset-y-0 left-0 w-1/3" />

        <div className="absolute left-[6%] top-[12%] font-mono text-[9px] font-black uppercase tracking-[0.26em] text-[#9eb0b2] sm:text-[11px]">
          Suan Dok Grid
        </div>

        <div className="absolute left-[5%] top-[28%] h-[54%] w-[42%] rounded-[14px] border border-[#24383b] bg-[#081617]/90 sm:left-[6%] sm:w-[38%]">
          <div className="absolute left-[11%] top-[34%] h-[3px] w-[79%] rotate-[-8deg] rounded-full bg-[#243b3e]" />
          <div className="absolute left-[9%] top-[61%] h-[3px] w-[82%] rotate-[6deg] rounded-full bg-[#243b3e]" />
          <div className="absolute left-[34%] top-[8%] h-[84%] w-[3px] rotate-[3deg] rounded-full bg-[#243b3e]" />
          <div className="absolute left-[68%] top-[10%] h-[80%] w-[3px] rotate-[-5deg] rounded-full bg-[#243b3e]" />
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 220 120"
            preserveAspectRatio="none"
          >
            <path
              className="food-route-line"
              d="M24 86 C56 58 76 76 102 45 S158 34 193 24"
              fill="none"
              stroke="#5eead4"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          {targetCards.map((target, index) => {
            const positions = [
              'left-[18%] top-[64%]',
              'left-[46%] top-[38%]',
              'left-[76%] top-[22%]',
            ];
            const isActive = index <= stepIndex;

            return (
              <div
                key={target.name}
                className={`food-map-pin absolute ${positions[index]} ${
                  isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-45'
                }`}
              >
                <span className={`block h-4 w-4 rounded-full border-2 border-[#071112] ${target.tone}`} />
              </div>
            );
          })}
        </div>

        <div className="absolute left-[44%] top-[18%] hidden w-[20%] space-y-2 sm:block">
          {['0.5-3 km', '< 500 THB', 'Open now'].map((filter, index) => (
            <div
              key={filter}
              className={`rounded-full border px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.14em] ${
                index <= stepIndex
                  ? 'border-[#5eead4]/60 bg-[#0d2a28] text-[#bdfbf2]'
                  : 'border-[#26393d] bg-[#0b1517] text-[#66777a]'
              }`}
            >
              {filter}
            </div>
          ))}
        </div>

        <div className="absolute bottom-[16%] left-[46%] hidden w-[18%] rounded-[14px] border border-[#2a3b3f] bg-[#0b1517] p-2 sm:block">
          <div className="mb-1 font-mono text-[8px] font-black uppercase tracking-[0.18em] text-[#9eb0b2]">
            Shortlist
          </div>
          {targetCards.map((target, index) => (
            <div
              key={target.name}
              className={`mb-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 ${
                index === stepIndex ? 'bg-[#132927] text-white' : 'text-[#6f8083]'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${target.tone}`} />
              <span className="truncate text-[9px] font-black">{target.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute right-[5%] top-[15%] h-[70%] w-[43%] rounded-[16px] border border-[#2b3e40] bg-[#0b1516] p-3 shadow-[0_20px_45px_rgba(0,0,0,0.22)] sm:right-[6%] sm:w-[30%]">
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-[#f6c85f]">
              Primary Pick
            </div>
            <div className="rounded-full border border-[#5eead4]/50 px-2 py-0.5 font-mono text-[8px] font-black text-[#5eead4]">
              4.6
            </div>
          </div>

          <div className="relative mx-auto mt-2 h-14 w-14 sm:h-16 sm:w-16">
            <div className="absolute inset-0 rounded-full bg-[#172426] shadow-[0_0_22px_rgba(246,200,95,0.12)]" />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-[#ecf1e7] bg-[#f7ead0]" />
            <div className="absolute left-[28%] top-[38%] h-4 w-7 rounded-full bg-[#f6c85f]" />
            <div className="absolute left-[46%] top-[31%] h-5 w-5 rounded-full bg-[#5eead4]" />
            <div className="absolute right-[23%] top-[45%] h-3 w-5 rounded-full bg-[#ff8f70]" />
            <div className="absolute bottom-[13%] left-[24%] h-[3px] w-12 rotate-[-20deg] rounded-full bg-[#c9d4d0]" />
          </div>

          <div className="mt-2 text-[13px] font-black leading-tight text-[#f5f7ef] sm:text-[15px]">
            Khao Soi Spot
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-[#9eb0b2]">
            <span>0.8 km</span>
            <span className="text-[#f6c85f]">฿฿</span>
          </div>
          <div
            className={`mt-2 h-1.5 rounded-full ${
              stepIndex === 2 ? 'bg-[#f6c85f]' : 'bg-[#314449]'
            }`}
          />
        </div>

        <div className="absolute bottom-[10%] left-[26%] -translate-x-1/2 rounded-full border border-[#58d8c9] bg-[#082423] px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white shadow-[0_0_18px_rgba(94,234,212,0.15)] sm:text-[10px]">
          {status}
        </div>
      </div>
    </div>
  );
}

export default function IntroScreen() {
  const [phase, setPhase] = useState<Phase>('visible');
  const [cycle, setCycle] = useState('DAY_CYCLE');
  const [stepIndex, setStepIndex] = useState(0);

  const activeStep = introSteps[stepIndex];
  const isLastStep = stepIndex === introSteps.length - 1;

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
    const timeout = stepIndex === introSteps.length - 1 ? FINAL_STEP_MS : STEP_MS;
    const id = window.setTimeout(() => {
      if (stepIndex < introSteps.length - 1) {
        setStepIndex((current) => Math.min(current + 1, introSteps.length - 1));
      } else {
        setPhase('exiting');
      }
    }, timeout);
    return () => window.clearTimeout(id);
  }, [phase, stepIndex]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const id = window.setTimeout(() => setPhase('gone'), FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'visible') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhase('exiting');
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (stepIndex < introSteps.length - 1) {
          setStepIndex((current) => Math.min(current + 1, introSteps.length - 1));
        } else {
          setPhase('exiting');
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, stepIndex]);

  if (phase === 'gone') return null;

  const exiting = phase === 'exiting';

  return (
    <div
      onClick={() => phase === 'visible' && setPhase('exiting')}
      role="dialog"
      aria-modal="true"
      aria-label="RATION food screener intro"
      className={`fixed inset-0 z-[200] isolate flex cursor-pointer select-none items-center justify-center overflow-hidden bg-[#030607] px-4 py-5 text-white transition-opacity duration-[600ms] ease-out sm:px-6 ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_0%_22%,rgba(0,165,152,0.20),transparent_40%),radial-gradient(ellipse_at_100%_82%,rgba(46,80,160,0.24),transparent_43%),linear-gradient(180deg,#030607_0%,#081112_54%,#060914_100%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.09] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:86px_86px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.62)_100%)]" />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (phase === 'visible') setPhase('exiting');
        }}
        className="absolute right-5 top-5 z-20 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#b6c1c3] transition-colors hover:border-[#5eead4]/50 hover:text-[#5eead4] sm:right-7 sm:top-7"
      >
        Skip
      </button>

      <section
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-[760px] cursor-default overflow-y-auto rounded-[28px] border border-[#223033] bg-[#091112]/95 px-5 py-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_30px_90px_rgba(0,0,0,0.54)] custom-scrollbar sm:rounded-[34px] sm:px-8 sm:py-6 lg:px-10"
      >
        <div className="intro-rise text-center" style={{ animationDelay: '60ms' }}>
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.34em] text-[#c7a85e] sm:text-[12px]">
            VESTRIPPN3.0 RATION SCREENING BENCH
          </div>
          <h1 className="mt-3 font-black leading-[0.96] text-[34px] sm:text-[50px] lg:text-[58px]">
            <span className="block text-[#f5f7ef]">RATION</span>
            <span className="block text-[#f6c85f]">Food Screener</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] font-bold leading-relaxed text-[#aeb8b9] sm:text-[16px]">
            Radius, budget, and ratings turned into one clean lunch decision.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#8d9a9d] sm:text-[10px]">
            <span className="rounded-full border border-[#31484b] bg-[#0b191a] px-3 py-1 text-[#5eead4]">
              RATION
            </span>
            <span className="tabular-nums">{cycle}</span>
            <span className="text-[#c7a85e]">Suan Dok Node</span>
          </div>
        </div>

        <FoodScreenerBoard status={activeStep.status} stepIndex={stepIndex} />

        <div
          className="intro-rise pt-5 sm:pt-6"
          style={{ animationDelay: '320ms' }}
        >
          <div className="flex items-center gap-4 font-mono text-[11px] font-black uppercase tracking-[0.3em] text-[#c7a85e] sm:text-[12px]">
            <span>{activeStep.kicker}</span>
            <span className="h-px w-16 bg-[#c7a85e]/55" />
          </div>
          <h2 className="mt-3 text-[26px] font-black leading-tight text-[#f5f7ef] sm:text-[34px]">
            {activeStep.title}
          </h2>
          <p className="mt-2 max-w-[650px] text-[15px] font-bold leading-relaxed text-[#b7c0c1] sm:text-[17px]">
            {activeStep.copy}
          </p>
        </div>

        <div className="mt-5 h-px bg-[#263336]" />

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {introSteps.map((step, index) => (
              <button
                key={step.kicker}
                type="button"
                aria-label={`Show step ${index + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setStepIndex(index);
                }}
                className={`h-3 rounded-full transition-all ${
                  index <= stepIndex
                    ? 'w-16 bg-[#f6c85f] shadow-[0_0_28px_rgba(246,200,95,0.35)]'
                    : 'w-10 bg-[#334047]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                setStepIndex((current) => Math.max(current - 1, 0));
              }}
              className="min-w-24 rounded-full border border-[#2d393d] bg-[#11191d] px-6 py-3 text-[15px] font-black text-[#c8ced0] transition-colors hover:border-[#5eead4]/45 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-28 sm:text-[17px]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isLastStep) {
                  setPhase('exiting');
                } else {
                  setStepIndex((current) => Math.min(current + 1, introSteps.length - 1));
                }
              }}
              className="min-w-28 rounded-full bg-[#f6c85f] px-7 py-3 text-[15px] font-black text-[#10110d] shadow-[0_0_35px_rgba(246,200,95,0.25)] transition-transform active:scale-95 sm:min-w-32 sm:text-[17px]"
            >
              {isLastStep ? 'Begin' : 'Next'}
            </button>
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-0 intro-scanlines opacity-20" />
    </div>
  );
}
