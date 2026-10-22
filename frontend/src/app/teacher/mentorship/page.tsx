'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import {
  Users,
  CheckSquare,
  Shield,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  FileCode,
  Flame,
  Award,
  AlertTriangle,
  UserCheck,
  XCircle,
  RotateCcw,
  Wallet
} from 'lucide-react';

type MentorshipTab = 'QUEUE' | 'APPRENTICES' | 'REWARDS';

export default function TeacherMentorshipPage() {
  const { currentUser, studentProfile, submissions, mentorRelationships, reviewTask } = useUniStore();
  const [activeTab, setActiveTab] = useState<MentorshipTab>('QUEUE');
  const [activeFeedback, setActiveFeedback] = useState<Record<string, string>>({
    'sub-1': 'Modular code structure and clean responsive styles. Meets all performance criteria.',
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const pendingSubmissions = useMemo(
    () => submissions.filter((s) => s.status === 'PENDING' || s.status === 'UNDER_REVIEW'),
    [submissions]
  );

  const activeRelationships = useMemo(
    () => mentorRelationships.filter((m) => m.mentorId === currentUser.id || currentUser.role === 'ADMIN'),
    [mentorRelationships, currentUser.id, currentUser.role]
  );

  const handleReviewAction = (
    subId: string,
    status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED'
  ) => {
    const feedback =
      activeFeedback[subId] ||
      (status === 'APPROVED' ? 'Approved by Instructor. Excellent practical proof!' : 'Please address comments and re-submit.');

    try {
      reviewTask(subId, status, feedback);
      if (status === 'APPROVED') {
        showToast('Proof Approved! +50 MANA awarded to your Teacher Wallet and recorded on the ledger.');
      } else if (status === 'REVISION_REQUIRED') {
        showToast('Revision requested. Feedback sent to student.');
      } else {
        showToast('Submission rejected with feedback.');
      }
    } catch (e: any) {
      showToast(e.message || 'Action failed.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header & Breadcrumb */}
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
              <span className="text-xs text-blue-500 font-mono font-bold uppercase tracking-wider">
                Mentorship &amp; Peer Reviews
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold font-mono border border-blue-200 dark:border-blue-500/30">
                +50 MANA REWARD PER PROOF
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 dark:text-white">
              Teacher Mentorship Console &amp; Proof Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-body">
              Guide apprentices from Rank E to D, review practical task proofs, and earn verified MANA rewards directly credited to your Teacher Wallet.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <Link
              href="/teacher/wallet"
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white font-mono text-xs font-bold border border-slate-200 dark:border-white/10 transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-amber-500" />
              <span>Teacher Wallet</span>
            </Link>
            <Link
              href="/teacher/dashboard"
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Teacher Dashboard</span>
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TELEMETRY BANNER & STATS                                 */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500/50 shadow-xl shadow-blue-500/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono text-xs font-bold">
                    C-Rank Peer Mentor &amp; Instructor
                  </span>
                  {studentProfile && <RankBadge rank={studentProfile.currentRank} size="sm" />}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-body">
                  Evaluating E-Rank apprentice proofs, guiding students toward Rank D career paths, and maintaining taskforce standards.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 font-bold pt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+50 MANA Credited per Approved Evaluation</span>
                </div>
              </div>
            </div>

            {/* Quick action: View pending reviews */}
            <div className="flex items-center gap-2 self-start lg:self-center">
              <span className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
                {pendingSubmissions.length} Pending Submissions
              </span>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Apprentices Guided</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">
                {activeRelationships.length} Students
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Submissions in Queue</span>
              <span className="text-xl font-bold text-amber-500 mt-0.5 block">
                {pendingSubmissions.length} Pending
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Mentorship MANA</span>
              <span className="text-xl font-bold text-cyan-500 mt-0.5 block">
                {(studentProfile?.manaBalance || 0).toLocaleString()} MANA
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Apprentice Endorsements</span>
              <span className="text-xl font-bold text-emerald-500 mt-0.5 block">
                {activeRelationships.filter((r) => r.recommendedForPromotion).length} Ready for D
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* TABS: QUEUE VS APPRENTICES                               */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('QUEUE')}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'QUEUE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Task Evaluation Queue ({submissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPRENTICES')}
            className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'APPRENTICES'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Mentored Apprentices ({activeRelationships.length})</span>
          </button>
        </div>

        {/* TAB 1: TASK EVALUATION QUEUE */}
        {activeTab === 'QUEUE' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-headline text-slate-900 dark:text-white">
                  Practical Task Proof Submissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect student code repositories, review test coverage, and award cryptographically verified MANA XP.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {submissions.map((sub) => {
                const isApproved = sub.status === 'APPROVED';
                return (
                  <div
                    key={sub.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-[#111333] border transition-all space-y-4 shadow-sm ${
                      isApproved ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                            {sub.taskTitle}
                          </h4>
                          <RankBadge rank={sub.studentRank} size="sm" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Apprentice: <span className="font-bold text-slate-800 dark:text-slate-200">{sub.studentName}</span> • Submitted on{' '}
                          {new Date(sub.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-center border ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                            : sub.status === 'UNDER_REVIEW' || sub.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isApproved ? 'VERIFIED & REWARDED' : sub.status}
                      </span>
                    </div>

                    {/* Proof Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                          Proof Link ({sub.submissionType})
                        </span>
                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 truncate"
                        >
                          <FileCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.submissionUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Verification Method</span>
                        <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Peer Code Inspection &amp; Unit Tests</span>
                        </span>
                      </div>
                    </div>

                    {/* Apprentice Technical Notes */}
                    {sub.notes && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                        <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Apprentice Technical Notes:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 font-body leading-relaxed">{sub.notes}</p>
                      </div>
                    )}

                    {/* Review Feedback & Actions */}
                    {isApproved ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="font-bold text-slate-900 dark:text-white">
                              Approved by Instructor {sub.reviewedByMentorName || currentUser.name}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 italic">
                            &ldquo;{sub.feedback}&rdquo;
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-mono text-xs font-bold shrink-0 self-start sm:self-center">
                          +50 MANA Credited
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            Instructor Evaluation Feedback
                          </label>
                          <textarea
                            rows={2}
                            value={activeFeedback[sub.id] || ''}
                            onChange={(e) =>
                              setActiveFeedback((prev) => ({ ...prev, [sub.id]: e.target.value }))
                            }
                            placeholder="Provide constructive review notes on architecture, modularity, and test coverage..."
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-body text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleReviewAction(sub.id, 'REJECTED')}
                            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                          >
                            Reject Proof
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewAction(sub.id, 'REVISION_REQUIRED')}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
                          >
                            Request Revision
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewAction(sub.id, 'APPROVED')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve Proof (+50 MANA)</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MENTORED APPRENTICES DIRECTORY */}
        {activeTab === 'APPRENTICES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-headline text-slate-900 dark:text-white">
                  Active E-Rank Apprentices Under Guidance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track verification counts, provide mentorship notes, and endorse apprentices for Rank D promotion.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {activeRelationships.map((rel) => (
                <div
                  key={rel.id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{rel.studentName}</h4>
                      <RankBadge rank={rel.studentRank} size="sm" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-body leading-relaxed">{rel.mentorNotes}</p>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-mono text-[11px] pt-1">
                      <span>Reviewed Proofs: <strong className="text-slate-800 dark:text-slate-200">{rel.tasksReviewed} Tasks</strong></span>
                      <span>•</span>
                      <span>Mentoring since {rel.startedAt.slice(0, 10)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold font-mono flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Endorsed for Rank D</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('QUEUE')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Review Proofs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
