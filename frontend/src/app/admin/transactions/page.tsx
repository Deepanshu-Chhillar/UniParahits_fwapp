'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransactionList from '@/components/wallet/TransactionList';
import { useUniStore } from '@/lib/data/useUniStore';
import { FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function AdminTransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              Audit Compliance
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Global Double-Entry Transactions Ledger</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable log of all platform movements: task rewards, course enrollments, capacity fees, and escrow payouts.
          </p>
        </div>

        <TransactionList filterType="ALL" />
      </div>
    </DashboardLayout>
  );
}
