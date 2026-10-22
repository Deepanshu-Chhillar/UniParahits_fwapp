'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BountyCard from '@/components/bounties/BountyCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Briefcase, Filter, Lock, ShieldCheck, Coins, Users, CheckCircle } from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

export default function StudentBountiesPage() {
  const { bounties, applications, currentUser } = useUniStore();
  const [targetFilter, setTargetFilter] = useState<'ALL' | 'GUILD' | 'INDIVIDUAL'>('ALL');
  const [rankFilter, setRankFilter] = useState<string>('ALL');

  const filteredBounties = bounties.filter((b) => {
    const matchesTarget = targetFilter === 'ALL' || b.targetType === targetFilter;
    const matchesRank = rankFilter === 'ALL' || b.minRank === rankFilter;
    return matchesTarget && matchesRank;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
                Verified Work Marketplace
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold">
                100% SMART ESCROW PROTECTED
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Corporate Gigs & Bounties</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Apply individually or as a Guild. Client funds are locked in simulated escrow prior to work commencement.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-secondary/70 border border-slate-200 dark:border-border text-xs">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="font-bold text-foreground block">Zero-Payment Fraud</span>
              <span className="text-[10px] text-muted-foreground">85% to Guild / 15% Platform Split</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-card border border-border text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-600 dark:text-muted-foreground flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Scope:
            </span>
            {(['ALL', 'GUILD', 'INDIVIDUAL'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTargetFilter(type)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  targetFilter === type
                    ? 'bg-primary/20 text-primary dark:text-accent font-bold border border-primary/40'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {type === 'ALL' ? 'All Bounties' : `${type} Gigs`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-muted-foreground font-mono">Minimum Rank:</span>
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
            >
              <option value="ALL" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">All Ranks (E to A)</option>
              <option value="E" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank E</option>
              <option value="D" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank D</option>
              <option value="C" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank C</option>
              <option value="B" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank B</option>
            </select>
          </div>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBounties.map((bounty) => (
            <BountyCard key={bounty.id} bounty={bounty} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
