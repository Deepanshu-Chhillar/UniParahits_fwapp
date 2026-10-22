'use client';

import React from 'react';
import Link from 'next/link';
import { useUniStore } from '@/lib/data/useUniStore';
import { Sparkles, Coins, ArrowUpRight, ArrowDownRight, ShieldCheck, Lock, Info } from 'lucide-react';

export default function WalletSummaryCards() {
  const { studentProfile, escrows, currentUser, guilds } = useUniStore();

  if (!studentProfile) return null;

  // Calculate pending / locked escrow strictly for this user or user's guild
  const myGuild = guilds.find((g) => g.members.some((m) => m.studentId === currentUser.id) || g.leaderId === currentUser.id);
  const lockedInEscrow = escrows
    .filter((e) => e.status === 'LOCKED' && (e.beneficiaryId === studentProfile.userId || (myGuild && e.beneficiaryId === myGuild.id)))
    .reduce((acc, e) => acc + e.netPayoutZeni, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. MANA Card (XP / Contribution Currency) */}
      <div className="rounded-2xl p-6 border border-purple-200 dark:border-purple-500/30 bg-white dark:bg-[#111333] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300/80 block font-semibold">
                Contribution Currency
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">MANA Balance</h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30 text-[10px] font-mono font-bold">
            NON-PURCHASABLE XP
          </span>
        </div>

        {/* Large Balance Display */}
        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-purple-700 dark:text-purple-300">
              {studentProfile.manaBalance.toLocaleString()}
            </span>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-bold">MANA</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">
            Earned through approved peer tasks, learning milestones, mentoring E-rank students, and teaching.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-[11px] text-purple-900 dark:text-purple-200/80 flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <span>MANA cannot be bought with money. It represents provable merit & community impact.</span>
        </div>

        {/* Action button */}
        <Link
          href="/wallet/mana"
          className="w-full py-2.5 rounded-xl border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/15 text-xs font-bold text-center block transition-colors shadow-sm"
        >
          View MANA Ledger & Sources →
        </Link>
      </div>

      {/* 2. ZENI Card (Paid Currency - 1 ZENI = ₹1) */}
      <div className="rounded-2xl p-6 border border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-[#111333] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300/80 block font-semibold">
                Transactional Currency
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">ZENI Balance</h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-[10px] font-mono font-bold">
            1 ZENI = ₹1 INR
          </span>
        </div>

        {/* Large Balance Display */}
        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
              ₹{studentProfile.zeniBalance.toLocaleString()}
            </span>
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">ZENI Available</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1 text-slate-600 dark:text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>In Escrow:</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                ₹{lockedInEscrow.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Secured by Contract</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-[11px] text-emerald-900 dark:text-emerald-200/80 flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Earned from corporate bounties, guild projects, and teaching. Spendable on courses & seats.</span>
        </div>

        {/* Action button */}
        <Link
          href="/student/wallet"
          className="w-full py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/15 text-xs font-bold text-center block transition-colors shadow-sm"
        >
          View Full Financial Ledger →
        </Link>
      </div>
    </div>
  );
}
