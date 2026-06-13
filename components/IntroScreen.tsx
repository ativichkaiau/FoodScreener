'use client';

import { useEffect, useState } from 'react';

const STEP_MS = 1800;
const FINAL_STEP_MS = 2200;
const FADE_MS = 600;
const AUTO_EXIT_MS = STEP_MS * 2 + FINAL_STEP_MS;

type Phase = 'visible' | 'exiting' | 'gone';

const introSteps = [
  {
    kicker: '01 - Area',
    title: 'Set the search range',
    copy: 'Start with the distance and budget that make sense for this meal.',
    status: 'Area ready',
  },
  {
    kicker: '02 - Shortlist',
    title: 'Compare nearby options',
    copy: 'Keep the useful signals in view: category, rating, distance, and price.',
    status: 'Options sorted',
  },
  {
    kicker: '03 - Pick',
    title: 'Choose one place',
    copy: 'Lead with one clear recommendation while keeping alternates close by.',
    status: 'Pick ready',
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
      className="intro-rise mx-auto mt-6 w-full max-w-[620px] rounded-[22px] border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0b1110] sm:p-4"
      style={{ animationDelay: '150ms' }}
      aria-hidden="true"
    >
      <div className="relative h-[184px] overflow-hidden rounded-[18px] border border-black/10 bg-[#f7f8f4] dark:border-white/10 dark:bg-[#101816] sm:h-[202px]">
        <div className="absolute left-[6%] top-[10%] font-mono text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 sm:text-[10px]">
          Suan Dok area
        </div>

        <div className="absolute left-[5%] top-[28%] h-[54%] w-[43%] rounded-[14px] border border-black/10 bg-white dark:border-white/10 dark:bg-[#0c1413] sm:left-[6%] sm:w-[37%]">
          <div className="absolute left-[11%] top-[34%] h-[3px] w-[79%] rotate-[-8deg] rounded-full bg-neutral-300 dark:bg-[#31413f]" />
          <div className="absolute left-[9%] top-[61%] h-[3px] w-[82%] rotate-[6deg] rounded-full bg-neutral-300 dark:bg-[#31413f]" />
          <div className="absolute left-[34%] top-[8%] h-[84%] w-[3px] rotate-[3deg] rounded-full bg-neutral-300 dark:bg-[#31413f]" />
          <div className="absolute left-[68%] top-[10%] h-[80%] w-[3px] rotate-[-5deg] rounded-full bg-neutral-300 dark:bg-[#31413f]" />
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 220 120"
            preserveAspectRatio="none"
          >
            <path
              className="food-route-line"
              d="M24 86 C56 58 76 76 102 45 S158 34 193 24"
              fill="none"
              stroke="#00A598"
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
                className={`absolute ${positions[index]} transition-all duration-300 ${
                  isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-45'
                }`}
              >
                <span className={`block h-4 w-4 rounded-full border-2 border-white dark:border-[#0c1413] ${target.tone}`} />
              </div>
            );
          })}
        </div>

        <div className="absolute left-[44%] top-[19%] hidden w-[20%] space-y-2 sm:block">
          {['3.0 km', '< 1000 THB', 'Open now'].map((filter, index) => (
            <div
              key={filter}
              className={`rounded-full border px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.12em] ${
                index <= stepIndex
                  ? 'border-[#00A598]/50 bg-[#00A598]/10 text-[#007d74] dark:text-[#5eead4]'
                  : 'border-black/10 bg-white text-neutral-400 dark:border-white/10 dark:bg-[#0c1413] dark:text-neutral-500'
              }`}
            >
              {filter}
            </div>
          ))}
        </div>

        <div className="absolute bottom-[14%] left-[46%] hidden w-[18%] rounded-[14px] border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0c1413] sm:block">
          <div className="mb-1 font-mono text-[8px] font-black uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Shortlist
          </div>
          {targetCards.map((target, index) => (
            <div
              key={target.name}
              className={`mb-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 ${
                index === stepIndex
                  ? 'bg-[#00A598]/10 text-neutral-950 dark:text-white'
                  : 'text-neutral-500 dark:text-neutral-500'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${target.tone}`} />
              <span className="truncate text-[9px] font-black">{target.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute right-[5%] top-[15%] h-[70%] w-[43%] rounded-[16px] border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#0c1413] sm:right-[6%] sm:w-[30%]">
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-[8px] font-black uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Primary pick
            </div>
            <div className="rounded-full border border-[#00A598]/40 px-2 py-0.5 font-mono text-[8px] font-black text-[#007d74] dark:text-[#5eead4]">
              4.6
            </div>
          </div>

          <div className="relative mx-auto mt-2 h-14 w-14 sm:h-16 sm:w-16">
            <div className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-[#172421]" />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#f7ead0]" />
            <div className="absolute left-[28%] top-[38%] h-4 w-7 rounded-full bg-[#f6c85f]" />
            <div className="absolute left-[46%] top-[31%] h-5 w-5 rounded-full bg-[#5eead4]" />
            <div className="absolute right-[23%] top-[45%] h-3 w-5 rounded-full bg-[#ff8f70]" />
            <div className="absolute bottom-[13%] left-[24%] h-[3px] w-12 rotate-[-20deg] rounded-full bg-neutral-400 dark:bg-[#c9d4d0]" />
          </div>

          <div className="mt-2 text-[13px] font-black leading-tight text-neutral-950 dark:text-white sm:text-[15px]">
            Khao Soi Spot
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[8px] font-black uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
            <span>0.8 km</span>
            <span className="text-[#b78a12] dark:text-[#f6c85f]">฿฿</span>
          </div>
          <div
            className={`mt-2 h-1.5 rounded-full ${
              stepIndex === 2 ? 'bg-[#f6c85f]' : 'bg-neutral-200 dark:bg-[#314449]'
            }`}
          />
        </div>

        <div className="absolute bottom-[9%] left-[26%] -translate-x-1/2 rounded-full border border-[#00A598]/35 bg-white px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#007d74] shadow-sm dark:bg-[#0c1413] dark:text-[#5eead4] sm:text-[10px]">
          {status}
        </div>
      </div>
    </div>
  );
}

export default function IntroScreen() {
  const [phase, setPhase] = useState<Phase>('visible');
  const [stepIndex, setStepIndex] = useState(0);

  const activeStep = introSteps[stepIndex];
  const isLastStep = stepIndex === introSteps.length - 1;

  const dismiss = () => {
    if (phase === 'visible') setPhase('exiting');
  };

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
    if (phase !== 'visible') return;
    const id = window.setTimeout(() => setPhase('exiting'), AUTO_EXIT_MS);
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
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-label="FoodScreener intro"
      className={`fixed inset-0 z-[200] isolate flex cursor-pointer select-none items-center justify-center overflow-hidden bg-[#f6f7f4] px-4 py-5 text-neutral-950 transition-opacity duration-[600ms] ease-out dark:bg-[#050706] dark:text-white sm:px-6 ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute right-5 top-5 z-20 rounded-full border border-black/10 bg-white px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 dark:hover:text-white sm:right-7 sm:top-7"
      >
        Skip
      </button>

      <section
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-[760px] cursor-default overflow-y-auto rounded-[28px] border border-black/10 bg-white px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)] custom-scrollbar dark:border-white/10 dark:bg-[#091112] dark:shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:rounded-[34px] sm:px-8 sm:py-7 lg:px-10"
      >
        <div className="intro-rise text-center" style={{ animationDelay: '60ms' }}>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#00A598] sm:text-[11px]">
            FoodScreener
          </p>
          <h1 className="mt-3 font-black leading-[0.98] text-[34px] sm:text-[52px] lg:text-[58px]">
            Pick a place to eat.
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[14px] font-bold leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[16px]">
            Radius, budget, ratings, and nearby options in one clean decision flow.
          </p>
        </div>

        <FoodScreenerBoard status={activeStep.status} stepIndex={stepIndex} />

        <div
          className="intro-rise pt-5 sm:pt-6"
          style={{ animationDelay: '260ms' }}
        >
          <div className="flex items-center gap-4 font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#007d74] dark:text-[#5eead4] sm:text-[12px]">
            <span>{activeStep.kicker}</span>
            <span className="h-px w-16 bg-[#00A598]/35" />
          </div>
          <h2 className="mt-3 text-[25px] font-black leading-tight text-neutral-950 dark:text-white sm:text-[34px]">
            {activeStep.title}
          </h2>
          <p className="mt-2 max-w-[650px] text-[15px] font-bold leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[17px]">
            {activeStep.copy}
          </p>
        </div>

        <div className="mt-5 h-px bg-black/10 dark:bg-white/10" />

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
                    ? 'w-16 bg-[#00A598]'
                    : 'w-10 bg-neutral-200 dark:bg-[#334047]'
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
              className="min-w-24 rounded-full border border-black/10 bg-white px-6 py-3 text-[15px] font-black text-neutral-600 transition-colors hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-white sm:min-w-28 sm:text-[17px]"
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
              className="min-w-28 rounded-full bg-[#00A598] px-7 py-3 text-[15px] font-black text-white transition-transform active:scale-95 sm:min-w-32 sm:text-[17px]"
            >
              {isLastStep ? 'Begin' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
