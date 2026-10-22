'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WalletSummaryCards from '@/components/wallet/WalletSummaryCards';
import TransactionList from '@/components/wallet/TransactionList';
import { useUniStore } from '@/lib/data/useUniStore';
import { GraduationCap, Coins, Sparkles, PlusCircle, ArrowUpRight } from 'lucide-react';

export default function TeacherWalletPage() {
  const { studentProfile } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Teacher Economics & Royalties
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              85% INSTRUCTOR SHARE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Wallet & Revenue</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated course enrollment revenues (85%), teaching MANA rewards, and capacity upgrade expenses.
          </p>
        </div>

        <WalletSummaryCards />

        <TransactionList filterType="ALL" />
      </div>
    </DashboardLayout>
  );
}
