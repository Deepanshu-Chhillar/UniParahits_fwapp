'use client';

import React from 'react';
import { PaymentSplit } from '@/lib/types';
import { ShieldCheck, User, Sparkles, Building2 } from 'lucide-react';

interface PaymentSplitCardProps {
  split: PaymentSplit;
}

export default function PaymentSplitCard({ split }: PaymentSplitCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/40 relative overflow-hidden space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/50">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
            Automated Escrow Distribution Engine
          </span>
          <h3 className="text-lg font-bold text-foreground">
            Escrow Payment Split Breakdown
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
            PROCESSED & SETTLED
          </span>
        </div>
      </div>

      {/* Gross vs Platform vs Guild Split High-level */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
          <span className="text-muted-foreground text-xs block">Total Escrow Released</span>
          <span className="text-xl font-mono font-extrabold text-foreground">
            ₹{split.totalGrossZeni.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">100% Contract Value</span>
        </div>

        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
          <span className="text-purple-300 text-xs block">Platform Maintenance Fee</span>
          <span className="text-xl font-mono font-extrabold text-purple-300">
            ₹{split.platformFeeZeni.toLocaleString()}
          </span>
          <span className="text-[10px] text-purple-400 block mt-0.5">15% Standard Commission</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <span className="text-emerald-300 text-xs block">Net Guild Workforce Payout</span>
          <span className="text-xl font-mono font-extrabold text-emerald-300">
            ₹{split.netGuildZeni.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">85% Direct to Members</span>
        </div>
      </div>

      {/* Member by Member Role Distribution (Section 34) */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Guild Role Allocation & Verified Shares (Backend Calculated)
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {split.splits.map((member) => (
            <div
              key={member.studentId}
              className="p-3.5 rounded-xl bg-secondary/60 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold text-xs">
                  {member.studentName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{member.studentName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-border/40">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Role Share: {member.percentage}% of Guild Net Payout
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-base font-mono font-extrabold text-emerald-300">
                    +₹{member.amountZeni.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400">ZENI</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">+200 MANA XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
