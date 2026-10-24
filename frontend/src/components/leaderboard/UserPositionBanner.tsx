'use client';

import React from 'react';
import Link from 'next/link';
import { UserLeaderboardPosition, LeaderboardCategory, LeaderboardPeriod } from '@/lib/types';
import { Trophy, TrendingUp, Sparkles, ArrowRight, Target, ShieldCheck } from 'lucide-react';

interface UserPositionBannerProps {
  position: UserLeaderboardPosition | null;
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
}

export default function UserPositionBanner({ position, category, period }: UserPositionBannerProps) {
  if (!position) return null;

  const categoryName = category === 'students' ? 'Student Hall' : 'Teacher Hall';
  const periodLabel = period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All-Time';

  return (
    <div className="w-full mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-indigo-500/10 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 font-black font-mono text-lg flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0">
            #{position.rank}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold">
                Your Current Position • {categoryName} ({periodLabel})
              </span>
              {position.aheadOfPercentage !== undefined && position.aheadOfPercentage > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Top {100 - position.aheadOfPercentage}%
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm font-semibold text-slate-900 dark:text-foreground">
              <span>
                Score:{' '}
                <strong className="text-cyan-600 dark:text-cyan-400 font-mono font-black">
                  {position.score.toLocaleString()} PTS
                </strong>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-muted-foreground text-xs">
                Out of {position.totalParticipants} eligible {category}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Distance to Next Rank & CTA */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {position.scoreToNextRank !== undefined && position.scoreToNextRank > 0 && (
            <div className="text-right hidden md:block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-muted-foreground block">
                To Reach #{position.rank - 1}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1 justify-end">
                <Target className="w-3.5 h-3.5" />
                +{position.scoreToNextRank} pts needed
              </span>
            </div>
          )}

          <Link
            href={category === 'students' ? '/student/tasks' : '/teacher/courses'}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/25 hover:scale-105 active:scale-95"
          >
            <span>{category === 'students' ? 'Earn Points' : 'Teach & Mentor'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
