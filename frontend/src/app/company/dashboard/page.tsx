'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  Building2,
  Briefcase,
  Users,
  Lock,
  PlusCircle,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FolderGit2,
  Zap,
  Check,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCode
} from 'lucide-react';

export default function CompanyDashboardPage() {
  const { companyProfile, bounties, escrows, approveProjectAndReleaseEscrow } = useUniStore();

  const [escrowReleased, setEscrowReleased] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRelease = () => {
    setEscrowReleased(true);
    showToast('Escrow Settled: 51,000 ZENI (85%) disbursed to CyberForge Guild, 9,000 ZENI (15%) to Platform.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-black font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* AUTONOMOUS ESCROW SETTLEMENT FABRIC HEADER (Stitch S2)   */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white">
                    NovaTech Labs
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono text-xs font-bold">
                    Enterprise Partner #NOV-89
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body">
                  Autonomous Escrow Settlement Fabric & Corporate Work Terminal
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audited Capital Reserve: 100% Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Locked Escrow Vault</span>
                <span className="text-base font-bold text-amber-500">
                  {escrowReleased ? '0 ZENI' : '60,000 ZENI'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Protocol Fee Split</span>
                <span className="text-base font-bold text-purple-400">85% / 15%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Hired Guild</span>
                <span className="text-base font-bold text-cyan-400">CyberForge</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Settlement Speed</span>
                <span className="text-base font-bold text-emerald-500">Instant</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* ACTIVE BOUNTY & SMART ESCROW RELEASE (Stitch Screen 2)   */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Escrow Terminal (8 Cols) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                  Active Multi-Sig Contract
                </span>
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  Build Student Hiring Platform & Escrow Engine
                </h2>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  Target Pull Request: NovaTech-Core #PR-892 // Arbitrum Sepolia
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                escrowReleased
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
              }`}>
                {escrowReleased ? 'SETTLED & DISBURSED' : 'ESCROW LOCKED (60,000 ZENI)'}
              </span>
            </div>

            {/* Milestones Stepper */}
            <div className="space-y-3 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block">
                Contract Milestones & Technical Verification
              </span>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
                {[
                  {
                    num: '01',
                    title: 'Distributed Redis Vector Cache Architecture',
                    reward: '₹20,000',
                    status: 'APPROVED & SIGNED',
                    complete: true,
                  },
                  {
                    num: '02',
                    title: 'WASM Sandboxed Micro-VM Isolation',
                    reward: '₹20,000',
                    status: 'APPROVED & SIGNED',
                    complete: true,
                  },
                  {
                    num: '03',
                    title: 'Zero-Knowledge Circuit Prover for SBTs',
                    reward: '₹20,000',
                    status: escrowReleased ? 'APPROVED & SIGNED' : 'PENDING FINAL SIGN-OFF',
                    complete: escrowReleased,
                  },
                ].map((m) => (
                  <div key={m.num} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#171A42] border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-400">{m.num}</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{m.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Vault: {m.reward} ZENI</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      m.complete ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger 85/15 Escrow Release */}
            <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white">
                  Execute Smart Escrow Settlement
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-body">
                  Approving releases 51,000 ZENI (85%) to CyberForge Guild and 9,000 ZENI (15%) to UniParahits.
                </p>
              </div>
              <button
                type="button"
                disabled={escrowReleased}
                onClick={handleRelease}
                className={`py-3 px-5 rounded-xl font-mono text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 ${
                  escrowReleased
                    ? 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-95'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{escrowReleased ? 'Escrow Released' : 'Approve & Release (85/15)'}</span>
              </button>
            </div>
          </div>

          {/* Escrow Split Calculator Card (4 Cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-5 font-mono text-xs">
            <div className="pb-3 border-b border-slate-200 dark:border-white/10">
              <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Multi-Sig Settlement Breakdown
              </span>
              <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white mt-1">
                60,000 ZENI Total Contract
              </h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-bold uppercase">CyberForge Guild (85%)</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">NET</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  51,000 ZENI
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Disbursed: Priya (45%), Rahul (35%), Aarav (20%)
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 font-bold uppercase">Platform Protocol Fee (15%)</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">FIXED</span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  9,000 ZENI
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Funds campus validator nodes & mentor rewards.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
              <span className="font-bold block mb-1">Arbitrum Sepolia Contract:</span>
              <span className="text-[10px] text-slate-400 break-all">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
