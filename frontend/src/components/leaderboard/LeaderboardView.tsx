'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  LeaderboardCategory,
  LeaderboardPeriod,
  StudentLeaderboardEntry,
  TeacherLeaderboardEntry,
  GuildLeaderboardEntry,
  UserLeaderboardPosition,
} from '@/lib/types';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardTable from './LeaderboardTable';
import UserPositionBanner from './UserPositionBanner';
import LeaderboardSkeleton from './LeaderboardSkeleton';
import LeaderboardEmptyState from './LeaderboardEmptyState';
import {
  GraduationCap,
  Users,
  Shield,
  Search,
  X,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

interface LeaderboardViewProps {
  initialCategory?: LeaderboardCategory;
}

export default function LeaderboardView({ initialCategory = 'students' }: LeaderboardViewProps) {
  const {
    currentUser,
    getStudentLeaderboard,
    getTeacherLeaderboard,
    getGuildLeaderboard,
    getUserLeaderboardPosition,
  } = useUniStore();

  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>(initialCategory);
  const [period, setPeriod] = useState<LeaderboardPeriod>('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [rankFilter, setRankFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Reset page when category, period, search, or rankFilter changes
  const handleCategoryChange = (cat: LeaderboardCategory) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setRankFilter('ALL');
    setCurrentPage(1);
  };

  const handlePeriodChange = (p: LeaderboardPeriod) => {
    setPeriod(p);
    setCurrentPage(1);
  };

  // Query Data from Store
  const result = React.useMemo(() => {
    if (activeCategory === 'students') {
      return getStudentLeaderboard(period, searchQuery, rankFilter, currentPage, pageSize, currentUser?.id);
    }
    if (activeCategory === 'teachers') {
      return getTeacherLeaderboard(period, searchQuery, currentPage, pageSize, currentUser?.id);
    }
    return getGuildLeaderboard(period, searchQuery, currentPage, pageSize);
  }, [
    activeCategory,
    period,
    searchQuery,
    rankFilter,
    currentPage,
    pageSize,
    currentUser?.id,
    getStudentLeaderboard,
    getTeacherLeaderboard,
    getGuildLeaderboard,
  ]);

  const userPosition: UserLeaderboardPosition | null = React.useMemo(() => {
    if (activeCategory === 'guilds') return null;
    if (!currentUser?.id) return null;
    return getUserLeaderboardPosition(currentUser.id, activeCategory, period);
  }, [activeCategory, period, currentUser?.id, getUserLeaderboardPosition]);

  const totalPages = Math.max(1, Math.ceil((result?.totalCount || 0) / pageSize));
  const entries = result?.data || [];
  const topThree = entries.slice(0, 3);

  const searchPlaceholder =
    activeCategory === 'students'
      ? 'Search students by name, college, or guild...'
      : activeCategory === 'teachers'
      ? 'Search instructors by name, headline, or institute...'
      : 'Search guild syndicate by name, leader, or specialty...';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              ⚡ Proof-of-Contribution Protocol
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-muted-foreground">
              SIH 2026 Core Workforce Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">
            Hall of <span className="text-cyan-500 dark:text-cyan-400">Merit & Rankings</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Strictly segregated leaderboards celebrating verified contributions. Student tasks, teaching cohorts, and
            guild project deliveries are evaluated independently with zero currency shortcuts.
          </p>
        </div>

        {/* Period Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-border/60 self-start md:self-end">
          {(['weekly', 'monthly', 'all-time'] as LeaderboardPeriod[]).map((p) => {
            const isActive = period === p;
            const label = p === 'weekly' ? 'Weekly' : p === 'monthly' ? 'Monthly' : 'All-Time';
            return (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 STRICT CATEGORY TABS (NO EVERYONE / NO COMBINED RANKING) */}
      <div className="flex items-center border-b border-slate-200 dark:border-border/60 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => handleCategoryChange('students')}
          className={`flex items-center gap-2 pb-3.5 px-3 border-b-2 font-bold text-sm tracking-tight transition-all cursor-pointer shrink-0 ${
            activeCategory === 'students'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-[0_2px_0_rgba(0,240,255,1)]'
              : 'border-transparent text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Students Leaderboard</span>
        </button>

        <button
          onClick={() => handleCategoryChange('teachers')}
          className={`flex items-center gap-2 pb-3.5 px-3 border-b-2 font-bold text-sm tracking-tight transition-all cursor-pointer shrink-0 ${
            activeCategory === 'teachers'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_2px_0_rgba(16,185,129,1)]'
              : 'border-transparent text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Teachers Leaderboard</span>
        </button>

        <button
          onClick={() => handleCategoryChange('guilds')}
          className={`flex items-center gap-2 pb-3.5 px-3 border-b-2 font-bold text-sm tracking-tight transition-all cursor-pointer shrink-0 ${
            activeCategory === 'guilds'
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-[0_2px_0_rgba(99,102,241,1)]'
              : 'border-transparent text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Guilds Leaderboard</span>
        </button>
      </div>

      {/* User Position Banner (When Applicable) */}
      {userPosition && (
        <UserPositionBanner position={userPosition} category={activeCategory} period={period} />
      )}

      {/* Search and Secondary Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9.5 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-border/60 bg-white dark:bg-black/20 text-sm text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary Category Filters: Rank Filter for Students */}
        {activeCategory === 'students' && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono text-slate-400 hidden lg:inline mr-1">Rank:</span>
            {['ALL', 'E', 'D', 'C', 'B', 'A'].map((r) => {
              const isSelected = rankFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => setRankFilter(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-muted-foreground hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {r === 'ALL' ? 'All Ranks' : `Rank ${r}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : entries.length === 0 ? (
        <LeaderboardEmptyState
          type={searchQuery || rankFilter !== 'ALL' ? 'no-results' : 'no-data'}
          category={activeCategory}
          period={period}
          searchQuery={searchQuery}
          onClearSearch={() => {
            setSearchQuery('');
            setRankFilter('ALL');
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Top 3 Podium (Only shown when not searching and on page 1) */}
          {!searchQuery && rankFilter === 'ALL' && currentPage === 1 && topThree.length > 0 && (
            <LeaderboardPodium category={activeCategory} entries={topThree} period={period} />
          )}

          {/* Full Ranked List/Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-muted-foreground px-1">
              <span>
                Showing <strong>{entries.length}</strong> of <strong>{result.totalCount}</strong> verified{' '}
                {activeCategory}
              </span>
              <span className="text-[11px]">
                Period: {new Date(result.dateRange.start).toLocaleDateString()} &ndash;{' '}
                {new Date(result.dateRange.end).toLocaleDateString()}
              </span>
            </div>

            <LeaderboardTable
              category={activeCategory}
              entries={entries}
              currentUserId={currentUser?.id}
              period={period}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-border/40">
                <div className="text-xs font-mono text-slate-500">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-border/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-foreground transition-all cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                              : 'text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 dark:border-border/60 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-foreground transition-all cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transparent Integrity Notice Footer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-border/40 text-xs text-slate-500 dark:text-muted-foreground flex items-start gap-3 mt-8">
        <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-700 dark:text-foreground font-semibold">
            Anti-Cheat & Verified Scoring Architecture:
          </strong>{' '}
          All leaderboard points are derived strictly from cryptographically logged, backend-approved milestones, task proofs, and
          evaluated cohorts. Duplicate submission attempts are rejected via unique idempotency keys. Individual Zeni wallet balances
          are excluded from leaderboard calculations.
        </div>
      </div>
    </div>
  );
}
