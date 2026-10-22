'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WalletSummaryCards from '@/components/wallet/WalletSummaryCards';
import TransactionList from '@/components/wallet/TransactionList';
import { useUniStore } from '@/lib/data/useUniStore';
import { Wallet, ShieldCheck, Lock, ArrowUpRight, ArrowDownLeft, Info, Coins } from 'lucide-react';

export default function StudentWalletPage() {
  const { studentProfile, zeniTransactions, escrows } = useUniStore();

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Student profile not loaded.</p>
      </DashboardLayout>
    );
  }

  const totalEarned = zeniTransactions.filter((t) => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalSpent = zeniTransactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                Financial Architecture & Balances
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                1 ZENI = ₹1 INR
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Dual-Economy Student Wallet</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Secure ledger tracking both MANA (contribution XP) and ZENI (paid project/course currency).
            </p>
          </div>
        </div>

        {/* Dual Cards */}
        <WalletSummaryCards />

        {/* ZENI Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-muted-foreground block text-[11px] font-semibold">Available Balance</span>
            <span className="text-2xl font-mono font-extrabold text-emerald-700 dark:text-emerald-300 mt-1 block">
              ₹{studentProfile.zeniBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">Directly spendable / withdrawable</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-muted-foreground block text-[11px] font-semibold">Cumulative Earned</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 dark:text-foreground mt-1 block">
              ₹{totalEarned.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Lifetime project & teaching income</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-muted-foreground block text-[11px] font-semibold">Total Spent</span>
            <span className="text-2xl font-mono font-extrabold text-slate-800 dark:text-slate-300 mt-1 block">
              ₹{totalSpent.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-muted-foreground">Courses & seat capacity investments</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-muted-foreground block text-[11px] font-semibold">Ledger Integrity</span>
            <span className="text-2xl font-mono font-extrabold text-blue-700 dark:text-blue-400 mt-1 block">
              100%
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Relational Double-Entry
            </span>
          </div>
        </div>

        {/* Complete Transactions Ledger */}
        <TransactionList filterType="ALL" />
      </div>
    </DashboardLayout>
  );
}
