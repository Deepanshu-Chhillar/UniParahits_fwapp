'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import { Briefcase, Coins, ArrowLeft, Calendar, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import BountyCard from '@/components/bounties/BountyCard';

export default function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { bounties } = useUniStore();

  const bounty = bounties.find((b) => b.id === resolvedParams.id) || bounties[0];

  const platformFee = Math.round(bounty.budgetZeni * 0.15);
  const netGuild = bounty.budgetZeni - platformFee;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/student/bounties"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bounties</span>
        </Link>

        {bounty && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <img
                  src={bounty.companyLogo}
                  alt={bounty.companyName}
                  className="w-10 h-10 rounded-xl object-cover border border-primary/40"
                />
                <div>
                  <h3 className="font-bold text-foreground text-sm">{bounty.companyName}</h3>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Verified Startup Partner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-accent font-mono font-bold">
                  {bounty.targetType} BOUNTY
                </span>
                <RankBadge rank={bounty.minRank} size="md" showTitle />
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{bounty.title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{bounty.description}</p>
            </div>

            {/* Escrow Value Split Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/50 border border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Total Guaranteed Budget</span>
                <span className="text-xl font-mono font-extrabold text-foreground">
                  ₹{bounty.budgetZeni.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground block">Locked in Escrow</span>
              </div>
              <div>
                <span className="text-emerald-400 block text-[11px]">85% Workforce Net Payout</span>
                <span className="text-xl font-mono font-extrabold text-emerald-300">
                  ₹{netGuild.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400/80 block">Distributed to Team</span>
              </div>
              <div>
                <span className="text-purple-400 block text-[11px]">15% Platform Maintenance</span>
                <span className="text-xl font-mono font-extrabold text-purple-300">
                  ₹{platformFee.toLocaleString()}
                </span>
                <span className="text-[10px] text-purple-400/80 block">Verification & Assurance</span>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Required Deliverables</h4>
              <div className="space-y-2">
                {bounty.deliverables.map((d, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-border/40 flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Apply / Manage Card */}
            <div className="pt-4 border-t border-border/50">
              <BountyCard bounty={bounty} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
