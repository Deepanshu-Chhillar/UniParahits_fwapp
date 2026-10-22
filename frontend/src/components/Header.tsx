'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/theme/ThemeToggle';
import AppLogo from '@/components/ui/AppLogo';
import { store } from '@/lib/data/store';
import { ChevronRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: '85/15 Escrow', href: '/#escrow-simulator' },
  { label: 'Economy', href: '/#economy' },
];

export default function Header() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchApp = () => {
    store.setCurrentUserId('user-universal-demo');
    router.push('/student/dashboard');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#07071A]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 py-3 shadow-sm'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* UniParahits Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <AppLogo size={36} />
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
              Uni<span className="text-cyan-500">Parahits</span>
            </span>
            {/* <span className="font-mono text-[10px] tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Autonomous Proof Engine
            </span> */}
          </div>
        </Link>

        
        {/* Navigation Links with balanced spacing */}
        {/* <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              
            >
              {link.label}
            </Link>
          ))}
        </nav> */}

        {/* Right Controls: Theme Toggle + Sign In + Launch App */}
        <div className="hidden sm:flex items-center gap-4">
          <ThemeToggle />
          
          <Link
            href="/login"
            className="h-10 px-5 rounded-xl text-sm font-semibold border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center shadow-sm"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={handleLaunchApp}
            className="h-10 px-5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch App</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-slate-700 dark:text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#0B0C24] border-b border-slate-200 dark:border-white/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-slate-200 py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="h-11 flex items-center justify-center text-sm font-semibold rounded-xl border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleLaunchApp();
              }}
              className="h-11 flex items-center justify-center gap-2 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25"
            >
              <span>Launch App</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}