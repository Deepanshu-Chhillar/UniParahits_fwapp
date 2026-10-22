'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  Shield,
  Users,
  PlusCircle,
  Briefcase,
  Coins,
  CheckCircle,
  Sparkles,
  Lock,
  Vote,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X,
  UserPlus,
  Layers,
  ArrowRight,
  CheckSquare,
  Clock,
  Award,
  Terminal,
  GraduationCap
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';
import TaskCard from '@/components/tasks/TaskCard';

interface GuildHubViewProps {
  portalType?: 'student' | 'teacher';
}

export default function GuildHubView({ portalType = 'student' }: GuildHubViewProps) {
  const { guilds, currentUser, studentProfile, createGuild, joinGuild, tasks } = useUniStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [guildName, setGuildName] = useState('');
  const [tagline, setTagline] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isTeacherPortal = portalType === 'teacher';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Find user's guild (if any)
  const myGuild = guilds.find(
    (g) => g.leaderId === currentUser.id || g.members?.some((m) => m.studentId === currentUser.id)
  );

  // Relevant guild tasks from task pool (tasks matching guild skills or high-impact tasks)
  const guildSkills = myGuild?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'UI/UX'];
  const guildTasks = tasks.filter((t) =>
    t.requiredSkills.some((s) => guildSkills.includes(s)) || t.category === 'Full Stack' || t.category === 'Backend'
  ).slice(0, 3);

  const handleCreateGuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guildName.trim()) return;

    if (studentProfile?.currentRank === 'E' || studentProfile?.currentRank === 'D') {
      showToast('Deploying a new guild requires Rank C (Master/Quorum). Advance your rank or join an existing guild!');
      setShowCreateModal(false);
      return;
    }

    try {
      createGuild(guildName, tagline, 'Multi-sig student development guild', ['React', 'Spring Boot', 'PostgreSQL']);
      setShowCreateModal(false);
      showToast(`Guild "${guildName}" successfully minted!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to deploy guild.');
    }
  };

  const handleJoinGuild = (targetGuildId: string, name: string) => {
    try {
      joinGuild(targetGuildId);
      showToast(`Successfully joined ${name} as Apprentice! You now hold a 10% quorum stake.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to join guild.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MULTI-SIG GUILD QUORUM HEADER & TELEMETRY HUD            */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                {isTeacherPortal ? 'Instructor Guild Participation' : 'Collegiate Multi-Sig Quorum Hub'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 font-mono text-[10px] font-bold">
                AUTONOMOUS STUDENT AGENCIES
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/40 font-mono text-[10px] font-bold">
                ARBITRUM SEPOLIA L2
              </span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isTeacherPortal ? 'Collegiate Guild Governance & Agency Network' : 'Multi-Sig Collegiate Guild & Quorum Governance'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-body mt-1 max-w-2xl leading-relaxed">
              Form autonomous student software agencies. Bid for enterprise work orders, lock funds in 85/15 smart escrow, and disburse token shares by algorithmic contribution.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center shrink-0 flex-wrap">
            {isTeacherPortal ? (
              <Link
                href="/teacher/dashboard"
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-mono text-xs font-bold border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>Teacher Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/student/tasks"
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-mono text-xs font-bold border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Tasks &amp; Proofs</span>
              </Link>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Deploy New Guild Quorum</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* CONDITIONAL: USER HAS GUILD VS NEW USER NO GUILD        */}
      {/* ======================================================== */}
      {myGuild ? (
        <div className="space-y-8">
          {/* GUILD DETAILS & MEMBER SHARES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Active Guild Overview (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
                      {myGuild.name}
                    </h2>
                    <span className="font-mono text-xs text-purple-700 dark:text-purple-400">
                      Lead: {myGuild.leaderName} {'//'} {myGuild.members?.length || 1} Members
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono text-xs font-bold self-start sm:self-center">
                  Active Multi-Sig Quorum
                </span>
              </div>

              {/* Quorum Stats */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Completed Projects</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {myGuild.completedProjects || 0} Delivered
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Total Escrow Disbursed</span>
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                    {(myGuild.totalZeniEarned || 0).toLocaleString()} ZENI
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Active Members</span>
                  <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                    {myGuild.members?.length || 1} Members
                  </span>
                </div>
              </div>

              {/* Member Allocation Table */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                  <span>Algorithmic Member Contribution Stakes</span>
                  <span className="text-slate-400 font-normal">Quorum Threshold: 60%</span>
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden font-mono text-xs">
                  {myGuild.members && myGuild.members.length > 0 ? (
                    myGuild.members.map((m) => (
                      <div key={m.id || m.studentId} className="p-3.5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{m.studentName}</span>
                          <span className="text-slate-500 dark:text-slate-400">({m.role})</span>
                          {m.studentId === currentUser.id && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-cyan-700 dark:text-cyan-400">{m.sharePercentage}% Stake</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2">
                            ({Math.round((myGuild.totalZeniEarned || 0) * (m.sharePercentage / 100)).toLocaleString()} ZENI)
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500">No members registered yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Active Contract in Escrow (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  Active Corporate Work Order
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Employer: NovaTech Labs</span>
                <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  Build Student Hiring Platform &amp; Escrow Engine
                </h3>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                    Contract Vault: 60,000 ZENI (₹60,000)
                  </p>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    85/15 Autonomous Split
                  </span>
                </div>
              </div>

              {/* Split topology bar */}
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Guild Share: 51,000 Z (85%)</span>
                  <span>College Endowment: 9,000 Z (15%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                  <div className="h-full bg-purple-500 w-[15%]" />
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Milestone 1: Prototype API</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">APPROVED // RELEASED</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Milestone 2: Escrow Smart Engine</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold">UNDER REVIEW</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Milestone 3: Production Deploy</span>
                  <span className="text-slate-400">PENDING AUDIT</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => showToast('Quorum Signatures: Recorded multi-sig vote on Sepolia node.')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-mono text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Vote className="w-4 h-4" />
                  <span>Sign Quorum Milestone Vote</span>
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CONNECTED GUILD TASKS & PRACTICAL PROOFS                 */}
          {/* ======================================================== */}
          <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Connected Work Order Milestones
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    ADVANCES ESCROW RELEASE
                  </span>
                </div>
                <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
                  Guild Milestone Tasks &amp; Verification Proofs
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-body mt-0.5">
                  Submitting verified practical proofs for these tasks raises the guild&apos;s collective score and accelerates escrow disbursement for Milestone 2.
                </p>
              </div>

              <Link
                href={isTeacherPortal ? '/teacher/dashboard' : '/student/tasks'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-foreground transition-colors self-start sm:self-center shrink-0"
              >
                <span>{isTeacherPortal ? 'Teacher Dashboard' : 'Open Full Tasks Lattice'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Connected Task Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guildTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ======================================================== */
        /* GUILD DISCOVERY FOR USERS WITHOUT A GUILD                */
        /* ======================================================== */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-center max-w-2xl mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-headline text-xl font-bold text-slate-900 dark:text-white">
              You Haven&apos;t Joined a Collegiate Guild Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-body leading-relaxed">
              Guilds allow students and teachers to team up, collectively accept large enterprise bounties, and share 85/15 smart escrow payouts directly to their wallets. Browse established guilds below to join as an Apprentice, or reach Rank C to deploy your own!
            </p>
            <div className="pt-2">
              <Link
                href={isTeacherPortal ? '/teacher/dashboard' : '/student/tasks'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-sm"
              >
                <CheckSquare className="w-4 h-4" />
                <span>{isTeacherPortal ? 'Back to Dashboard' : 'Complete Proofs to Reach Rank C'}</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mb-4">
              Available Student Guilds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guilds.map((g) => (
                <div
                  key={g.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                            {g.name}
                          </h4>
                          <span className="font-mono text-xs text-purple-700 dark:text-purple-400">
                            Lead: {g.leaderName} ({g.leaderRank}-Rank)
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono text-[10px] font-bold">
                        {g.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-body">
                      {g.tagline || g.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {g.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-2 border-t border-slate-100 dark:border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Members</span>
                        <span className="font-bold text-slate-900 dark:text-white">{g.members?.length || 1}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Delivered</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{g.completedProjects}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Earned</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{g.totalZeniEarned.toLocaleString()} Z</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => handleJoinGuild(g.id, g.name)}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Join Guild as Apprentice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Guild Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                  Deploy New Collegiate Guild
                </h3>
                <span className="font-mono text-xs text-purple-700 dark:text-purple-400">
                  Requirements: Min Rank C + Multi-Sig Threshold
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateGuild} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Guild Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Security Taskforce"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Agency Specialization Tagline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Smart Contract Audits &amp; QA"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs font-mono text-purple-800 dark:text-purple-300 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Your Current Rank:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Rank {studentProfile?.currentRank || 'E'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Min Required Rank:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">Rank C (Master)</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Deploy Guild Quorum on Sepolia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
