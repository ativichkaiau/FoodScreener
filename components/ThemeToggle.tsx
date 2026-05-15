'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme based on document class or localStorage
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    const initialColorValue = root.classList.contains('dark');
    setIsDark(initialColorValue);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = !isDark;
    
    if (newTheme) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newTheme);
  };

  if (!mounted) {
    return (
      <div className="h-8 w-20 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 opacity-50 cursor-wait"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm hover:border-blue-500/30 transition-all active:scale-95 focus:outline-none"
      aria-label="Toggle Theme"
    >
      <div className="flex flex-col items-start leading-none">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Mode
        </span>
        <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-100 transition-colors">
          {isDark ? 'Night' : 'Day'}
        </span>
      </div>
      
      <div className="text-sm transition-transform duration-500 group-hover:rotate-12">
        {isDark ? '🌙' : '☀️'}
      </div>

      {/* Internal Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </button>
  );
}