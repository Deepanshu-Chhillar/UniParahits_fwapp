'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import {
  CheckSquare,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function MentorReviewsPage() {
  const { submissions, reviewTask, currentUser } = useUniStore();
  const [activeFeedback, setActiveFeedback] = useState<Record<string, string>>({
    'sub-1': 'Great implementation of the responsive sidebar and clean typography tokens. Logic is modular and well-structured.',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleAction = (subId: string, status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED') => {
    const feedback = activeFeedback[subId] || (status === 'APPROVED' ? 'Approved by Mentor. Good work!' : 'Please address feedback.');
    try {
      reviewTask(subId, status, feedback);
      setSuccessMsg(`Submission updated with status: ${status}!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      alert(e.message || 'Action failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/mentor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mentor Hub</span>
        </Link>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">
              C-Rank Peer Review Console (FLOW 1)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Task Evaluation Queue</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate submitted practical proofs from E-rank students. Approvals automatically dispatch MANA to students and credit +50 MANA to your mentor balance.
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-6">
          {submissions.map((sub) => {
            const isApproved = sub.status === 'APPROVED';
            return (
              <div
                key={sub.id}
                className={`glass-card rounded-2xl p-6 border transition-all space-y-4 ${
                  isApproved ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm sm:text-base">{sub.taskTitle}</span>
                      <RankBadge rank={sub.studentRank} size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Student: <span className="text-foreground font-semibold">{sub.studentName}</span> • Submitted on{' '}
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-center border ${
                      isApproved
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : sub.status === 'UNDER_REVIEW' || sub.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Submission Content & Link */}
                <div className="p-4 rounded-xl bg-secondary/60 border border-border/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-mono">Proof Type: {sub.submissionType}</span>
                    <a
                      href={sub.submissionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-semibold flex items-center gap-1.5"
                    >
                      <span>Open Link ({sub.submissionUrl})</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-slate-200 italic">&ldquo;{sub.notes}&rdquo;</p>
                </div>

                {/* Mentor Feedback & Actions */}
                {!isApproved ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <label className="block text-muted-foreground font-medium">
                      Evaluator Constructive Feedback:
                    </label>
                    <textarea
                      rows={2}
                      value={activeFeedback[sub.id] || ''}
                      onChange={(e) => setActiveFeedback({ ...activeFeedback, [sub.id]: e.target.value })}
                      placeholder="Explain strengths, suggestions, or required fixes..."
                      className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
                    />

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={() => handleAction(sub.id, 'APPROVED')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Dispatch Rewards (+50 MANA to You)</span>
                      </button>

                      <button
                        onClick={() => handleAction(sub.id, 'REVISION_REQUIRED')}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Request Revision</span>
                      </button>

                      <button
                        onClick={() => handleAction(sub.id, 'REJECTED')}
                        className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Feedback given: {sub.feedback}</span>
                      <span className="text-[11px] text-muted-foreground">
                        Evaluated by {sub.reviewedByMentorName || currentUser.name}
                      </span>
                    </div>
                    <span className="font-mono text-purple-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>+{sub.manaAwarded} MANA Dispatched</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
