'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  Wallet,
  Coins,
  Sparkles,
  GraduationCap,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  CheckCircle,
  Clock,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Filter,
  FileSpreadsheet,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

type FilterTab = 'ALL' | 'COURSE_REVENUE' | 'CAPACITY_BURNS' | 'MENTORSHIP' | 'MANA_XP';

interface TeacherLedgerEntry {
  id: string;
  txHash: string;
  type: 'COURSE_REVENUE' | 'CAPACITY_BURN' | 'MENTORSHIP_AWARD' | 'COURSE_PURCHASE' | 'PLATFORM_FEE' | 'MANA_EARN';
  categoryLabel: string;
  description: string;
  date: string;
  amountZeni?: number;
  amountMana?: number;
  status: 'COMPLETED' | 'BURNED' | 'VERIFIED' | 'PENDING';
}

export default function TeacherWalletPage() {
  const { currentUser, studentProfile, courses, zeniTransactions, manaTransactions } = useUniStore();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  // Teacher's courses
  const myCourses = useMemo(
    () => courses.filter((c) => c.teacherId === currentUser.id || currentUser.role === 'ADMIN'),
    [courses, currentUser.id, currentUser.role]
  );

  // Authenticated user's real transactions
  const userZeniTxs = useMemo(
    () => (zeniTransactions || []).filter((z) => z.userId === currentUser.id),
    [zeniTransactions, currentUser.id]
  );

  const userManaTxs = useMemo(
    () => (manaTransactions || []).filter((m) => m.userId === currentUser.id),
    [manaTransactions, currentUser.id]
  );

  // Derived financial statistics
  const totalCourseRevenue = useMemo(() => {
    return userZeniTxs
      .filter((z) => z.type === 'EARN' && z.amount > 0)
      .reduce((acc, z) => acc + z.amount, 0);
  }, [userZeniTxs]);

  const totalCapacityBurned = useMemo(() => {
    return userZeniTxs
      .filter((z) => z.type === 'CAPACITY_UPGRADE')
      .reduce((acc, z) => acc + Math.abs(z.amount), 0);
  }, [userZeniTxs]);

  const totalMentorshipMana = useMemo(() => {
    return userManaTxs
      .filter((m) => m.relatedEntityType === 'MENTORSHIP')
      .reduce((acc, m) => acc + m.amount, 0);
  }, [userManaTxs]);

  const totalEnrolledStudents = useMemo(() => {
    return myCourses.reduce((acc, c) => acc + c.enrolledCount, 0);
  }, [myCourses]);

  // Unified ledger list
  const ledgerEntries = useMemo<TeacherLedgerEntry[]>(() => {
    const list: TeacherLedgerEntry[] = [];

    // Process ZENI Transactions
    userZeniTxs.forEach((z, idx) => {
      const isCapacityBurn = z.type === 'CAPACITY_UPGRADE';
      const isCourseRev = z.type === 'EARN';
      list.push({
        id: z.id,
        txHash: `0x${z.id.replace(/[^a-f0-9]/gi, '').padEnd(4, '0').slice(0, 4)}...${z.id.slice(-4)}`,
        type: isCapacityBurn ? 'CAPACITY_BURN' : isCourseRev ? 'COURSE_REVENUE' : 'COURSE_PURCHASE',
        categoryLabel: isCapacityBurn ? 'CAPACITY SINK BURN' : isCourseRev ? 'COURSE REVENUE (85%)' : z.type,
        description: z.reason,
        date: new Date(z.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
              new Date(z.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amountZeni: z.amount,
        status: isCapacityBurn ? 'BURNED' : 'COMPLETED',
      });
    });

    // Process MANA Transactions
    userManaTxs.forEach((m, idx) => {
      const isMentorship = m.relatedEntityType === 'MENTORSHIP';
      list.push({
        id: m.id,
        txHash: `0x${m.id.replace(/[^a-f0-9]/gi, '').padEnd(4, '0').slice(0, 4)}...${m.id.slice(-4)}`,
        type: isMentorship ? 'MENTORSHIP_AWARD' : 'MANA_EARN',
        categoryLabel: isMentorship ? 'PEER MENTORSHIP PROOF' : 'TEACHING CONTRIBUTION',
        description: m.sourceReason,
        date: new Date(m.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
              new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amountMana: m.amount,
        status: 'VERIFIED',
      });
    });

    return list;
  }, [userZeniTxs, userManaTxs]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    if (activeTab === 'ALL') return ledgerEntries;
    if (activeTab === 'COURSE_REVENUE') return ledgerEntries.filter((e) => e.type === 'COURSE_REVENUE');
    if (activeTab === 'CAPACITY_BURNS') return ledgerEntries.filter((e) => e.type === 'CAPACITY_BURN');
    if (activeTab === 'MENTORSHIP') return ledgerEntries.filter((e) => e.type === 'MENTORSHIP_AWARD');
    if (activeTab === 'MANA_XP') return ledgerEntries.filter((e) => e.amountMana !== undefined);
    return ledgerEntries;
  }, [ledgerEntries, activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/teacher/dashboard"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                Teacher Dashboard
              </Link>
              <span className="text-muted-foreground text-xs">/</span>
              <span className="text-xs text-emerald-500 font-mono font-bold uppercase tracking-wider">
                Financial Vault &amp; Revenue
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold font-mono border border-emerald-200 dark:border-emerald-500/30">
                85% INSTRUCTOR PAYOUT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 dark:text-white">
              Instructor Financial Vault &amp; Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-body">
              Verified on-chain telemetry of course enrollments, deflationary seat capacity burns, and mentorship rewards.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Link
              href="/teacher/courses"
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-mono text-xs font-bold border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>Manage Batches</span>
            </Link>
            <Link
              href="/teacher/courses/new"
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Course</span>
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4 REVENUE & BALANCE METRIC CARDS                         */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available ZENI Balance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Available Balance
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-headline text-emerald-600 dark:text-emerald-400 block">
                ₹{(studentProfile?.zeniBalance || 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                ZENI (1 ZENI = ₹1 INR)
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Directly withdrawable to bank</span>
            </div>
          </div>

          {/* Card 2: Cumulative Course Revenue */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Lifetime Teaching Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-headline text-slate-900 dark:text-white block">
                ₹{totalCourseRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                85% Net Instructor Share
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{totalEnrolledStudents} Students taught across {myCourses.length} Batches</span>
            </div>
          </div>

          {/* Card 3: Deflationary Sinks Burned */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Capacity Sinks Burned
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-headline text-amber-500 block">
                ₹{totalCapacityBurned.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                Deflationary Compute Burn
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>500 ZENI burned per +10 seats</span>
            </div>
          </div>

          {/* Card 4: Mentorship & XP MANA */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Mentorship &amp; XP MANA
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-headline text-purple-600 dark:text-purple-400 block">
                {(studentProfile?.manaBalance || 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                Learning &amp; Review Contribution
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>+{totalMentorshipMana} MANA from Apprentice Reviews</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PROTOCOL ECONOMIC ARCHITECTURE EXPLAINER                 */}
        {/* ======================================================== */}
        <section className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111333]/60 border border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="font-headline text-sm font-bold text-slate-900 dark:text-white">
                Teacher Economic Flow // Smart Contract 85/15 Settlement
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Contract Verified • Arbitrum L2 Escrow
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="font-mono text-[10px] text-emerald-500 font-bold uppercase block">
                1. 85% Instructor Royalties
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                When a student enrolls in a 2,000 ZENI course, 1,700 ZENI (85%) is immediately deposited into your Teacher Wallet without middleman holdbacks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="font-mono text-[10px] text-blue-500 font-bold uppercase block">
                2. 15% Protocol Escrow Reserve
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                300 ZENI (15%) goes to the UniParahits network treasury for dispute resolution, Google Meet server bandwidth, and student guarantee funds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
              <span className="font-mono text-[10px] text-amber-500 font-bold uppercase block">
                3. Deflationary Seat Expansion
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Initial capacity is capped at 10 students. Expanding by 10 seats burns 500 ZENI from teacher earnings, curbing token inflation and ensuring batch quality.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TEACHER-SPECIFIC TRANSACTION LEDGER                      */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <h2 className="font-headline text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Teacher Account Ledger &amp; Cryptographic Proofs
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Authorized financial records matching authenticated instructor account ({currentUser.name}).
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Records ({ledgerEntries.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('COURSE_REVENUE')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                  activeTab === 'COURSE_REVENUE'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Course Revenue
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('CAPACITY_BURNS')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                  activeTab === 'CAPACITY_BURNS'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 shadow-sm border border-amber-500/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Capacity Sinks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('MENTORSHIP')}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold cursor-pointer ${
                  activeTab === 'MENTORSHIP'
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 shadow-sm border border-purple-500/30'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mentorship
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Coins className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
              <p className="text-xs text-slate-500 font-mono">No financial records found matching this category filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden font-mono text-xs">
              {filteredEntries.map((entry) => {
                const isZeni = entry.amountZeni !== undefined;
                const isPositive = isZeni ? (entry.amountZeni || 0) > 0 : true;

                return (
                  <div
                    key={entry.id}
                    className="p-4 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white">{entry.txHash}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            entry.type === 'CAPACITY_BURN'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : entry.type === 'COURSE_REVENUE'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          {entry.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">{entry.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-sans text-xs">
                        {entry.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                      {isZeni ? (
                        <div className="text-right">
                          <span
                            className={`text-sm font-extrabold block ${
                              isPositive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-500'
                            }`}
                          >
                            {isPositive ? '+' : ''}{entry.amountZeni?.toLocaleString()} ZENI
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">
                            {isPositive ? 'Revenue Credit' : 'Deflationary Burn'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 block">
                            +{entry.amountMana} MANA
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans">XP Mint</span>
                        </div>
                      )}

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          entry.status === 'BURNED'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
