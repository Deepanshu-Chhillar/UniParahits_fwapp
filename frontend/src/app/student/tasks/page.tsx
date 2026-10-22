'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TaskCard from '@/components/tasks/TaskCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { CheckSquare, Filter, Clock, Sparkles, AlertCircle, ExternalLink, CheckCircle, Clock3 } from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

export default function StudentTasksPage() {
  const { tasks, submissions, currentUser, studentProfile } = useUniStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'TASKS' | 'MY_SUBMISSIONS'>('TASKS');

  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  const filteredTasks = tasks.filter((t) => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesRank = selectedRank === 'ALL' || t.requiredRank === selectedRank;
    return matchesCategory && matchesRank;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                Verification & Learning Engine
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent text-[10px] font-bold">
                EARN MANA & RANK UP
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Student Tasks & Practical Proofs</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Complete tasks to prove your competencies with real code, designs, and tests. Earn MANA XP and level up from E to D.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border text-xs">
            <button
              onClick={() => setActiveTab('TASKS')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'TASKS' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Available Tasks ({filteredTasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('MY_SUBMISSIONS')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'MY_SUBMISSIONS' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock3 className="w-3.5 h-3.5" />
              <span>My Submissions ({mySubmissions.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'TASKS' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-card border border-border text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Category:
                </span>
                {['ALL', 'Frontend', 'Backend', 'UI/UX', 'QA'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary/20 text-primary dark:text-accent font-bold border border-primary/40'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-muted-foreground font-mono">Min Rank:</span>
                <select
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value)}
                  className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="ALL" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">All Ranks (E to A)</option>
                  <option value="E" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank E</option>
                  <option value="D" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank D</option>
                  <option value="C" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank C</option>
                </select>
              </div>
            </div>

            {/* Task Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          </>
        ) : (
          /* My Submissions Table (FLOW 1) */
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
            <h3 className="text-base font-bold text-foreground">Submitted Practical Proofs</h3>
            <div className="space-y-3">
              {mySubmissions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">No submissions submitted yet.</p>
              ) : (
                mySubmissions.map((sub) => {
                  const isApproved = sub.status === 'APPROVED';
                  const isPending = sub.status === 'PENDING' || sub.status === 'UNDER_REVIEW';
                  return (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{sub.taskTitle}</span>
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-mono text-muted-foreground">
                            {sub.submissionType}
                          </span>
                        </div>
                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{sub.submissionUrl}</span>
                        </a>
                        {sub.feedback && (
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-secondary/80 border border-slate-200 dark:border-border/50 text-slate-700 dark:text-slate-300 text-[11px] mt-2">
                            <span className="text-primary dark:text-accent font-semibold">Mentor Feedback ({sub.reviewedByMentorName}): </span>
                            {sub.feedback}
                          </div>
                        )}
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            isApproved
                              ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40'
                              : isPending
                              ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40'
                              : 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/40'
                          }`}
                        >
                          {sub.status}
                        </span>

                        {isApproved && (
                          <span className="font-mono text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>+{sub.manaAwarded} MANA Awarded</span>
                          </span>
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
