'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  ArrowRight,
  Zap,
  Sparkles,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useUniStore } from '@/lib/data/useUniStore';
import AppLogo from '@/components/ui/AppLogo';
import ThemeToggle from '@/components/theme/ThemeToggle';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role');

  const { users, switchUser } = useUniStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [selectedRoleTab, setSelectedRoleTab] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>(
    roleParam === 'company' ? 'COMPANY' : roleParam === 'admin' ? 'ADMIN' : 'STUDENT'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Authenticate by credentials
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user in database
      const foundUser = users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (foundUser) {
        switchUser(foundUser.id);
        if (foundUser.role === 'COMPANY') {
          router.push('/company/dashboard');
        } else if (foundUser.role === 'ADMIN') {
          router.push('/admin/dashboard');
        } else if (foundUser.id === 'user-aarav-d' || email.toLowerCase().includes('teacher') || email.toLowerCase().includes('aarav')) {
          router.push('/teacher/dashboard');
        } else if (foundUser.id === 'user-priya-c' || email.toLowerCase().includes('mentor') || email.toLowerCase().includes('priya')) {
          router.push('/mentor/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        // If user typed a custom email not yet in the database
        setErrorMsg(`Account with email "${email}" not found. If you are new to UniParahits, please register a new account below.`);
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07071a] dark:bg-[#07080d] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30">
      {/* Background cybernetic grid lines & glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/5 rounded-full blur-[180px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#07071a]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AppLogo size={36} />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                Uni<span className="text-cyan-400">Parahits</span>
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">
                ACADEMIC PROTOCOL & WORKFORCE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/register"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30 hover:border-cyan-400 px-3 py-1.5 rounded-xl bg-cyan-500/10"
            >
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row items-center gap-8 my-auto">
        {/* Left Column: Value Prop */}
        <div className="flex-1 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SIH 2026 Production Ready Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Rank Up. Get Hired. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400">
              The Elite Student Taskforce.
            </span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
            Log in to access your role-specific dashboard. Students progress from Rank E to Rank A through verifiable tasks, unlock peer teaching &amp; mentorship, form Guilds, and get hired on corporate projects with automated escrow settlement.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-0.5">MANA Mechanism</span>
              <p className="text-xs text-slate-300">Non-purchasable contribution XP earned exclusively by building &amp; mentoring.</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-amber-400 block mb-0.5">ZENI Economy</span>
              <p className="text-xs text-slate-300">1 ZENI = ₹1 pegged internal currency backed by corporate escrow &amp; course fees.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="w-full max-w-md bg-[#0e1124] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Sign In to UniParahits</h2>
            <p className="text-xs text-slate-400">Enter your credentials to access your dashboard</p>
          </div>

          {/* Role selector tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-5 border border-white/10 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('STUDENT');
                setEmail('demo@uniparahits.edu');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                selectedRoleTab === 'STUDENT'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('COMPANY');
                setEmail('hiring@novatechlabs.ai');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                selectedRoleTab === 'COMPANY'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Company
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('ADMIN');
                setEmail('admin@uniparahits.gov.in');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                selectedRoleTab === 'ADMIN'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@college.ac.in"
                  required
                  className="w-full bg-[#07080d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#07080d] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* New User Callout */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-3">
            <span className="text-xs text-slate-400 block">New to UniParahits?</span>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Create New Student / Company Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-4 text-center text-xs font-mono text-slate-500">
        UniParahits &copy; 2026 SIH Project. Autonomous Student Workforce &amp; Escrow Protocol.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07071a] flex items-center justify-center text-white">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
