'use client';

import React from 'react';
import { RankCode } from '@/lib/types';
import { RANK_DEFINITIONS } from '@/lib/data/initialData';

interface RankBadgeProps {
  rank: RankCode;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
}

export default function RankBadge({ rank, size = 'md', showTitle = false }: RankBadgeProps) {
  const def = RANK_DEFINITIONS[rank] || RANK_DEFINITIONS.E;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 font-bold',
  };

  const glowStyles: Record<RankCode, string> = {
    E: 'border-slate-300 dark:border-slate-500/40 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/10 shadow-sm dark:shadow-[0_0_12px_rgba(100,116,139,0.2)]',
    D: 'border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    C: 'border-blue-300 dark:border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 shadow-sm dark:shadow-[0_0_18px_rgba(59,130,246,0.35)]',
    B: 'border-purple-300 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10 shadow-sm dark:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    A: 'border-amber-300 dark:border-amber-500/60 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 shadow-sm dark:shadow-[0_0_25px_rgba(245,158,11,0.5)] font-extrabold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wider transition-all duration-300 ${sizeClasses[size]} ${glowStyles[rank]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: def.color }} />
      <span>RANK {rank}</span>
      {showTitle && <span className="font-sans font-normal opacity-75 hidden sm:inline">• {def.title}</span>}
    </span>
  );
}
