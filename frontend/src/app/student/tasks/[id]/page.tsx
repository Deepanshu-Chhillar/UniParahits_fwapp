'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import { Sparkles, Coins, ArrowLeft, Calendar, FileText, CheckCircle, UploadCloud } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { tasks } = useUniStore();

  const task = tasks.find((t) => t.id === resolvedParams.id) || tasks[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/student/tasks"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tasks</span>
        </Link>

        {task && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium border border-border">
                  {task.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                  {task.difficulty}
                </span>
              </div>
              <RankBadge rank={task.requiredRank} size="md" showTitle />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{task.title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
            </div>

            {/* Rewards Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-purple-400 uppercase font-mono block">Contribution Reward</span>
                  <span className="text-xl font-bold font-mono text-purple-300">+{task.manaReward} MANA</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-400 uppercase font-mono block">Financial Bounty</span>
                  <span className="text-xl font-bold font-mono text-emerald-300">
                    {task.zeniReward > 0 ? `₹${task.zeniReward} ZENI` : 'Foundational (0 ZENI)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Required Skills & Requirements */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {task.requiredSkills.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-white/5 border border-border/40 text-xs text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border/60 text-xs space-y-1">
                <h4 className="font-bold text-foreground">Submission Criteria</h4>
                <p className="text-muted-foreground">{task.submissionRequirements}</p>
              </div>
            </div>

            {/* Interactive Task Card embedding submit modal */}
            <div className="pt-4 border-t border-border/50">
              <TaskCard task={task} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
