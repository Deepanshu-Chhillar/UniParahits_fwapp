'use client';

import React, { useState } from 'react';
import { useUniStore } from '@/lib/data/useUniStore';
import { ZeniTransaction, ManaTransaction } from '@/lib/types';
import { ArrowDownLeft, ArrowUpRight, Lock, Unlock, FileText, Sparkles, Coins } from 'lucide-react';

interface TransactionListProps {
  filterType?: 'ALL' | 'ZENI' | 'MANA';
}

export default function TransactionList({ filterType = 'ALL' }: TransactionListProps) {
  const { zeniTransactions, manaTransactions, currentUser } = useUniStore();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ZENI' | 'MANA'>(filterType);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 bg-white dark:bg-[#111333] shadow-sm dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-border/50">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-muted-foreground block font-semibold">
            Immutable Audit Ledger
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-foreground">Transaction History</h3>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-secondary/80 border border-slate-200 dark:border-border/60 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ALL' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
          >
            All Movements
          </button>
          <button
            onClick={() => setActiveTab('ZENI')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'ZENI' ? 'bg-emerald-600 dark:bg-emerald-500 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
          >
            <Coins className="w-3.5 h-3.5" /> ZENI (₹)
          </button>
          <button
            onClick={() => setActiveTab('MANA')}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'MANA' ? 'bg-purple-600 dark:bg-purple-500 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> MANA (XP)
          </button>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="space-y-2">
        {activeTab !== 'MANA' &&
          zeniTransactions.map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border/40 hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPositive
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                        : 'bg-rose-100 dark:bg-red-500/20 text-rose-700 dark:text-red-400 border border-rose-300 dark:border-red-500/40'
                    }`}
                  >
                    {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-foreground">{tx.reason}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-secondary text-[10px] font-mono text-slate-700 dark:text-muted-foreground font-semibold">
                        {tx.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-muted-foreground mt-0.5 font-mono">
                      <span>ID: {tx.id}</span>
                      <span>•</span>
                      <span>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <span
                    className={`text-sm font-mono font-extrabold ${
                      isPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-red-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()} ZENI
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-muted-foreground block font-mono">
                    Bal After: ₹{tx.balanceAfter.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}

        {activeTab !== 'ZENI' &&
          manaTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border/40 hover:border-purple-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-foreground">{tx.sourceReason}</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-500/10 text-[10px] font-mono text-purple-700 dark:text-purple-300 font-semibold">
                      MANA XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-muted-foreground mt-0.5 font-mono">
                    <span>ID: {tx.id}</span>
                    <span>•</span>
                    <span>{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-right sm:flex-shrink-0">
                <span className="text-sm font-mono font-extrabold text-purple-700 dark:text-purple-300">
                  +{tx.amount.toLocaleString()} MANA
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400/70 block">Verified Contribution</span>
              </div>
            </div>
          ))}

        {zeniTransactions.length === 0 && manaTransactions.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-muted-foreground text-center py-8">No transactions recorded yet.</p>
        )}
      </div>
    </div>
  );
}
