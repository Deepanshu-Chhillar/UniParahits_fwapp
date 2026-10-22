'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  ShieldAlert,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Coins,
  Sparkles,
  Lock,
  TrendingUp,
  Settings,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

export default function AdminDashboardPage() {
  const {
    allUsers,
    studentProfile,
    tasks,
    courses,
    guilds,
    bounties,
    projects,
    escrows,
    economyConfig,
    auditLogs,
    zeniTransactions
  } = useUniStore();

  const totalManaCirculating = 1850 + 3400 + 4900 + 420;
  const totalZeniCirculating = zeniTransactions.reduce((acc, t) => acc + (t.amount > 0 ? t.amount : 0), 120000);
  const totalLockedEscrow = escrows.filter((e) => e.status === 'LOCKED').reduce((acc, e) => acc + e.totalAmountZeni, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Admin Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  Platform Command & Governance
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/40">
                  SIH 2026 ADMIN CONSOLE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">UniParahits Master Oversight</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Control platform economics, manage commission splits, audit simulated escrow vaults, monitor meritocratic rank promotions, and enforce security policies.
              </p>
            </div>

            <Link
              href="/admin/economy"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all self-start lg:self-center"
            >
              <Settings className="w-4 h-4" />
              <span>Configure Economy Parameters</span>
            </Link>
          </div>

          {/* Core Platform Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/50 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <span className="text-[10px] text-muted-foreground block font-mono uppercase">Total Users</span>
              <span className="text-2xl font-bold font-mono text-foreground mt-0.5 block">{allUsers.length}</span>
              <span className="text-[10px] text-muted-foreground">Students & Companies</span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-[10px] text-purple-300 block font-mono uppercase">MANA in Circulation</span>
              <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">
                {totalManaCirculating.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-400/80">Pure Merit XP</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 block font-mono uppercase">Active Escrow Vault</span>
              <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">
                ₹{totalLockedEscrow.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400/80">Protected Capital</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30">
              <span className="text-[10px] text-blue-300 block font-mono uppercase">Platform Fee Standard</span>
              <span className="text-2xl font-bold font-mono text-blue-300 mt-0.5 block">
                {economyConfig.projectPlatformFeePct}%
              </span>
              <span className="text-[10px] text-blue-400/80">Configurable in Settings</span>
            </div>
          </div>
        </div>

        {/* Section 40: Configurable Economy Overview Banner */}
        <section className="glass-card rounded-2xl p-6 border border-border space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-accent" />
              <h2 className="text-base font-bold text-foreground">Active Economic Parameters</h2>
            </div>
            <Link href="/admin/economy" className="text-xs text-primary hover:text-accent font-semibold">
              Edit Economy Config →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-secondary/60 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Project Platform Fee</span>
              <span className="text-lg font-mono font-bold text-foreground">{economyConfig.projectPlatformFeePct}%</span>
              <span className="text-[10px] text-muted-foreground block">Guild receives {economyConfig.guildPayoutPct}%</span>
            </div>

            <div className="p-3 rounded-xl bg-secondary/60 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Course Platform Fee</span>
              <span className="text-lg font-mono font-bold text-foreground">{economyConfig.coursePlatformFeePct}%</span>
              <span className="text-[10px] text-muted-foreground block">Teacher receives {economyConfig.courseTeacherPayoutPct}%</span>
            </div>

            <div className="p-3 rounded-xl bg-secondary/60 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Default Course Capacity</span>
              <span className="text-lg font-mono font-bold text-foreground">{economyConfig.defaultCourseCapacity} Seats</span>
              <span className="text-[10px] text-muted-foreground block">Starts at 10 seats</span>
            </div>

            <div className="p-3 rounded-xl bg-secondary/60 border border-border/50">
              <span className="text-muted-foreground block text-[10px]">Capacity Upgrade Cost</span>
              <span className="text-lg font-mono font-bold text-emerald-300">₹{economyConfig.capacityUpgradeCost} ZENI</span>
              <span className="text-[10px] text-muted-foreground block">Adds +{economyConfig.capacityUpgradeSize} seats</span>
            </div>
          </div>
        </section>

        {/* Quick Management Links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Link
            href="/admin/users"
            className="p-5 rounded-2xl glass-card border border-border hover:border-primary transition-all group flex flex-col justify-between"
          >
            <div>
              <Users className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">Users & Ranks</h3>
              <p className="text-muted-foreground text-[11px] mt-1">Manage student capabilities and company verification.</p>
            </div>
            <span className="text-primary font-bold mt-4 flex items-center gap-1">Open Directory →</span>
          </Link>

          <Link
            href="/admin/courses"
            className="p-5 rounded-2xl glass-card border border-border hover:border-emerald-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <GraduationCap className="w-6 h-6 text-emerald-400 mb-2" />
              <h3 className="font-bold text-foreground text-sm group-hover:text-emerald-400 transition-colors">Courses & Batches</h3>
              <p className="text-muted-foreground text-[11px] mt-1">Audit capacity expansions and live Google Meet sessions.</p>
            </div>
            <span className="text-emerald-400 font-bold mt-4 flex items-center gap-1">Manage Batches →</span>
          </Link>

          <Link
            href="/admin/projects"
            className="p-5 rounded-2xl glass-card border border-border hover:border-purple-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <Lock className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-bold text-foreground text-sm group-hover:text-purple-400 transition-colors">Projects & Escrow</h3>
              <p className="text-muted-foreground text-[11px] mt-1">Inspect corporate contracts and automated 85/15 splits.</p>
            </div>
            <span className="text-purple-400 font-bold mt-4 flex items-center gap-1">Escrow Vault →</span>
          </Link>

          <Link
            href="/admin/transactions"
            className="p-5 rounded-2xl glass-card border border-border hover:border-amber-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <FileSpreadsheet className="w-6 h-6 text-amber-400 mb-2" />
              <h3 className="font-bold text-foreground text-sm group-hover:text-amber-400 transition-colors">Audit & Ledger</h3>
              <p className="text-muted-foreground text-[11px] mt-1">Full double-entry transaction record and audit logs.</p>
            </div>
            <span className="text-amber-400 font-bold mt-4 flex items-center gap-1">View Ledger →</span>
          </Link>
        </section>

        {/* Live Audit Log */}
        <section className="glass-card rounded-2xl p-6 border border-border space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h3 className="text-base font-bold text-foreground">Recent Security & Transaction Audits</h3>
            <span className="text-muted-foreground font-mono">{auditLogs.length} total logs</span>
          </div>

          <div className="space-y-2">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-secondary font-mono text-[10px] text-accent">
                      {log.action}
                    </span>
                    <span className="text-foreground font-semibold">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">Actor: {log.userName}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
