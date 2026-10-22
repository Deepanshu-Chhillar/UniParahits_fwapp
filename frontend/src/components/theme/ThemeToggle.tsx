'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('uniparahits_theme') as 'dark' | 'light' | null;
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (mode: 'dark' | 'light') => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('uniparahits_theme', mode);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-300"
      >
        <Moon className="w-4 h-4 text-cyan-400" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      title={`Active: ${theme.toUpperCase()} MODE. Click to toggle.`}
      className={`relative inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
        theme === 'dark'
          ? 'bg-[#111333] border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:border-cyan-400 hover:scale-105'
          : 'bg-white border border-slate-300 text-slate-700 shadow-sm hover:border-indigo-400 hover:scale-105'
      }`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline text-[11px] font-semibold text-cyan-300">DARK</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-800">LIGHT</span>
        </>
      )}
    </button>
  );
}
