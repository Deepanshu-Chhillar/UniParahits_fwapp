'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RankProgressionEngine from '@/components/common/RankProgressionEngine';
import { store } from '@/lib/data/store';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Coins, 
  GraduationCap, 
  Users, 
  Building2, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  Check, 
  Flame, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  // Interactive Escrow Simulator State
  const [bountyAmount, setBountyAmount] = useState<number>(60000);
  const [burnActive, setBurnActive] = useState<boolean>(false);
  const [settled, setSettled] = useState<boolean>(false);

  // Escrow Calculations (85% Guild / 15% Platform)
  const platformFee = Math.round(bountyAmount * 0.15);
  const rawGuildShare = bountyAmount - platformFee;
  const burnAmount = burnActive ? 500 : 0;
  const guildNetPayout = rawGuildShare - burnAmount;

  // Member splits
  const leaderPayout = Math.round(guildNetPayout * 0.45);
  const architectPayout = Math.round(guildNetPayout * 0.35);
  const qaPayout = guildNetPayout - leaderPayout - architectPayout;

  const handleSimulateSettlement = () => {
    setSettled(true);
    setTimeout(() => setSettled(false), 4000);
  };

  const handleLaunchApp = (userId = 'user-universal-demo', targetPath = '/student/dashboard') => {
    store.setCurrentUserId(userId);
    router.push(targetPath);
  };

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-[#07071A] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      <Header />

      {/* ======================================================== */}
      {/* SECTION 0: HERO                                           */}
      {/* ======================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden">
        {/* Atmospheric Glow Conduits */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-[420px] h-[420px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-amber-500/15 blur-[110px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Live System Node Tag */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#111333]/80 shadow-sm backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="w-1.5 h-1.5 -ml-2 rounded-full bg-cyan-500" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300">
                Autonomous Proof Engine v2.4
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                SIH-2026 Live
              </span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Don&apos;t Just Freelance,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500">
                Build Your Guild &{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-amber-500 to-cyan-500  lg:text-6xl ">
                Solve Real World Problem.
              </span>
            </h1>

            <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              The sovereign cyber-academic protocol bridging student talent directly to enterprise bounties, peer-led masterclasses, and decentralized collegiate guild treasuries. Pure cryptographic merit—without gatekeepers.
            </p>

            {/* Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleLaunchApp('user-universal-demo', '/student/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#07071A] font-mono text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Student Terminal</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="#escrow-simulator"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/80 dark:bg-[#111333]/80 hover:bg-white dark:hover:bg-[#171a42] text-slate-700 dark:text-slate-200 font-mono text-sm font-semibold transition-all shadow-sm"
              >
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Test 85/15 Escrow</span>
              </a>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">4,500+</p>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase mt-0.5">Active Students</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-500">60,000</p>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase mt-0.5">ZENI Escrow Pool</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-500">99.8%</p>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase mt-0.5">On-Time Settle</p>
              </div>
            </div>
          </div>

          {/* Right Column: Dual-Token HUD & Pipeline Preview Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Dual Token Live Meter Card */}
            <div className="rounded-3xl bg-white/90 dark:bg-[#111333]/90 p-6 sm:p-7 shadow-xl shadow-slate-900/5 dark:shadow-black/25 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Dual-Token Economy
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-semibold">
                  Active Sync
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                {/* MANA Token Card */}
                <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                    <Zap className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold">MANA XP</span>
                  </div>
                  <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">4,500</p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-tight">
                    Non-purchasable sovereign reputation earned via verified code tasks.
                  </span>
                </div>

                {/* ZENI Token Card */}
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Coins className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold">ZENI ₹1</span>
                  </div>
                  <p className="font-mono text-2xl font-black text-slate-900 dark:text-white">50,000</p>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-tight">
                    Liquid currency pegged 1:1 with INR. Earned from courses & bounties.
                  </span>
                </div>
              </div>

              {/* Strict 5-Rank Hierarchy Display */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  <span>STRICT RANK LADDER</span>
                  <span className="text-cyan-500 font-bold">NO F / S / S+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { r: 'E', l: 'Apprentice', c: 'bg-slate-400' },
                    { r: 'D', l: 'Teacher/Earner', c: 'bg-emerald-500' },
                    { r: 'C', l: 'Mentor/Guild', c: 'bg-blue-500' },
                    { r: 'B', l: 'Senior Lead', c: 'bg-purple-500' },
                    { r: 'A', l: 'Guild Master', c: 'bg-amber-500' },
                  ].map((item) => (
                    <div key={item.r} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-full h-2 rounded-full ${item.c}`} />
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {item.r}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 1: YOUR FIRST 60 SECONDS                         */}
      {/* ======================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RAPID ONBOARDING PIPELINE</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your First 60 Seconds on UniParahits
          </h2>
          <p className="font-body text-slate-600 dark:text-slate-400 text-base mt-3">
            How an E-Rank student becomes an autonomous economic contributor in 4 verified steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Cryptographic ID Mint',
              desc: 'Sign in via Parahits credentials. Mint your verified E-Rank student profile with 0 MANA and initial testnet balance.',
              icon: Terminal,
              color: 'text-cyan-500',
              badge: 'Rank E Init',
            },
            {
              step: '02',
              title: 'Claim Audited Quests',
              desc: 'Select beginner code tasks. Submit GitHub PRs or code proofs. Get reviewed by C+ mentors and earn MANA XP.',
              icon: ShieldCheck,
              color: 'text-indigo-500',
              badge: '+500 MANA',
            },
            {
              step: '03',
              title: 'Dual-Token Rank Up',
              desc: 'Reach Rank D! Unlock the growth fork: take corporate contracts or monetize your expertise through peer teaching.',
              icon: TrendingUp,
              color: 'text-emerald-500',
              badge: 'Rank D Unlocked',
            },
            {
              step: '04',
              title: 'Deploy TMS & Guilds',
              desc: 'Create courses with 10-seat default capacity. Burn 500 ZENI expansion sinks. Form collegiate Guilds for 85/15 escrows.',
              icon: GraduationCap,
              color: 'text-amber-500',
              badge: '85/15 Escrow',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-600">
                      {card.step}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {card.badge}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${card.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="font-body text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: THE CLOSED-LOOP ECONOMIC ENGINE               */}
      {/* ======================================================== */}
      <section id="economy" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-mono text-xs font-semibold mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span>SUSTAINABLE TOKENOMICS</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Closed-Loop Economic Engine
          </h2>
          <p className="font-body text-slate-600 dark:text-slate-400 text-base mt-3">
            How tokens circulate without inflation or unearned liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-xl transition-all flex flex-col gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
              1. Non-Purchasable MANA XP
            </h3>
            <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              MANA represents pure academic labor. It cannot be purchased, gifted, or transferred. It can only be minted upon cryptographic approval of code tasks by verified C-Rank mentors.
            </p>
            <ul className="space-y-2 mt-2 font-mono text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>E → D: 1,000 MANA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>D → C: 2,500 MANA + Teaching Req</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>C → B: 5,000 MANA + 1 Guild Milestone</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-xl transition-all flex flex-col gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
              2. 500 ZENI Capacity Sinks
            </h3>
            <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When student teachers monetize courses, their classrooms start with a 10-student seat cap. To admit more students, teachers must burn 500 ZENI per 10 additional seats.
            </p>
            <ul className="space-y-2 mt-2 font-mono text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Default Cohort Cap: 10 Students</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Deflationary Expansion: 500 ZENI</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Google Meet & Live Doubt Chat</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-xl transition-all flex flex-col gap-4 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
              3. Guaranteed 85/15 Escrow
            </h3>
            <p className="font-body text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Enterprises deposit 100% of project funds into simulated smart contract escrow upfront. Upon company sign-off, funds split automatically without human intermediaries.
            </p>
            <ul className="space-y-2 mt-2 font-mono text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>85% Net to Student Guild</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>15% Retained Platform Protocol Fee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-500" />
                <span>Automatic Member Stake Distribution</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CHOOSE YOUR ENTRY PORTAL (Role Separation)    */}
      {/* ======================================================== */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-mono text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>ROLE-BASED GOVERNANCE</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Choose Your Entry Portal
          </h2>
          <p className="font-body text-slate-600 dark:text-slate-400 text-base mt-3">
            Production-grade role isolation. Log in as an evaluator to inspect dedicated workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portal 1: Student */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                Student Terminal
              </span>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mt-1">
                Aarav Sharma (E/D Rank)
              </h3>
              <p className="font-body text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Complete quests, submit GitHub PR proofs, earn non-purchasable MANA, and climb from E to A.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchApp('user-universal-demo', '/student/dashboard')}
              className="mt-6 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-500 dark:hover:text-black text-slate-800 dark:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Launch Student View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Portal 2: Teacher */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-amber-500 uppercase">
                TMS Classroom Suite
              </span>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mt-1">
                Priya Singh (C-Rank)
              </h3>
              <p className="font-body text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Manage 10-seat cohorts, burn 500 ZENI expansion sinks, host Google Meet sessions, and answer course doubts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchApp('user-aarav-d', '/teacher/dashboard')}
              className="mt-6 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 dark:hover:text-black text-slate-800 dark:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Launch Teacher View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Portal 3: Corporate */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-purple-500 uppercase">
                Corporate Escrow Hub
              </span>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mt-1">
                NovaTech Labs / TechCorp
              </h3>
              <p className="font-body text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Post 60,000 ZENI enterprise bounties, fund milestone smart escrows, hire collegiate guilds, and release payments.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchApp('user-novatech', '/company/dashboard')}
              className="mt-6 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white text-slate-800 dark:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Launch Corporate View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Portal 4: Admin */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-500 uppercase">
                System Overseer
              </span>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mt-1">
                Ministry / Admin Node
              </h3>
              <p className="font-body text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Inspect verification queues, arbitrate collegiate guild disputes, view ledger proofs, and audit dual-token supply.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleLaunchApp('user-admin', '/admin/dashboard')}
              className="mt-6 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-emerald-500 hover:text-black dark:hover:bg-emerald-500 dark:hover:text-black text-slate-800 dark:text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              <span>Launch Admin View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: INTERACTIVE 85/15 ESCROW SIMULATOR             */}
      {/* ======================================================== */}
      <section id="escrow-simulator" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-semibold mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>SIH JURY EVALUATION SANDBOX</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Multi-Sig Escrow & 85/15 Payout Simulator
            </h2>
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm max-w-xl mt-2">
              Simulate live enterprise bounty creation, verify the non-custodial 85/15 split, test peer cohort burning, and trigger simulated on-chain settlement.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#111333]/80 shadow-sm self-start backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                STATE: SANDBOX_READY
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                ARBITRUM TESTNET FORK
              </span>
            </div>
          </div>
        </div>

        {/* Simulator Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Control Panel (Left 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Step 1: Select Enterprise Bounty */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex flex-col gap-3 backdrop-blur-sm">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Select Enterprise Bounty Vault Amount
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[50000, 60000, 120000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setBountyAmount(amt)}
                    className={`py-2.5 px-2 rounded-xl font-mono text-sm font-bold transition-all cursor-pointer ${
                      bountyAmount === amt
                        ? 'bg-cyan-500 text-[#07071A] shadow-md shadow-cyan-500/25 scale-[1.02]'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                Target Pull Request: <span className="text-cyan-600 dark:text-cyan-400 font-semibold">NovaTech #PR-892 (Full Stack Hiring Platform)</span>
              </span>
            </div>

            {/* Step 2: Peer Mentorship Burn Toggle */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#111333]/80 shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex flex-col gap-3 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  2. Deflationary Peer Cohort Burn
                </label>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${burnActive ? 'bg-amber-500 text-black' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                  {burnActive ? 'ACTIVE (-500 ZENI)' : 'INACTIVE'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      Burn 500 ZENI Capacity Sink
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Unlocks +10 TMS Course Seats
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBurnActive(!burnActive)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${burnActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${burnActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Step 3: Trigger Settlement */}
            <button
              type="button"
              onClick={handleSimulateSettlement}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-amber-500 hover:opacity-95 text-[#07071A] font-mono text-sm font-extrabold shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white">Simulate Smart Escrow Release</span>
            </button>
          </div>

          {/* Right Column: Dynamic Escrow Ledger & Splits (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#111333]/90 shadow-2xl shadow-slate-900/5 dark:shadow-black/25 relative overflow-hidden backdrop-blur-md">
            {/* Settled Toast / Banner */}
            {settled && (
              <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>ESCROW RELEASED TO GUILD // TX CONFIRMED</span>
              </div>
            )}

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Live Contract Ledger
                </span>
                <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                  CyberForge Guild #04 Escrow Vault
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                100% AUDITED
              </span>
            </div>

            {/* Split Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Guild 85% */}
              <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                    Guild Payout (85%)
                  </span>
                  <span className="font-mono text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-2 py-0.5 rounded font-bold">
                    85% NET
                  </span>
                </div>
                <p className="font-mono text-3xl font-black text-slate-900 dark:text-white mt-2">
                  ₹{guildNetPayout.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Distributed according to member contribution shares.
                </p>
              </div>

              {/* Platform 15% */}
              <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                    Platform Protocol Fee (15%)
                  </span>
                  <span className="font-mono text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded font-bold">
                    15% FIXED
                  </span>
                </div>
                <p className="font-mono text-3xl font-black text-slate-900 dark:text-white mt-2">
                  ₹{platformFee.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Re-invested into campus validator nodes & mentor grants.
                </p>
              </div>
            </div>

            {/* Member Allocation Table */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-3">
                Automatic Multi-Sig Member Distribution (CyberForge Guild)
              </span>
              <div className="space-y-2.5">
                {[
                  { name: 'Priya Singh (Lead Architect)', stake: '45%', amount: leaderPayout, role: 'UI/UX & Contracts' },
                  { name: 'Rahul Verma (Backend Engineer)', stake: '35%', amount: architectPayout, role: 'API & Micro-VM' },
                  { name: 'Aarav Sharma (QA & Frontend)', stake: '20%', amount: qaPayout, role: 'Testing & Deploy' },
                ].map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{member.name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">({member.role})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">₹{member.amount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({member.stake})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: RANK PROGRESSION ENGINE (Edit 4)              */}
      {/* ======================================================== */}
      <RankProgressionEngine id="rank-progression" />

      <Footer />
    </main>
  );
}