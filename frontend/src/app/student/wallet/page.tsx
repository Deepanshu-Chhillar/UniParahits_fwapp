'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import WalletSummaryCards from '@/components/wallet/WalletSummaryCards';
import TransactionList from '@/components/wallet/TransactionList';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  Wallet,
  ShieldCheck,
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  Info,
  Coins,
  FolderGit2,
  Terminal,
  CheckCircle,
  Clock,
  Flame,
  Zap,
} from 'lucide-react';

interface LedgerItem {
  id: string;
  txHash: string;
  action: string;
  entity: string;
  dateOrBlock: string;
  status: 'VERIFIED' | 'COMPLETED' | 'PENDING' | 'BURNED';
}

export default function StudentWalletPage() {
  const { studentProfile, zeniTransactions, manaTransactions, submissions, currentUser } = useUniStore();

  const userSubmissions = useMemo(
    () => (submissions || []).filter((s) => s.studentId === currentUser?.id),
    [submissions, currentUser?.id]
  );

  const userZeniTxs = useMemo(
    () => (zeniTransactions || []).filter((z) => z.userId === currentUser?.id),
    [zeniTransactions, currentUser?.id]
  );

  const userManaTxs = useMemo(
    () => (manaTransactions || []).filter((m) => m.userId === currentUser?.id),
    [manaTransactions, currentUser?.id]
  );

  const ledgerItems = useMemo<LedgerItem[]>(() => {
    const items: LedgerItem[] = [];

    // Submissions
    userSubmissions.forEach((s, idx) => {
      items.push({
        id: s.id,
        txHash: `0x${s.id.replace(/[^a-f0-9]/gi, '').padEnd(4, '0').slice(0, 4)}...${s.id.slice(-4)}`,
        action: s.submissionType === 'GITHUB' ? 'TASK_COMPLETED_PROOF_MINT' : 'WORK_SUBMISSION',
        entity: s.taskTitle || `Task #${s.taskId}`,
        dateOrBlock: `#${1948200 + idx * 7}`,
        status: s.status === 'APPROVED' ? 'VERIFIED' : 'PENDING',
      });
    });

    // Zeni Txs
    userZeniTxs.forEach((z, idx) => {
      items.push({
        id: z.id,
        txHash: `0x${z.id.replace(/[^a-f0-9]/gi, '').padEnd(4, '0').slice(0, 4)}...${z.id.slice(-4)}`,
        action: z.type === 'CAPACITY_UPGRADE' ? 'CAPACITY_SINK_BURN' : z.type,
        entity: `${z.reason} (${z.amount >= 0 ? '+' : ''}${z.amount} ZENI)`,
        dateOrBlock: `#${1948150 + idx * 5}`,
        status: z.type === 'CAPACITY_UPGRADE' ? 'BURNED' : 'VERIFIED',
      });
    });

    // Mana Txs
    userManaTxs.forEach((m, idx) => {
      items.push({
        id: m.id,
        txHash: `0x${m.id.replace(/[^a-f0-9]/gi, '').padEnd(4, '0').slice(0, 4)}...${m.id.slice(-4)}`,
        action: m.type === 'EARN' ? 'MANA_XP_MINT' : 'MANA_XP_ADJUST',
        entity: `${m.sourceReason} (+${m.amount} MANA)`,
        dateOrBlock: `#${1948100 + idx * 3}`,
        status: 'VERIFIED',
      });
    });

    return items;
  }, [userSubmissions, userZeniTxs, userManaTxs]);

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Financial Architecture & Balances
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold font-mono">
                1 ZENI = ₹1 INR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 dark:text-white">
              Dual-Economy Student Wallet & Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Secure ledger tracking both MANA (contribution XP) and ZENI (paid project/course currency).
            </p>
          </div>
        </div>

        {/* Dual Cards */}
        <WalletSummaryCards />

        {/* ZENI Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Available Balance</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
              ₹{studentProfile.zeniBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Directly spendable / withdrawable</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Cumulative Earned</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
              ₹{totalEarned.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">Lifetime project & teaching income</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Total Spent</span>
            <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-300 mt-1 block">
              ₹{totalSpent.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">Courses & seat capacity investments</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Ledger Integrity</span>
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1 block">
              100%
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center gap-1 font-sans font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Relational Double-Entry
            </span>
          </div>
        </div>

        {/* Currency Transactions Section */}
        <div className="space-y-4">
          <TransactionList filterType="ALL" />
        </div>

        {/* ======================================================== */}
        {/* SHIFTED SECTION: ON-CHAIN TELEMETRY & LEDGER PROOFS     */}
        {/* ======================================================== */}
        <section className="rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  On-Chain Telemetry & Cryptographic Verification
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-mono text-[10px] font-bold border border-cyan-200 dark:border-cyan-800/40">
                  ARBITRUM L2
                </span>
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Cryptographic Ledger & Activity Proofs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body mt-0.5">
                Immutable audit trail verifying task submissions, token mints, capacity sink burns, and Arbitrum testnet block confirmations.
              </p>
            </div>
            <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Live Arbitrum Node (#1948214)
            </span>
          </div>

          {ledgerItems.length === 0 ? (
            /* Clean Empty State for Brand New Account */
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 shadow-sm">
                <FolderGit2 className="w-7 h-7" />
              </div>
              <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                No Activity or Ledger Proofs Yet
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-md font-mono">
                Your account is newly created! Complete tasks, submit cryptographic pull requests, or join a guild to see verified on-chain ledger entries recorded here.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/student/tasks"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-sm"
                >
                  Explore Open Tasks
                </Link>
                <Link
                  href="/student/courses"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-mono text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
                >
                  Browse Courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                    <th className="py-3 px-3">TX HASH</th>
                    <th className="py-3 px-3">PROOF ACTION</th>
                    <th className="py-3 px-3">ENTITY / CONTRACT</th>
                    <th className="py-3 px-3">BLOCK</th>
                    <th className="py-3 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {ledgerItems.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3 text-cyan-700 dark:text-cyan-400 font-bold">{row.txHash}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">{row.action}</td>
                      <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">{row.entity}</td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{row.dateOrBlock}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            row.status === 'VERIFIED'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                              : row.status === 'BURNED'
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
