'use client';

import React from 'react';
import Link from 'next/link';
import RankProgressCard from '@/components/common/RankProgressCard';
import RankBadge from '@/components/common/RankBadge';
import { useUniStore } from '@/lib/data/useUniStore';
import { RANK_DEFINITIONS } from '@/lib/data/initialData';
import { Trophy, CheckCircle, ShieldCheck, ArrowRight, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import { RankCode } from '@/lib/types';

interface RankProgressionEngineProps {
  id?: string;
  showTitle?: boolean;
}

export default function RankProgressionEngine({ id = 'rank-progression-engine', showTitle = true }: RankProgressionEngineProps) {
  const { studentProfile, currentUser } = useUniStore();
  const ranksList: RankCode[] = ['E', 'D', 'C', 'B', 'A'];

  const isAuthenticatedStudent = Boolean(currentUser?.id && studentProfile);

  return (
    <section id={id} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Background Ambience */}
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-purple-600/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      {showTitle && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-semibold mb-3 border border-purple-500/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>MERITOCRATIC PROTOCOL // STRICT E → D → C → B → A</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Rank Progression Engine
            </h2>
            <p className="font-body text-slate-600 dark:text-slate-400 text-sm max-w-2xl mt-2 leading-relaxed">
              In UniParahits, rank can never be purchased with money or influence. Every advancement unlocks verified economic capabilities, from monetizing courses at Rank D to founding decentralized collegiate guilds at Rank C.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#111333]/80 shadow-sm self-start backdrop-blur-sm border border-slate-200 dark:border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                HIERARCHY: 5 CLOSED TIERS
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                ZERO PRIVILEGE LEAKS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Personal Progress (Rendered securely for authenticated students only) */}
      {isAuthenticatedStudent ? (
        <div className="mb-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Your Real-Time Progression Dossier
            </h3>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              Live Session: {currentUser.name}
            </span>
          </div>
          <RankProgressCard />
        </div>
      ) : (
        /* Public visitor callout: zero private account leakage, clear onboarding prompt */
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-purple-900/10 via-cyan-900/10 to-transparent border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                Sovereign Student Track Record
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Log in to check your active milestone thresholds, verified tasks, and claim instant promotion.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Student Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Complete 5-Tier Capability Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Formal Promotion Thresholds & Unlocked Privileges
          </h3>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Strict Check Constraints
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {ranksList.map((code) => {
            const def = RANK_DEFINITIONS[code];
            const isCurrent = studentProfile?.currentRank === code;
            return (
              <div
                key={code}
                className={`rounded-2xl p-6 border transition-all ${
                  isCurrent
                    ? 'border-cyan-500/60 shadow-[0_0_25px_rgba(0,240,255,0.15)] bg-cyan-500/5 dark:bg-cyan-500/10'
                    : 'bg-white/80 dark:bg-[#111333]/80 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <RankBadge rank={code} size="lg" />
                      <span className="text-base font-bold text-slate-900 dark:text-white">{def.title}</span>
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          YOUR ACTIVE RANK
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                      {def.description}
                    </p>
                  </div>

                  {/* Requirements Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs space-y-1 md:min-w-[240px]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 block font-semibold">
                      Promotion Criteria
                    </span>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                      <span>Tasks Required:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{def.minTasks}+ Verified</span>
                    </div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 text-[11px]">
                      <span>Minimum Trust Score:</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{def.minTrustScore.toFixed(1)} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Unlocked Capabilities */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                    Unlocked Capabilities & Sovereign Powers:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {def.unlocks.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>{u}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
