'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TaskCard from '@/components/tasks/TaskCard';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  CheckSquare,
  Filter,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Clock3,
  Shield,
  ArrowRight,
  Search,
  X,
  Coins,
  Terminal,
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

export default function StudentTasksPage() {
  const { tasks, submissions, currentUser, studentProfile, guilds } = useUniStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'TASKS' | 'MY_SUBMISSIONS'>('TASKS');

  // Find user's guild (if any)
  const myGuild = guilds.find(
    (g) => g.leaderId === currentUser.id || g.members?.some((m) => m.studentId === currentUser.id)
  );

  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  const filteredTasks = tasks.filter((t) => {
    // Category or Guild filter
    let matchesCategory = true;
    if (selectedCategory === 'GUILD') {
      const guildSkills = myGuild?.skills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'UI/UX'];
      matchesCategory = t.requiredSkills.some((s) => guildSkills.includes(s)) || t.category === 'Full Stack' || t.category === 'Backend';
    } else if (selectedCategory !== 'ALL') {
      matchesCategory = t.category === selectedCategory;
    }

    // Rank filter
    const matchesRank = selectedRank === 'ALL' || t.requiredRank === selectedRank;

    // Search query filter
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesRank && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Strip with Telemetry */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Practical Verification Lattice
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-200 dark:border-purple-800/40">
                  EARN MANA XP & ADVANCE RANK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/40">
                  SEPOLIA PROOF ENGINE
                </span>
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Student Tasks & Practical Proofs
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-body mt-1 max-w-2xl leading-relaxed">
                Complete practical challenges to verify your engineering and design competencies. Submitting authentic GitHub repositories, Figma files, and test suites earns MANA XP for promotion from Rank E to D.
              </p>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono self-start lg:self-center shrink-0">
              <button
                onClick={() => setActiveTab('TASKS')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
                  activeTab === 'TASKS'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Available Tasks ({tasks.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('MY_SUBMISSIONS')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-bold cursor-pointer ${
                  activeTab === 'MY_SUBMISSIONS'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock3 className="w-3.5 h-3.5" />
                <span>My Submissions ({mySubmissions.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CONTEXTUAL GUILD CONNECTION BANNER                       */}
        {/* ======================================================== */}
        {myGuild ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-transparent border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold block">
                  Collegiate Guild Synergy: {myGuild.name}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  You are registered as <span className="font-bold text-slate-900 dark:text-white">Apprentice (10% Stake)</span>. Proofs submitted here contribute to your personal MANA and accelerate your guild&apos;s milestone payouts.
                </p>
              </div>
            </div>

            <Link
              href="/student/guild"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#111333] hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-purple-700 dark:text-purple-300 transition-colors shrink-0 self-start sm:self-center"
            >
              <span>Guild Quorum Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Team up with classmates in collegiate software guilds to bid for enterprise work orders and split 85/15 escrows.
              </p>
            </div>
            <Link
              href="/student/guild"
              className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore Collegiate Guilds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: AVAILABLE TASKS                                   */}
        {/* ======================================================== */}
        {activeTab === 'TASKS' ? (
          <>
            {/* Filters & Search Toolbar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks by title or skill (e.g. Tailwind, API, SQL)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Min Rank Filter */}
                <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Min Rank:</span>
                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    className="bg-slate-50 dark:bg-[#111333] text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="ALL">All Ranks (E to A)</option>
                    <option value="E">Rank E (Apprentice)</option>
                    <option value="D">Rank D (Adept)</option>
                    <option value="C">Rank C (Master)</option>
                  </select>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-white/5 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {['ALL', 'Frontend', 'Backend', 'UI/UX', 'QA', 'DevOps'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl transition-all cursor-pointer font-bold ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {myGuild && (
                  <button
                    onClick={() => setSelectedCategory('GUILD')}
                    className={`px-3 py-1 rounded-xl transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                      selectedCategory === 'GUILD'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 border border-cyan-200 dark:border-cyan-800/40'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Guild Milestones</span>
                  </button>
                )}
              </div>
            </div>

            {/* Task Cards Grid */}
            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 space-y-3">
                <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  No matching tasks found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or switching categories to browse other practical verification tasks.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedRank('ALL');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold hover:bg-purple-500 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* ======================================================== */
          /* TAB 2: MY SUBMISSIONS                                    */
          /* ======================================================== */
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-2">
              <div>
                <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                  Submitted Practical Proofs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-body">
                  Track mentor evaluations, feedback, and rewarded MANA XP on your submitted tasks.
                </p>
              </div>
              <span className="font-mono text-xs text-purple-700 dark:text-purple-400 font-bold">
                {mySubmissions.length} Submissions Total
              </span>
            </div>

            <div className="space-y-4">
              {mySubmissions.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Clock3 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                    No practical proofs submitted yet
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Choose a task from the Available Tasks tab, build the solution, and submit your GitHub or Figma link for evaluation.
                  </p>
                  <button
                    onClick={() => setActiveTab('TASKS')}
                    className="px-4 py-2 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold hover:bg-purple-500 transition-colors"
                  >
                    Browse Available Tasks
                  </button>
                </div>
              ) : (
                mySubmissions.map((sub) => {
                  const isApproved = sub.status === 'APPROVED';
                  const isPending = sub.status === 'PENDING' || sub.status === 'UNDER_REVIEW';
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline font-bold text-slate-900 dark:text-white text-sm font-sans">
                            {sub.taskTitle}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800/40">
                            {sub.submissionType}
                          </span>
                        </div>

                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1.5 text-xs truncate max-w-md"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.submissionUrl}</span>
                        </a>

                        {sub.notes && (
                          <p className="text-slate-600 dark:text-slate-400 text-xs font-sans">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Notes:</span> {sub.notes}
                          </p>
                        )}

                        {sub.feedback && (
                          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-slate-800 dark:text-purple-200 text-xs font-sans mt-2">
                            <span className="font-bold text-purple-700 dark:text-purple-400">
                              Evaluator Feedback ({sub.reviewedByMentorName || 'Mentor'}):{' '}
                            </span>
                            {sub.feedback}
                          </div>
                        )}
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-white/5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                            isApproved
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40'
                              : isPending
                              ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40'
                              : 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40'
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>APPROVED</span>
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="w-3.5 h-3.5" />
                              <span>UNDER REVIEW</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>CHANGES REQUESTED</span>
                            </>
                          )}
                        </span>

                        {isApproved && (
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              +{sub.manaAwarded || 100} XP
                            </span>
                            {sub.zeniAwarded && sub.zeniAwarded > 0 ? (
                              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Coins className="w-3.5 h-3.5" />
                                ₹{sub.zeniAwarded} ZENI
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
