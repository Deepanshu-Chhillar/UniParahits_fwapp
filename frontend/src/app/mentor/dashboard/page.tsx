'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { Shield, Users, CheckSquare, Sparkles, ArrowRight, CheckCircle, Clock3 } from 'lucide-react';

export default function MentorDashboardPage() {
  const { currentUser, studentProfile, submissions, mentorRelationships, reviewTask } = useUniStore();

  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING' || s.status === 'UNDER_REVIEW');
  const activeRelationships = mentorRelationships.filter((m) => m.mentorId === currentUser.id || currentUser.role === 'ADMIN');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Teacher Portal Integration Banner */}
        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <span className="font-bold text-foreground block">Teacher Portal Integration Active</span>
              <span className="text-muted-foreground">Mentorship &amp; Peer Reviews are integrated directly into the Teacher Dashboard with unified ledger and balance tracking.</span>
            </div>
          </div>
          <Link
            href="/teacher/mentorship"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <span>Open in Teacher Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Header Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500/50 shadow-xl shadow-blue-500/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{currentUser.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold border border-blue-500/40">
                    C-RANK MENTOR
                  </span>
                  {studentProfile && <RankBadge rank={studentProfile.currentRank} size="sm" />}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Evaluating E-rank apprentices, reviewing practical proofs, and guiding students to Rank D.
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="text-purple-300 font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> +50 MANA Earned per Reviewed Proof
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/mentor/reviews"
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all self-start lg:self-center"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Review Submissions Queue ({pendingSubmissions.length})</span>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/50 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <span className="text-[10px] text-muted-foreground block font-mono uppercase">Apprentices Guided</span>
              <span className="text-2xl font-bold font-mono text-foreground mt-0.5 block">
                {activeRelationships.length} Students
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] text-amber-300 block font-mono uppercase">Pending Reviews</span>
              <span className="text-2xl font-bold font-mono text-amber-300 mt-0.5 block">
                {pendingSubmissions.length} Submissions
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-[10px] text-purple-300 block font-mono uppercase">Mentorship MANA</span>
              <span className="text-2xl font-bold font-mono text-purple-300 mt-0.5 block">
                {studentProfile ? studentProfile.manaBalance.toLocaleString() : '3,400'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-300 block font-mono uppercase">Promoted to Rank D</span>
              <span className="text-2xl font-bold font-mono text-emerald-300 mt-0.5 block">
                3 Students
              </span>
            </div>
          </div>
        </div>

        {/* Section 25: Mentored Students List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Active E-Rank Apprentices & Promotion Readiness</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Mentors cannot unilaterally promote students; all task and trust requirements must be satisfied.
              </p>
            </div>
            <Link href="/mentor/students" className="text-xs text-primary hover:text-accent transition-colors">
              Manage All Students →
            </Link>
          </div>

          <div className="space-y-3">
            {activeRelationships.map((rel) => (
              <div
                key={rel.id}
                className="glass-card rounded-2xl p-5 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm">{rel.studentName}</span>
                    <RankBadge rank={rel.studentRank} size="sm" />
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      ACTIVE APPRENTICE
                    </span>
                  </div>
                  <p className="text-muted-foreground italic max-w-xl">{rel.mentorNotes}</p>
                  <span className="text-[10px] text-muted-foreground font-mono block pt-1">
                    Tasks Reviewed: {rel.tasksReviewed} • Mentoring since {rel.startedAt.slice(0, 10)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Endorsement Active
                  </span>
                  <Link
                    href="/mentor/reviews"
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                  >
                    Review Work
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Review Queue (FLOW 1) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-accent" />
              <span>Pending Task Submission Queue</span>
            </h2>
            <Link href="/mentor/reviews" className="text-xs text-primary hover:text-accent transition-colors">
              Full Evaluation Console →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingSubmissions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8 glass-card rounded-2xl border border-border">
                All submitted proofs have been evaluated. Great job!
              </p>
            ) : (
              pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-4 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{sub.taskTitle}</span>
                      <RankBadge rank={sub.studentRank} size="sm" />
                    </div>
                    <span className="text-muted-foreground">
                      Submitted by <span className="text-slate-200 font-medium">{sub.studentName}</span> via{' '}
                      <span className="font-mono text-primary">{sub.submissionType}</span>
                    </span>
                  </div>

                  <Link
                    href="/mentor/reviews"
                    className="px-4 py-1.5 rounded-xl bg-accent text-accent-foreground font-bold flex items-center gap-1.5 self-end sm:self-center"
                  >
                    <span>Evaluate Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
