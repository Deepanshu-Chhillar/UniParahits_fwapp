'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  StudentLeaderboardEntry,
  TeacherLeaderboardEntry,
  GuildLeaderboardEntry,
  LeaderboardCategory,
  LeaderboardPeriod,
} from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import {
  Trophy,
  Crown,
  Medal,
  Sparkles,
  CheckCircle,
  FolderGit2,
  GraduationCap,
  Star,
  Users,
  Shield,
  ArrowUpRight,
} from 'lucide-react';

interface LeaderboardPodiumProps {
  category: LeaderboardCategory;
  entries: (StudentLeaderboardEntry | TeacherLeaderboardEntry | GuildLeaderboardEntry)[];
  period: LeaderboardPeriod;
}

export default function LeaderboardPodium({ category, entries }: LeaderboardPodiumProps) {
  if (!entries || entries.length === 0) return null;

  // Podium order: [Rank 2 (Silver), Rank 1 (Gold), Rank 3 (Bronze)]
  const first = entries[0];
  const second = entries.length > 1 ? entries[1] : null;
  const third = entries.length > 2 ? entries[2] : null;

  const renderCard = (
    entry: StudentLeaderboardEntry | TeacherLeaderboardEntry | GuildLeaderboardEntry | null,
    podiumRank: 1 | 2 | 3
  ) => {
    if (!entry) {
      return (
        <div className="flex-1 hidden md:flex flex-col items-center justify-end h-64 border border-dashed border-slate-300 dark:border-border/40 rounded-3xl p-6 opacity-40 bg-slate-50/50 dark:bg-white/[0.01]">
          <span className="text-xs font-mono text-slate-400">Position Unclaimed</span>
        </div>
      );
    }

    const isFirst = podiumRank === 1;
    const isSecond = podiumRank === 2;
    const isThird = podiumRank === 3;

    const rankColor = isFirst
      ? 'from-amber-400 to-yellow-600 text-amber-300 border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
      : isSecond
      ? 'from-slate-300 to-slate-500 text-slate-200 border-slate-400/50 shadow-[0_0_20px_rgba(203,213,225,0.2)]'
      : 'from-amber-600 to-orange-700 text-amber-500 border-amber-600/50 shadow-[0_0_20px_rgba(217,119,6,0.2)]';

    const pedestalBg = isFirst
      ? 'bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-amber-400/30'
      : isSecond
      ? 'bg-gradient-to-b from-slate-400/10 via-slate-400/5 to-transparent border-slate-400/25'
      : 'bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/25';

    const avatarUrl =
      category === 'guilds'
        ? (entry as GuildLeaderboardEntry).logo
        : (entry as StudentLeaderboardEntry | TeacherLeaderboardEntry).avatar;

    const name = entry.name;
    const score = entry.score;

    return (
      <div
        className={`relative flex-1 flex flex-col items-center rounded-3xl border p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 ${pedestalBg} ${
          isFirst
            ? 'order-1 md:order-2 z-20 md:-mt-6 shadow-xl border-amber-400/40 ring-1 ring-amber-400/20'
            : isSecond
            ? 'order-2 md:order-1 z-10'
            : 'order-3 md:order-3 z-10'
        }`}
      >
        {/* Crown / Trophy Pill */}
        <div
          className={`absolute -top-4 px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1.5 border shadow-lg ${rankColor} bg-slate-900`}
        >
          {isFirst ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>APEX #1</span>
            </>
          ) : isSecond ? (
            <>
              <Medal className="w-3.5 h-3.5 text-slate-300" />
              <span>RANK #2</span>
            </>
          ) : (
            <>
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>RANK #3</span>
            </>
          )}
        </div>

        {/* Avatar with Glow Ring */}
        <div className="relative mt-2 mb-3">
          <div
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 p-0.5 shadow-md ${
              isFirst
                ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-4 ring-amber-400/20'
                : isSecond
                ? 'border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)] ring-2 ring-slate-400/20'
                : 'border-orange-500 shadow-[0_0_15px_rgba(217,119,6,0.3)] ring-2 ring-orange-500/20'
            }`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center font-bold text-lg text-white">
                {name.charAt(0)}
              </div>
            )}
          </div>
          {isFirst && (
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </span>
          )}
        </div>

        {/* Name & Title */}
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-foreground text-center truncate max-w-[180px] sm:max-w-[210px] tracking-tight">
          {name}
        </h3>

        {/* Subtitle / Details */}
        <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground text-center">
          {category === 'students' && (
            <>
              <RankBadge rank={(entry as StudentLeaderboardEntry).studentRank} size="sm" />
              {(entry as StudentLeaderboardEntry).guildName && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  {(entry as StudentLeaderboardEntry).guildName}
                </span>
              )}
            </>
          )}

          {category === 'teachers' && (
            <>
              <RankBadge rank={(entry as TeacherLeaderboardEntry).teacherRank} size="sm" />
              {(entry as TeacherLeaderboardEntry).reviewsCount >= 2 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {(entry as TeacherLeaderboardEntry).averageRating.toFixed(1)}
                </span>
              )}
            </>
          )}

          {category === 'guilds' && (
            <>
              <TrustScoreBadge score={(entry as GuildLeaderboardEntry).trustScore} size="sm" />
              <span className="text-[11px] text-slate-500 dark:text-muted-foreground font-mono">
                {(entry as GuildLeaderboardEntry).contributingMembersCount} contributors
              </span>
            </>
          )}
        </div>

        {/* Contribution Score Banner */}
        <div className="mt-4 w-full pt-3 border-t border-slate-200/80 dark:border-border/40 flex flex-col items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-muted-foreground">
            Contribution Score
          </span>
          <span
            className={`font-mono font-black text-xl sm:text-2xl tracking-tight mt-0.5 ${
              isFirst
                ? 'text-amber-600 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                : isSecond
                ? 'text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]'
                : 'text-orange-600 dark:text-orange-400 drop-shadow-[0_0_6px_rgba(234,88,12,0.4)]'
            }`}
          >
            {score.toLocaleString()} <span className="text-xs font-sans font-bold">PTS</span>
          </span>

          {/* Quick Metrics Breakdown */}
          <div className="mt-2.5 w-full grid grid-cols-2 gap-1.5 text-[11px] font-mono bg-white/60 dark:bg-black/20 p-2 rounded-xl border border-slate-200/60 dark:border-border/30">
            {category === 'students' && (
              <>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span>{(entry as StudentLeaderboardEntry).tasksCompleted} tasks</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 justify-end">
                  <FolderGit2 className="w-3 h-3 text-blue-500" />
                  <span>{(entry as StudentLeaderboardEntry).projectsCompleted} projects</span>
                </div>
              </>
            )}

            {category === 'teachers' && (
              <>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <GraduationCap className="w-3 h-3 text-emerald-500" />
                  <span>{(entry as TeacherLeaderboardEntry).batchesTaught} batches</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 justify-end">
                  <Users className="w-3 h-3 text-blue-500" />
                  <span>{(entry as TeacherLeaderboardEntry).studentsMentored} mentees</span>
                </div>
              </>
            )}

            {category === 'guilds' && (
              <>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                  <FolderGit2 className="w-3 h-3 text-emerald-500" />
                  <span>{(entry as GuildLeaderboardEntry).completedProjectsCount} projects</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 justify-end">
                  <Users className="w-3 h-3 text-cyan-500" />
                  <span>{(entry as GuildLeaderboardEntry).totalMembersCount} squad</span>
                </div>
              </>
            )}
          </div>

          {/* Optional Action link for Guilds */}
          {category === 'guilds' && (
            <Link
              href="/student/guild"
              className="mt-3 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 font-bold inline-flex items-center gap-1 transition-colors group"
            >
              <span>Explore Guild</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-end justify-center gap-4 max-w-4xl mx-auto pt-4">
        {second && renderCard(second, 2)}
        {first && renderCard(first, 1)}
        {third && renderCard(third, 3)}
      </div>
    </div>
  );
}
