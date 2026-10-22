'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import { Users, ArrowLeft, CheckCircle, Trophy, ArrowRight } from 'lucide-react';

export default function MentorStudentsPage() {
  const { mentorRelationships, currentUser } = useUniStore();

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
              Apprenticeship Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Mentored Students</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            E-Rank apprentices under your direct mentorship guidance. Monitor task verification count and endorsement.
          </p>
        </div>

        <div className="space-y-4">
          {mentorRelationships.map((rel) => (
            <div
              key={rel.id}
              className="glass-card rounded-2xl p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">{rel.studentName}</h3>
                  <RankBadge rank={rel.studentRank} size="sm" />
                </div>
                <p className="text-muted-foreground">{rel.mentorNotes}</p>
                <div className="flex items-center gap-3 text-muted-foreground font-mono text-[11px] pt-1">
                  <span>Reviewed Tasks: {rel.tasksReviewed}</span>
                  <span>•</span>
                  <span>Mentoring since {rel.startedAt.slice(0, 10)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Endorsed for Rank D</span>
                </span>
                <Link
                  href="/mentor/reviews"
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                >
                  Review Proofs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
