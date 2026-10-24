'use client';

import React from 'react';
import Link from 'next/link';
import { LeaderboardCategory, LeaderboardPeriod } from '@/lib/types';
import { Search, Trophy, AlertCircle, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

interface LeaderboardEmptyStateProps {
  type: 'no-results' | 'no-data' | 'error';
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  searchQuery?: string;
  errorMessage?: string;
  onClearSearch?: () => void;
  onRetry?: () => void;
}

export default function LeaderboardEmptyState({
  type,
  category,
  period,
  searchQuery,
  errorMessage,
  onClearSearch,
  onRetry,
}: LeaderboardEmptyStateProps) {
  if (type === 'error') {
    return (
      <div className="w-full py-16 px-6 text-center rounded-3xl border border-rose-300 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 my-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">
          Unable to Load {category.charAt(0).toUpperCase() + category.slice(1)} Leaderboard
        </h3>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1.5 max-w-md mx-auto">
          {errorMessage || 'A network or verification synchronization error occurred while querying rankings.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="w-full py-16 px-6 text-center rounded-3xl border border-slate-200 dark:border-border/60 bg-slate-50/50 dark:bg-white/[0.01] my-6">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">
          No {category.charAt(0).toUpperCase() + category.slice(1)} Matching &ldquo;{searchQuery}&rdquo;
        </h3>
        <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1.5 max-w-md mx-auto">
          We couldn&rsquo;t find any {category} matching your search in the {period} period. Try refining your keywords or checking another category.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-foreground font-mono font-bold text-xs transition-all cursor-pointer"
          >
            <span>Clear Search Filter</span>
          </button>
        )}
      </div>
    );
  }

  // type === 'no-data'
  const categoryHelp = {
    students: {
      title: 'No Verified Student Activities for This Period',
      desc: 'Rankings are populated exclusively from verified peer task approvals, milestone completions, and unlocked achievements. Zeni wallet balances are never counted.',
      action: 'Explore Student Tasks',
      href: '/student/tasks',
    },
    teachers: {
      title: 'No Teaching Contributions Recorded for This Period',
      desc: 'Rankings reflect verified live cohort sessions taught, mentorship evaluations, and reliable course ratings (minimum 2 reviews required).',
      action: 'Manage Courses',
      href: '/teacher/courses',
    },
    guilds: {
      title: 'No Collective Guild Deliverables in This Period',
      desc: 'Guild ranks are calculated from verified escrow milestone releases and active member contributions. Individual balances are strictly excluded.',
      action: 'View Guild Workspace',
      href: '/student/guild',
    },
  }[category];

  return (
    <div className="w-full py-16 px-6 text-center rounded-3xl border border-slate-200 dark:border-border/60 bg-slate-50/50 dark:bg-white/[0.01] my-6">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
        <Trophy className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">{categoryHelp.title}</h3>
      <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1.5 max-w-lg mx-auto leading-relaxed">
        {categoryHelp.desc}
      </p>
      <Link
        href={categoryHelp.href}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
      >
        <span>{categoryHelp.action}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
