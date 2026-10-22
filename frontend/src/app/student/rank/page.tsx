'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RankProgressCard from '@/components/common/RankProgressCard';
import RankBadge from '@/components/common/RankBadge';
import { useUniStore } from '@/lib/data/useUniStore';
import { RANK_DEFINITIONS } from '@/lib/data/initialData';
import { Trophy, CheckCircle, ShieldCheck, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { RankCode } from '@/lib/types';

export default function StudentRankPage() {
  const { studentProfile, economyConfig } = useUniStore();

  const ranksList: RankCode[] = ['E', 'D', 'C', 'B', 'A'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                Meritocratic Hierarchy
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent text-[10px] font-bold">
                STRICTLY E → D → C → B → A
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Rank Progression Engine</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranks can never be purchased. Each rank unlocks tangible economic capabilities, from teaching to Guild founding.
            </p>
          </div>
        </div>

        {/* Current Active Progress */}
        <section className="space-y-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Current Tier Status & Active Milestones
          </h2>
          <RankProgressCard />
        </section>

        {/* Complete 5-Tier Breakdown */}
        <section className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Complete Rank Capability Hierarchy
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {ranksList.map((code) => {
              const def = RANK_DEFINITIONS[code];
              const isCurrent = studentProfile?.currentRank === code;
              return (
                <div
                  key={code}
                  className={`glass-card rounded-2xl p-6 border transition-all ${
                    isCurrent
                      ? 'border-primary shadow-[0_0_20px_rgba(124,58,237,0.25)] bg-primary/10'
                      : 'border-border/60 hover:border-border'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <RankBadge rank={code} size="lg" />
                        <span className="text-base font-bold text-foreground">{def.title}</span>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                            YOUR CURRENT RANK
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                        {def.description}
                      </p>
                    </div>

                    {/* Requirements Box */}
                    <div className="p-3 rounded-xl bg-secondary/60 border border-border/50 text-xs space-y-1 md:min-w-[240px]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                        Promotion Thresholds
                      </span>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Tasks Required:</span>
                        <span className="font-mono font-bold text-foreground">{def.minTasks}+</span>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Minimum Trust:</span>
                        <span className="font-mono font-bold text-foreground">{def.minTrustScore.toFixed(1)} / 5.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Unlocked Capabilities */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mb-2">
                      Unlocked Capabilities & Privileges:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {def.unlocks.map((u, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-200">
                          <CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <span>{u}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
