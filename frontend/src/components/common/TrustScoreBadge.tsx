'use client';

import React from 'react';
import { Shield, Star } from 'lucide-react';

interface TrustScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrustScoreBadge({ score, size = 'md' }: TrustScoreBadgeProps) {
  const formatted = score.toFixed(1);
  const isHigh = score >= 4.5;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs sm:text-sm px-2.5 py-1',
    lg: 'text-sm sm:text-base px-3 py-1.5 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono ${sizeClasses[size]} ${
        isHigh
          ? 'border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-500/10 shadow-sm'
          : 'border-slate-300 dark:border-border text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/5 shadow-sm'
      }`}
    >
      <Shield className={`w-3.5 h-3.5 ${isHigh ? 'text-amber-500 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400'}`} />
      <span>{formatted}</span>
      <span className="text-[10px] text-slate-500 dark:text-muted-foreground">/ 5.0</span>
    </div>
  );
}
