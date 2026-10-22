'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { Sparkles, ShieldCheck, Info, CheckSquare, GraduationCap, Users, HeartHandshake, ArrowLeft } from 'lucide-react';
import TransactionList from '@/components/wallet/TransactionList';

export default function ManaWalletPage() {
  const { studentProfile, manaTransactions } = useUniStore();

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Student profile not loaded.</p>
      </DashboardLayout>
    );
  }

  const sources = [
    { title: 'Verified Task Completion', desc: 'Solve peer & foundational coding/design tasks with approved proof', icon: CheckSquare, amount: '+80 to +350 MANA' },
    { title: 'Mentoring E-Rank Students', desc: 'C-Rank students review submissions and guide apprentices', icon: Users, amount: '+50 MANA / review' },
    { title: 'Live Teaching & Q&A', desc: 'Conduct Google Meet interactive classes with high student attendance', icon: GraduationCap, amount: '+150 MANA / session' },
    { title: 'Peer Review & Evaluation', desc: 'Provide constructive feedback on peer code and design submissions', icon: HeartHandshake, amount: '+30 MANA / evaluation' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/student/wallet"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Wallet</span>
        </Link>

        {/* MANA Header Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 block">
                  Contribution & Merit Currency
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">MANA Economy Hub</h1>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Current Balance</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-3xl sm:text-4xl font-mono font-extrabold text-purple-300">
                  {studentProfile.manaBalance.toLocaleString()}
                </span>
                <span className="text-xs text-purple-400 font-bold">MANA XP</span>
              </div>
            </div>
          </div>

          {/* Section 10 Core Principle Banner */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Core Economic Principle: MANA Cannot Be Purchased</span>
            </div>
            <p className="text-purple-200/80 leading-relaxed">
              MANA represents pure verified contribution, learning progress, and mentorship value. No student, mentor, or company can buy MANA with real money. It is earned exclusively through provable skill execution and helping peers rank up.
            </p>
          </div>

          {/* Earning Sources Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Official MANA Earning Mechanisms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sources.map((src, i) => {
                const Icon = src.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-border/40 flex items-start gap-3 text-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">{src.title}</span>
                        <span className="font-mono text-purple-300 font-bold text-[11px]">{src.amount}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{src.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* MANA History */}
        <TransactionList filterType="MANA" />
      </div>
    </DashboardLayout>
  );
}
