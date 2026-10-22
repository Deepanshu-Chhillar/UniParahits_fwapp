'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { Settings, ArrowLeft, CheckCircle, Save, Sliders, ShieldCheck } from 'lucide-react';

export default function AdminEconomyConfigPage() {
  const { economyConfig, updateEconomyConfig } = useUniStore();

  const [projectFee, setProjectFee] = useState(economyConfig.projectPlatformFeePct);
  const [courseFee, setCourseFee] = useState(economyConfig.coursePlatformFeePct);
  const [defaultCap, setDefaultCap] = useState(economyConfig.defaultCourseCapacity);
  const [upgradeSize, setUpgradeSize] = useState(economyConfig.capacityUpgradeSize);
  const [upgradeCost, setUpgradeCost] = useState(economyConfig.capacityUpgradeCost);
  const [minTasksD, setMinTasksD] = useState(economyConfig.minTasksRankD);
  const [minTrustD, setMinTrustD] = useState(economyConfig.minTrustScoreRankD);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateEconomyConfig({
      projectPlatformFeePct: projectFee,
      guildPayoutPct: 100 - projectFee,
      coursePlatformFeePct: courseFee,
      courseTeacherPayoutPct: 100 - courseFee,
      defaultCourseCapacity: defaultCap,
      capacityUpgradeSize: upgradeSize,
      capacityUpgradeCost: upgradeCost,
      minTasksRankD: minTasksD,
      minTrustScoreRankD: minTrustD,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  Dynamic Parameter Controller (Section 40)
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Economy Configuration</h1>
              </div>
            </div>

            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Active Runtime State
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            All commission splits, seat capacity expansion costs, and rank promotion thresholds are fully configurable here without changing frontend codebase.
          </p>

          {savedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Economic parameters updated successfully and applied to runtime store!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Section 1: Platform Fee & Guild Splits */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-4">
              <h3 className="font-bold text-foreground text-sm">1. Corporate Escrow Payout Splits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Corporate Project Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={projectFee}
                    onChange={(e) => setProjectFee(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Guild Workforce receives {100 - projectFee}% of escrow release.
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Course Sales Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={courseFee}
                    onChange={(e) => setCourseFee(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Teacher receives {100 - courseFee}% of student enrollment fee.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Batch Capacity & Economic Sinks */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-4">
              <h3 className="font-bold text-foreground text-sm">2. Course Capacity & Economic Sink Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Initial Course Batch Capacity
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={defaultCap}
                    onChange={(e) => setDefaultCap(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Seats allotted on course creation.
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Capacity Upgrade Increment
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={upgradeSize}
                    onChange={(e) => setUpgradeSize(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Additional seats added per upgrade.
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Capacity Upgrade Cost in ZENI (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={upgradeCost}
                    onChange={(e) => setUpgradeCost(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    ZENI deducted from teacher wallet.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Rank D Promotion Thresholds */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 space-y-4">
              <h3 className="font-bold text-foreground text-sm">3. E → D Rank Promotion Thresholds</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Minimum Verified Tasks
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={minTasksD}
                    onChange={(e) => setMinTasksD(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Required approved submissions.
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Minimum Trust Score (out of 5.0)
                  </label>
                  <input
                    type="number"
                    min={3.0}
                    max={5.0}
                    step={0.1}
                    value={minTrustD}
                    onChange={(e) => setMinTrustD(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Required average client & mentor score.
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Save Economic Configurations</span>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
