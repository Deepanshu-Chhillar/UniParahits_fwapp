'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EscrowCard from '@/components/escrow/EscrowCard';
import PaymentSplitCard from '@/components/escrow/PaymentSplitCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Lock, ShieldCheck, Coins, CheckCircle, Info } from 'lucide-react';

export default function CompanyEscrowVaultPage() {
  const { escrows, projects, paymentSplits } = useUniStore();

  const totalLocked = escrows
    .filter((e) => e.status === 'LOCKED')
    .reduce((acc, e) => acc + e.totalAmountZeni, 0);

  const totalReleased = escrows
    .filter((e) => e.status === 'RELEASED')
    .reduce((acc, e) => acc + e.totalAmountZeni, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Zero-Fraud Financial Infrastructure
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              85% GUILD / 15% PLATFORM
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Corporate Escrow Vault</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Simulated escrow protects both corporate capital and student work. Funds are locked at hire and distributed automatically upon deliverable sign-off.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl glass-card border border-amber-500/30">
            <div className="flex items-center justify-between text-amber-300">
              <span className="font-mono text-[10px] uppercase">Currently Locked</span>
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-2xl font-mono font-extrabold text-amber-300 mt-2 block">
              ₹{totalLocked.toLocaleString()} ZENI
            </span>
            <span className="text-[10px] text-muted-foreground">In active project delivery</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="font-mono text-[10px] uppercase">Settled & Released</span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-2xl font-mono font-extrabold text-emerald-300 mt-2 block">
              ₹{totalReleased.toLocaleString()} ZENI
            </span>
            <span className="text-[10px] text-emerald-400">Paid out to verified Guild members</span>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-purple-500/30">
            <div className="flex items-center justify-between text-purple-300">
              <span className="font-mono text-[10px] uppercase">Platform Commission</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-2xl font-mono font-extrabold text-purple-300 mt-2 block">
              15% Flat
            </span>
            <span className="text-[10px] text-purple-400">Automatic double-entry ledger allocation</span>
          </div>
        </div>

        {/* Escrow Contracts */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-foreground">Escrow Contracts Ledger</h2>

          {escrows.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12 glass-card rounded-2xl border border-border">
              No active escrow contracts found. Visit Applications to hire a Guild and lock project funds.
            </p>
          ) : (
            escrows.map((escrow) => (
              <EscrowCard
                key={escrow.id}
                escrow={escrow}
                project={projects.find((p) => p.id === escrow.projectId)}
              />
            ))
          )}
        </div>

        {/* Settled Payment Splits */}
        {paymentSplits.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Settled Guild Payment Distributions</h2>
            {paymentSplits.map((split) => (
              <PaymentSplitCard key={split.id} split={split} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
