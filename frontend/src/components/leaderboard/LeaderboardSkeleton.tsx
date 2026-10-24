'use client';

import React from 'react';

export default function LeaderboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="w-full h-20 rounded-2xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-border/40" />

      {/* Podium Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-6">
        <div className="h-60 rounded-3xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-border/40 order-2 md:order-1" />
        <div className="h-72 rounded-3xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-border/40 order-1 md:order-2 md:-mt-6" />
        <div className="h-56 rounded-3xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-border/40 order-3 md:order-3" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200 dark:border-border/60 bg-white dark:bg-[#0c0d16] p-4 space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-lg w-1/3" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 dark:bg-white/[0.02] rounded-xl flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/5" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-white/5 rounded" />
              </div>
              <div className="h-5 w-20 bg-slate-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
