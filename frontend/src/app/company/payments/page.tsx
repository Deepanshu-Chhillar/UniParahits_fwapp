'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransactionList from '@/components/wallet/TransactionList';
import { useUniStore } from '@/lib/data/useUniStore';
import { DollarSign, ShieldCheck, FileSpreadsheet, Lock } from 'lucide-react';

export default function CompanyPaymentsPage() {
  const { escrows, paymentSplits } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              Corporate Accounts & Invoices
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Escrow Disbursements & Payments</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transparent breakdown of funded project escrow locks, platform commissions (15%), and release receipts.
          </p>
        </div>

        <TransactionList filterType="ZENI" />
      </div>
    </DashboardLayout>
  );
}
