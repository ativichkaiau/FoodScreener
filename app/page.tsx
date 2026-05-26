'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { THEME_EVENT } from './theme';

export default function RationTelemetryPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [cycleTime, setCycleTime] = useState('DAY_CYCLE');

  // --- ENGINE STATE ---
  const [maxDistance, setMaxDistance] = useState<number>(3.0); 
  const [maxCost, setMaxCost] = useState<number>(3); 
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [decision, setDecision] = useState<string | null>(null);

  // --- TACTICAL TARGETING STATE ---
  const [allResults, setAllResults] = useState<any[]>([]);
  const [primaryTarget, setPrimaryTarget] = useState<any | null>(null);
  const [alternativeGroups, setAlternativeGroups] = useState<{ type: string; targets: any[] }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const sync = () =>
      setCycleTime(
        document.documentElement.classList.contains('dark')
          ? 'NIGHT_CYCLE'
          : 'DAY_CYCLE',
      );
    sync();
    window.addEventListener(THEME_EVENT, sync);
    const id = window.setInterval(sync, 30_000);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.clearInterval(id);
    };
  }, []);

  if (!isMounted) return null;

  // --- SMART ENGINE LOGIC ---
  const categorizeResults = (primary: any, backups: any[]) => {
    const grouped = backups.reduce((acc, target) => {
      let category = target.type.replace(/_/g, ' ');
      category = category.replace(/\b\w/g, (c: string) => c.toUpperCase());
      if (!acc[category]) acc[category] = [];
      acc[category].push(target);
      return acc;
    }, {} as Record<string, any[]>);

    const groupedArray = Object.keys(grouped).map(type => ({
      type,
      targets: grouped[type]
    })).sort((a, b) => a.type.localeCompare(b.type));

    setPrimaryTarget(primary);
    setAlternativeGroups(groupedArray);
  };

  const handleSelectTarget = (target: any) => {
    const remaining = allResults.filter(t => t.id !== target.id);
    categorizeResults(target, remaining.slice(0, 14)); 
  };

  const triggerRoulette = (resultsArray: any[]) => {
    if (!resultsArray || resultsArray.length === 0) return;
    const shuffled = [...resultsArray].sort(() => 0.5 - Math.random());
    const primary = shuffled[0];
    const backups = shuffled.slice(1, 15); 
    categorizeResults(primary, backups);
  };

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setPrimaryTarget(null);
    setAlternativeGroups([]);
    setAllResults([]);
    setIsScanned(false);
    setDecision(null);

    try {
      const res = await fetch(`/api/ration?distance=${maxDistance}&cost=${maxCost}`);
      const data = await res.json();

      if (data.error) {
        setPrimaryTarget({ error: data.error });
        setDecision('EXCLUDE');
        setIsScanned(true);
        setIsScanning(false);
        return;
      }

      if (data.results && data.results.length > 0) {
        setAllResults(data.results);
        triggerRoulette(data.results);
        setDecision('INCLUDE / MAYBE');
      } else {
        setPrimaryTarget({ error: "No targets found in specified parameters. Expand grid radius." });
        setDecision('EXCLUDE');
      }
      setIsScanned(true);
    } catch (error) {
      setPrimaryTarget({ error: "Grid scan failed. Network interference." });
      setDecision('EXCLUDE');
      setIsScanned(true);
    }
    setIsScanning(false);
  };

  const handleClear = () => {
    setMaxDistance(3.0);
    setMaxCost(3);
    setPrimaryTarget(null);
    setAlternativeGroups([]);
    setAllResults([]);
    setIsScanned(false);
    setDecision(null);
  };

  const formatCost = (level: number) => {
    if (level === 1) return "≤ 100 THB";
    if (level === 2) return "≤ 500 THB";
    if (level >= 3) return "≤ 1,000+ THB";
    return "Unknown";
  };

  // --- UI RENDER (EXACT SRMA STRUCTURE) ---
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#050505] text-neutral-900 dark:text-neutral-100 relative overflow-hidden font-sans selection:bg-[#00A598]/30 transition-colors duration-700">
      
      {/* DAY/NIGHT ATMOSPHERE — richer 3-blob system */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000">
        {/* Blob 1 — top-right, cool blue → violet (day) / deep indigo → teal (night) */}
        <div className="absolute top-[-12%] right-[8%] w-[62%] h-[62%] bg-gradient-to-br from-blue-400/25 via-violet-400/20 to-purple-400/25 dark:from-blue-700/20 dark:via-indigo-700/15 dark:to-[#00A598]/15 rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-80 dark:opacity-70 transition-all duration-1000 animate-aurora"></div>
        {/* Blob 2 — bottom-left, warm pink → teal (day) / plum → teal (night) */}
        <div className="absolute bottom-[-12%] left-[2%] w-[55%] h-[55%] bg-gradient-to-tr from-pink-400/25 via-rose-300/15 to-teal-300/25 dark:from-purple-700/15 dark:via-fuchsia-700/10 dark:to-teal-600/15 rounded-full blur-[130px] mix-blend-multiply dark:mix-blend-screen opacity-80 dark:opacity-55 transition-all duration-1000 animate-aurora-rev"></div>
        {/* Blob 3 — center-ish, warm amber → rose (day) / cyan → indigo (night) */}
        <div className="absolute top-[28%] left-[28%] w-[44%] h-[44%] bg-gradient-to-br from-amber-300/20 via-orange-300/15 to-rose-300/20 dark:from-cyan-700/15 dark:via-sky-700/10 dark:to-indigo-700/15 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen opacity-65 dark:opacity-55 transition-all duration-1000 animate-aurora-slow"></div>
        {/* NIGHT-ONLY STARFIELD */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-1000 animate-twinkle bg-[radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_70%_20%,rgba(255,255,255,0.5),transparent),radial-gradient(1.5px_1.5px_at_45%_65%,rgba(255,255,255,0.6),transparent),radial-gradient(1px_1px_at_85%_75%,rgba(255,255,255,0.4),transparent),radial-gradient(1px_1px_at_15%_85%,rgba(255,255,255,0.5),transparent),radial-gradient(1px_1px_at_60%_50%,rgba(255,255,255,0.45),transparent),radial-gradient(1.5px_1.5px_at_30%_55%,rgba(255,255,255,0.5),transparent)]"></div>
        {/* Soft vignette to pull focus to center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.4)_100%)] transition-opacity duration-1000"></div>
      </div>

      {/* MINIMALIST HEADER */}
      <header className="glass-surface h-[64px] lg:h-[72px] flex items-center justify-between px-4 lg:px-8 shrink-0 bg-white/55 dark:bg-black/40 z-50 border-b border-white/40 dark:border-white/10 transition-colors duration-700">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="font-black text-[18px] lg:text-[20px] tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center text-[14px] transition-colors duration-700">V</div>
            <div className="flex items-baseline">
              <span>VESTRIPPN</span>
              <span className="text-blue-600 dark:text-blue-400 transition-colors duration-700">3.0</span>
            </div>
          </Link>
        </div>

        <div className="flex gap-4 lg:gap-6 items-center">
          <div className="hidden sm:block font-medium text-[11px] tracking-tight text-neutral-400 dark:text-neutral-500 transition-colors duration-700">
             Suan Dok Grid
          </div>
          <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 hidden sm:block transition-colors duration-700"></div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 lg:p-8 pb-32 lg:pb-8 relative z-10 transition-all duration-500">
        <div className="max-w-[1000px] mx-auto space-y-6 lg:space-y-8">
          
          {/* HERO SECTION */}
          <section className="flex flex-col items-center justify-center text-center pt-8 sm:pt-10 pb-4 relative">
            
            <div className="glass-surface absolute left-[5%] top-2 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-white/[0.06] px-4 py-2 rounded-full border border-white/50 dark:border-white/10 transition-colors duration-700 animate-float-slow">
              <span className="text-sm">📍</span>
              <span className="text-[11px] font-bold tracking-tight text-neutral-700 dark:text-neutral-200">Grid Telemetry</span>
            </div>

            <div className="glass-surface absolute right-[5%] bottom-2 hidden lg:flex items-center gap-2 bg-white/70 dark:bg-white/[0.06] px-4 py-2 rounded-full border border-white/50 dark:border-white/10 transition-colors duration-700 animate-float-fast">
              <span className="text-sm">⚡</span>
              <span className="text-[11px] font-bold tracking-tight text-[#00A598]">Engine Nominal</span>
            </div>

            <h1 className="font-black tracking-tighter leading-none mb-4 flex flex-col items-center justify-center gap-2 sm:gap-3 xl:gap-4 relative z-10">
              <div className="flex items-center gap-3 text-[24px] sm:text-[32px] lg:text-[40px]">
                <span className="shimmer-sweep relative overflow-hidden shrink-0 whitespace-nowrap italic text-white dark:text-black bg-neutral-900 dark:bg-white px-3 py-1.5 rounded-[12px] shadow-sm border border-black/5 dark:border-white/5 leading-none transition-colors duration-700">
                  ///RATION
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 transition-colors duration-700">
                  Screening Matrix
                </span>
              </div>
            </h1>

            <p className="max-w-2xl font-mono text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.3em] leading-relaxed px-4 relative z-10 transition-colors duration-700">
              <span className="tabular-nums">{cycleTime}</span> // <span className="text-[#00A598] font-bold">RATION PROTOCOL ENGAGED</span>
            </p>
          </section>

          {/* THE ENGINE (Bento Box Wrapper) */}
          <div className="glass-surface flex flex-col rounded-[24px] lg:rounded-[32px] bg-white/55 dark:bg-white/[0.04] border border-white/40 dark:border-white/10 p-5 lg:p-8 transition-all duration-700">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="font-bold text-[16px] tracking-tight flex items-center gap-2 text-neutral-900 dark:text-white transition-colors duration-700">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Input Stream
                <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 border border-blue-600/30 dark:border-blue-400/30 bg-blue-50 dark:bg-blue-400/10 px-1.5 py-0.5 rounded ml-2 uppercase tracking-widest transition-colors hidden sm:inline-block">LIVE API</span>
              </h2>
            </div>

            {/* Input Form (Replaces SRMA Textarea with styled slider container) */}
            <div className="space-y-4">
              <div className="w-full p-6 sm:p-8 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl shadow-inner dark:shadow-none transition-colors flex flex-col justify-center min-h-[192px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
                  
                  {/* Distance Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Max Radius</label>
                      <span className="text-[20px] font-black text-[#00A598] tabular-nums leading-none">{maxDistance.toFixed(1)} <span className="text-[12px] opacity-60">km</span></span>
                    </div>
                    <input 
                      type="range" min="0.5" max="10.0" step="0.5" value={maxDistance} onChange={(e) => setMaxDistance(parseFloat(e.target.value))} 
                      className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer outline-none transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00A598] [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <span>Faculty</span>
                      <span>Outer Rim</span>
                    </div>
                  </div>

                  {/* Cost Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-2">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Capital Limit</label>
                      <span className="text-[20px] font-black text-[#00A598] leading-none">{formatCost(maxCost)}</span>
                    </div>
                    <input 
                      type="range" min="1" max="3" step="1" value={maxCost} onChange={(e) => setMaxCost(parseInt(e.target.value))} 
                      className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer outline-none transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00A598] [&::-webkit-slider-thumb]:rounded-full" 
                    />
                    <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      <span>100 ฿</span>
                      <span>1000+ ฿</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons (Exact SRMA layout match) */}
              <div className="flex gap-4">
                <button
                  onClick={handleClear}
                  className="px-6 py-3.5 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 text-neutral-600 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors border border-black/10 dark:border-white/10 active:scale-95 shadow-sm dark:shadow-none"
                >
                  Clear Cache
                </button>
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className={`relative overflow-hidden flex-1 py-3.5 text-white text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isScanning
                      ? 'bg-[#00A598] cursor-wait shadow-[0_0_25px_rgba(0,165,152,0.45)]'
                      : 'bg-[#00A598] hover:bg-[#009085] shadow-[0_4px_15px_rgba(0,165,152,0.3)] dark:shadow-[0_0_15px_rgba(0,165,152,0.3)]'
                  }`}
                >
                  {isScanning && <span className="scan-sweep" aria-hidden="true" />}
                  {isScanning && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {isScanning ? 'Querying Cloud Matrix...' : 'Execute Smart Scan'}
                  </span>
                </button>
              </div>
            </div>

            {/* Results Dashboard */}
            {isScanned && (
              <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Decision Banner */}
                <div className={`glass-surface banner-pop flex flex-col items-center justify-center p-6 rounded-2xl border transition-colors ${
                  decision === 'EXCLUDE' ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-500 shadow-[0_4px_20px_rgba(220,38,38,0.05)] dark:shadow-[0_0_20px_rgba(239,68,68,0.15)]' :
                  'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.05)] dark:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                }`}>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                    {decision === 'EXCLUDE' ? '🚩 EXCLUDE (Grid Empty)' : '🟩 TARGET ACQUIRED (Passes Screen)'}
                  </h1>
                </div>

                {/* Metrics Grid (Matches SRMA 3-column split) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN: Metrics & Overrides (Matches Keyword Panels) */}
                  <div className="md:col-span-1 space-y-4">
                    <div className="p-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none transition-colors">
                      <h4 className="font-bold text-[13px] text-neutral-600 dark:text-emerald-400 mb-4 flex justify-between tracking-tight transition-colors">
                        Matrix Matches <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[11px] font-black">{allResults.length}</span>
                      </h4>
                      {allResults.length > 1 ? (
                        <button onClick={() => triggerRoulette(allResults)} className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 text-[12px] font-bold uppercase tracking-widest rounded-lg transition-colors active:scale-95 flex items-center justify-center gap-2">
                          🎲 Reroll Target
                        </button>
                      ) : <p className="text-[12px] text-neutral-400 dark:text-slate-500 transition-colors">Insufficient data for reroll.</p>}
                    </div>

                    <div className="p-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none transition-colors">
                      <h4 className="font-bold text-[13px] text-neutral-600 dark:text-blue-400 mb-4 tracking-tight transition-colors">
                        Active Parameters
                      </h4>
                      <div className="space-y-2">
                         <div className="text-[11px] p-2 rounded border bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 transition-colors">
                            <span className="font-bold uppercase text-blue-600 dark:text-blue-300">MAX RANGE:</span>
                            <span className="ml-2 font-black text-neutral-700 dark:text-neutral-200">{maxDistance} km</span>
                         </div>
                         <div className="text-[11px] p-2 rounded border bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 transition-colors">
                            <span className="font-bold uppercase text-blue-600 dark:text-blue-300">CAPITAL LIMIT:</span>
                            <span className="ml-2 font-black text-neutral-700 dark:text-neutral-200">{formatCost(maxCost)}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMNS: Viewer & Context (Matches Context Viewer) */}
                  <div className="md:col-span-2 p-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none flex flex-col transition-colors">
                     
                     <h4 className="font-bold text-[13px] text-neutral-600 dark:text-slate-300 mb-4 flex justify-between items-center tracking-tight transition-colors">
                       Target Isolation
                       <span className="text-[9px] bg-neutral-100 dark:bg-black/50 px-2 py-1 rounded border border-black/5 dark:border-white/5 uppercase tracking-widest text-neutral-500 dark:text-slate-500">Telemetry Feed</span>
                     </h4>
                     
                     {/* Smart Isolation Cards (Primary Target) */}
                     {primaryTarget && !primaryTarget.error && (
                       <div className="flex flex-col gap-3 mb-4">
                         <div className="glass-surface animate-pulse-glow p-5 rounded-xl border bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/70 dark:border-emerald-500/25 transition-colors">
                           <div className="text-[11px] font-bold mb-3 flex items-center justify-between">
                             <div className="flex items-center gap-2 text-[#00A598]">
                               🟩 PRIMARY EXTRACT: <span className="uppercase tracking-widest">{primaryTarget.type}</span>
                             </div>
                             <span className="text-[10px] font-black tabular-nums bg-white dark:bg-black/40 px-2 py-1 rounded text-neutral-600 dark:text-neutral-300">
                               {primaryTarget.distance}km
                             </span>
                           </div>
                           
                           <h3 className="text-[26px] sm:text-[32px] font-black tracking-tight text-neutral-900 dark:text-white leading-none mb-3">
                             {primaryTarget.name}
                           </h3>
                           
                           <div className="flex items-center gap-3 text-[12px] font-bold text-neutral-600 dark:text-slate-300 mb-4">
                              <span className="flex items-center gap-1"><span className="text-amber-500">★</span> {primaryTarget.rating}</span>
                              <span className="opacity-50">•</span>
                              <span className="text-emerald-600 dark:text-emerald-400">{formatCost(primaryTarget.cost)}</span>
                              <span className="opacity-50">•</span>
                              <span>{primaryTarget.location}</span>
                           </div>

                           <a href={primaryTarget.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex text-[11px] font-bold text-white bg-[#00A598] px-4 py-2 rounded shadow-sm hover:bg-[#009085] transition-colors">
                             Launch Map Guidance ↗
                           </a>
                         </div>
                       </div>
                     )}

                     <h4 className="font-bold text-[13px] text-neutral-600 dark:text-slate-300 mb-3 mt-4 transition-colors">Secondary Vectors</h4>
                     
                     {/* Full Context Viewer (Replaced with Alternative Targets) */}
                     <div className="bg-neutral-50/50 dark:bg-black/40 p-4 rounded-xl flex-1 overflow-y-auto border border-black/5 dark:border-black custom-scrollbar max-h-[300px] transition-colors">
                        {alternativeGroups.length > 0 ? (
                          <div className="space-y-4">
                            {alternativeGroups.map((group, gIdx) => (
                              <div key={gIdx}>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
                                  {group.type}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {group.targets.map((target, idx) => (
                                    <div key={idx} onClick={() => handleSelectTarget(target)} style={{ animationDelay: `${idx * 45}ms` }} className="rise-in bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg p-3 cursor-pointer hover:border-[#00A598]/50 hover:-translate-y-0.5 transition-all duration-200 group">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-[12px] text-neutral-800 dark:text-neutral-200 line-clamp-1">{target.name}</h4>
                                      </div>
                                      <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 dark:text-slate-400">
                                        <span><span className="text-amber-500">★</span> {target.rating}</span>
                                        <span className="tabular-nums group-hover:text-[#00A598] transition-colors">{target.distance}km</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[12px] text-neutral-400 dark:text-slate-500 italic p-2 text-center">No secondary vectors detected in feed.</div>
                        )}
                     </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}