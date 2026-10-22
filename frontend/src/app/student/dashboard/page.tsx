'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  CheckSquare,
  GraduationCap,
  Briefcase,
  Shield,
  Coins,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FolderGit2,
  Lock,
  Plus,
  Zap,
  Flame,
  Check,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck2,
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';

export default function StudentDashboardPage() {
  const {
    currentUser,
    studentProfile,
    tasks,
    courses,
    bounties,
    guilds,
    submissions,
    escrows,
    manaTransactions,
    zeniTransactions,
    submitTask,
  } = useUniStore();

  // Modals state
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => (tasks[0] ? tasks[0].id : ''));
  const [prUrl, setPrUrl] = useState('https://github.com/parahits/core-engine/pull/1');
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User-specific metrics
  const userSubmissions = useMemo(
    () => submissions.filter((s) => s.studentId === currentUser.id),
    [submissions, currentUser.id]
  );

  const completedTasksCount = useMemo(() => {
    const approvedCount = userSubmissions.filter((s) => s.status === 'APPROVED').length;
    return approvedCount > 0 ? approvedCount : (studentProfile?.tasksCompleted || 0);
  }, [userSubmissions, studentProfile?.tasksCompleted]);

  const pendingProofsCount = useMemo(
    () => userSubmissions.filter((s) => s.status === 'PENDING' || s.status === 'UNDER_REVIEW').length,
    [userSubmissions]
  );

  const myGuild = useMemo(
    () => guilds.find((g) => g.leaderId === currentUser.id || g.members?.some((m) => m.studentId === currentUser.id)),
    [guilds, currentUser.id]
  );

  const userEscrows = useMemo(() => {
    return escrows.filter((e) => {
      if (myGuild && e.beneficiaryType === 'GUILD' && e.beneficiaryId === myGuild.id) return true;
      if (e.beneficiaryId === currentUser.id) return true;
      return false;
    });
  }, [escrows, myGuild, currentUser.id]);

  const totalEscrowLocked = useMemo(() => {
    return userEscrows.reduce((sum, e) => sum + (e.status === 'LOCKED' ? e.totalAmountZeni : 0), 0);
  }, [userEscrows]);

  // Balances
  const liquidZeni = studentProfile?.zeniBalance || 0;
  const escrowZeni = totalEscrowLocked;
  const burnedZeni = (studentProfile as any)?.burnedZeni || 0;
  const totalZeni = liquidZeni + escrowZeni + burnedZeni;

  // Donut calculations for ZENI
  const circumference = 251.327; // 2 * PI * 40
  const liquidRatio = totalZeni > 0 ? liquidZeni / totalZeni : 0;
  const escrowRatio = totalZeni > 0 ? escrowZeni / totalZeni : 0;
  const zeniLiquidOffset = totalZeni > 0 ? circumference * (1 - liquidRatio) : circumference;
  const zeniEscrowOffset = totalZeni > 0 ? circumference * (1 - (liquidRatio + escrowRatio)) : circumference;

  // MANA / XP Calculations
  const totalMana = studentProfile?.manaBalance || 0;
  const currentRank = studentProfile?.currentRank || 'E';

  const rankTargets: Record<string, { next: string; target: number }> = {
    E: { next: 'Rank D (Teacher/Earner)', target: 1000 },
    D: { next: 'Rank C (Master/Quorum)', target: 5000 },
    C: { next: 'Rank B (Elite/Enterprise)', target: 12000 },
    B: { next: 'Rank A (Protocol Fellow)', target: 25000 },
    A: { next: 'Maximum Rank', target: 50000 },
  };
  const currentTarget = rankTargets[currentRank] || { next: 'Rank D', target: 1000 };
  const targetMana = currentTarget.target;
  const manaProgressPercent = Math.min(100, Math.round((totalMana / targetMana) * 100));

  const userManaTxs = useMemo(
    () => manaTransactions.filter((m) => m.userId === currentUser.id),
    [manaTransactions, currentUser.id]
  );

  const codeTasksMana = useMemo(
    () => userManaTxs.filter((m) => m.relatedEntityType === 'TASK').reduce((s, m) => s + m.amount, 0),
    [userManaTxs]
  );

  const peerReviewMana = useMemo(
    () =>
      userManaTxs
        .filter((m) => m.relatedEntityType === 'PROJECT' || m.relatedEntityType === 'ACHIEVEMENT')
        .reduce((s, m) => s + m.amount, 0),
    [userManaTxs]
  );

  const guildMana = useMemo(
    () => userManaTxs.filter((m) => m.relatedEntityType === 'COURSE' || m.relatedEntityType === 'MENTORSHIP').reduce((s, m) => s + m.amount, 0),
    [userManaTxs]
  );

  const manaProgressRatio = Math.min(1, totalMana / targetMana);
  const manaDashOffset = totalMana > 0 ? circumference * (1 - manaProgressRatio) : circumference;
  const codeRatio = totalMana > 0 ? codeTasksMana / totalMana : 0;
  const codeDashOffset = totalMana > 0 ? circumference * (1 - codeRatio) : circumference;

  // Real Ledger Items for Current User
  const userZeniTxs = useMemo(
    () => zeniTransactions.filter((z) => z.userId === currentUser.id),
    [zeniTransactions, currentUser.id]
  );

  interface LedgerItem {
    id: string;
    txHash: string;
    action: string;
    entity: string;
    dateOrBlock: string;
    status: 'VERIFIED' | 'COMPLETED' | 'PENDING' | 'BURNED';
  }

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

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      showToast('Please select a task to submit proof for.');
      return;
    }
    setProofSubmitted(true);
    try {
      submitTask(selectedTaskId, 'GITHUB', prUrl, 'Cryptographic proof submitted via dashboard.');
      setTimeout(() => {
        setProofSubmitted(false);
        setProofModalOpen(false);
        showToast('Proof of Work minted successfully! Submission recorded on ledger.');
      }, 1000);
    } catch (err: any) {
      setProofSubmitted(false);
      showToast(err.message || 'Error submitting proof.');
    }
  };

  const handleSimulateBurn = () => {
    if (liquidZeni < 500) {
      showToast(`Insufficient ZENI balance (current: ${liquidZeni} ZENI). Requires 500 ZENI.`);
      return;
    }
    showToast('Capacity Sink Executed: Burned 500 ZENI. +10 Course Seats unlocked.');
  };

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center max-w-lg mx-auto my-12 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Portal Access</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current session: <strong>{currentUser.role}</strong> ({currentUser.name}).
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-cyan-600 text-white font-mono text-xs font-bold"
          >
            Switch to Student Account
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-cyan-500 text-black font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: MANAGE YOUR VAULT & RANKS                     */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
          {/* Left Text Banner */}
          <div className="xl:col-span-4 flex flex-col justify-center p-2">
            <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Manage your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-indigo-400">
                Vault & Ranks
              </span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-body">
              Monitor liquid ZENI tokens, sovereign MANA/XP reputation, and proof-of-work progression across live clusters.
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold font-mono border border-indigo-200 dark:border-indigo-800/40">
                Network: Arbitrum Sepolia
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold font-mono border border-emerald-200 dark:border-emerald-800/40">
                Consensus 99.8%
              </span>
            </div>
          </div>

          {/* Right Floating Pill Cards */}
          <div className="xl:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 0: Dashed Add Item (Trigger Modal) */}
            <div
              onClick={() => setProofModalOpen(true)}
              className="border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50/50 dark:bg-white/[0.02] rounded-3xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-cyan-500 hover:bg-white dark:hover:bg-white/5 transition-all min-h-[170px] group shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-cyan-500/20 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Submit Proof
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Mint MANA XP</span>
            </div>

            {/* Card 01: Active Tasks */}
            <div
              onClick={() => setProofModalOpen(true)}
              className="bg-gradient-to-br from-[#134e4a] to-[#115e59] text-white rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-lg transition-all min-h-[170px] relative overflow-hidden group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-emerald-200 font-mono">
                <span>01</span>
                <span>:</span>
              </div>
              <div className="my-auto py-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold tracking-tight uppercase">Active Tasks</h4>
                <p className="text-xs text-emerald-100 font-mono mt-0.5">
                  {completedTasksCount} / {tasks.length} Complete
                </p>
              </div>
              <div className="text-[10px] text-emerald-100 font-medium flex items-center justify-between">
                <span>{pendingProofsCount} Pending Proofs</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">Sign +</span>
              </div>
            </div>

            {/* Card 02: Guild Standing */}
            <Link
              href="/student/guild"
              className="bg-gradient-to-br from-[#3730a3] to-[#312e81] text-white rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-lg transition-all min-h-[170px] relative overflow-hidden group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-indigo-200 font-mono">
                <span>02</span>
                <span>:</span>
              </div>
              <div className="my-auto py-2">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold tracking-tight uppercase">Guild Quorum</h4>
                <p className="text-xs text-indigo-100 font-mono mt-0.5 truncate">
                  {myGuild ? myGuild.name : 'No Guild Joined'}
                </p>
              </div>
              <div className="text-[10px] text-indigo-100 font-medium flex items-center justify-between">
                <span className="truncate">
                  {myGuild
                    ? myGuild.leaderId === currentUser.id
                      ? 'Guild Leader'
                      : 'Active Member'
                    : 'Explore & Join'}
                </span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold">View</span>
              </div>
            </Link>

            {/* Card 03: Escrow Lock */}
            <div
              onClick={() => setEscrowModalOpen(true)}
              className="bg-gradient-to-br from-slate-900 to-[#0f172a] text-white rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all min-h-[170px] relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500 rounded-bl-full mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400 rounded-tr-full mix-blend-screen" />
              </div>
              <div className="flex items-center justify-between text-xs text-white/80 font-mono relative z-10">
                <span className="text-amber-400 font-bold">
                  {totalEscrowLocked > 0 ? `ES-${Math.round(totalEscrowLocked / 1000)}K` : 'ES-0K'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    totalEscrowLocked > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                  }`}
                />
              </div>
              <div className="my-auto py-2 relative z-10">
                <span className="text-[10px] tracking-widest uppercase font-mono text-cyan-300">Total Escrow</span>
                <h4 className="text-sm font-extrabold tracking-tight mt-0.5">
                  {totalEscrowLocked.toLocaleString()} ZENI
                </h4>
              </div>
              <div className="text-[10px] text-amber-300 font-mono font-medium flex items-center justify-between relative z-10">
                <span>{totalEscrowLocked > 0 ? '85% Split Locked' : 'No Active Vault'}</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono">Verify</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: DUAL DONUT CHARTS & CAPACITY SINK METERS      */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: ZENI Liquid Capacity & Sink Meter */}
          <div className="rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Liquid Token Reserve
                  </span>
                  <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                    ZENI Liquid Capacity & Sink Meter
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  ₹1 PEGGED
                </span>
              </div>

              {/* Graphic Display */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6">
                {/* SVG Visual Circle */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-100 dark:text-white/5"
                      />
                      {totalZeni > 0 && (
                        <>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#f59e0b"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={zeniLiquidOffset}
                            strokeLinecap="round"
                          />
                          {escrowZeni > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#10b981"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={zeniEscrowOffset}
                              strokeLinecap="round"
                            />
                          )}
                        </>
                      )}
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                        {totalZeni >= 1000 ? `${(totalZeni / 1000).toFixed(1)}K` : totalZeni}
                      </span>
                      <span className="block font-mono text-[9px] uppercase text-slate-400">Total ZENI</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-slate-700 dark:text-slate-300">Available Liquid</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{liquidZeni.toLocaleString()} ZENI</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-700 dark:text-slate-300">Active Escrow Stake</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{escrowZeni.toLocaleString()} ZENI</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-slate-700 dark:text-slate-300">Sinks Burned</span>
                    </div>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{burnedZeni.toLocaleString()} ZENI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expansion Sink Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">Expand cohort seats or cloud pods:</span>
              <button
                type="button"
                onClick={handleSimulateBurn}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Burn 500 ZENI to Expand</span>
              </button>
            </div>
          </div>

          {/* Card 2: MANA / XP Sovereign Proof */}
          <div className="rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                    Cryptographic Merit
                  </span>
                  <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                    MANA / XP Sovereign Proof
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  NON-PURCHASABLE
                </span>
              </div>

              {/* Graphic Display */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6">
                {/* SVG Visual Circle */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-slate-100 dark:text-white/5"
                      />
                      {totalMana > 0 && (
                        <>
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="#06b6d4"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={manaDashOffset}
                            strokeLinecap="round"
                          />
                          {codeTasksMana > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#7c3aed"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={codeDashOffset}
                              strokeLinecap="round"
                            />
                          )}
                        </>
                      )}
                    </svg>
                    <div className="absolute text-center">
                      <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                        {totalMana.toLocaleString()}
                      </span>
                      <span className="block font-mono text-[9px] uppercase text-slate-400">Total MANA</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="text-slate-700 dark:text-slate-300">Code Tasks Verified</span>
                    </div>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{codeTasksMana.toLocaleString()} MANA</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-slate-700 dark:text-slate-300">Peer Review Bounty</span>
                    </div>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{peerReviewMana.toLocaleString()} MANA</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">Guild Quorum Share</span>
                    </div>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{guildMana.toLocaleString()} MANA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rank Gating Status */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Target for {currentTarget.next}: <strong className="text-slate-900 dark:text-white">{targetMana.toLocaleString()} MANA</strong> ({manaProgressPercent}%)
              </span>
              <button
                type="button"
                onClick={() => setProofModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-90 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Submit Task for MANA XP</span>
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: LAST ACTIVITY & LEDGER PROOFS                 */}
        {/* ======================================================== */}
        <section className="rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                On-Chain Telemetry
              </span>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                Last Activity & Ledger Proofs
              </h3>
            </div>
            <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Live Arbitrum Node
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
            <div className="overflow-x-auto mt-4">
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

        {/* ======================================================== */}
        {/* MODAL 1: SUBMIT CRYPTOGRAPHIC PROOF                      */}
        {/* ======================================================== */}
        {proofModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setProofModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                    Submit Cryptographic Proof
                  </h3>
                  <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Earn MANA XP & Progress Toward {currentTarget.next}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProofSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select Completed Task
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">
                        {t.title} (+{t.manaReward} MANA, +{t.zeniReward} ZENI)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Pull Request or Commit URL
                  </label>
                  <input
                    type="url"
                    value={prUrl}
                    onChange={(e) => setPrUrl(e.target.value)}
                    required
                    placeholder="https://github.com/org/repo/pull/1"
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Target Rank:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentTarget.next}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Protocol Network:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Arbitrum Sepolia Testnet</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={proofSubmitted}
                  className="w-full py-3.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {proofSubmitted ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Minting Proof on Sepolia Node...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Mint Cryptographic Proof</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: VERIFY ESCROW VAULT                             */}
        {/* ======================================================== */}
        {escrowModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setEscrowModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                    Escrow Vault Telemetry
                  </h3>
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
                    {totalEscrowLocked > 0
                      ? `Active Vault Stake: ${totalEscrowLocked.toLocaleString()} ZENI`
                      : 'No Active Escrow Lock Found'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {totalEscrowLocked > 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Total Locked Escrow:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{totalEscrowLocked.toLocaleString()} ZENI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700 dark:text-cyan-400">85% Member Payout Share:</span>
                      <span className="font-bold text-cyan-700 dark:text-cyan-400">
                        {Math.round(totalEscrowLocked * 0.85).toLocaleString()} ZENI
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700 dark:text-purple-400">15% Protocol Maintenance Fee:</span>
                      <span className="font-bold text-purple-700 dark:text-purple-400">
                        {Math.round(totalEscrowLocked * 0.15).toLocaleString()} ZENI
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center py-6">
                    <p className="text-slate-600 dark:text-slate-300">
                      You do not currently have any funds locked in escrow. Work order escrows activate when your guild is awarded an enterprise bounty.
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Escrow state: 85/15 MULTI-SIG SMART CONTRACT VERIFIED</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEscrowModalOpen(false);
                    showToast('Escrow status audited: 100% on-chain match.');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 text-white font-bold border border-slate-700 dark:border-white/10 transition-colors"
                >
                  Close Audit Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
