'use client';

import React from 'react';
import Link from 'next/link';
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
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CheckCircle,
  FolderGit2,
  GraduationCap,
  Star,
  Users,
  Shield,
  ArrowUpRight,
  Award,
} from 'lucide-react';

interface LeaderboardTableProps {
  category: LeaderboardCategory;
  entries: (StudentLeaderboardEntry | TeacherLeaderboardEntry | GuildLeaderboardEntry)[];
  currentUserId?: string;
  period: LeaderboardPeriod;
}

export default function LeaderboardTable({
  category,
  entries,
  currentUserId,
  period,
}: LeaderboardTableProps) {
  if (!entries || entries.length === 0) return null;

  const renderMovementBadge = (movement?: number | null) => {
    if (movement === null || movement === undefined) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-bold" title="New entry in this period">
          NEW
        </span>
      );
    }

    if (movement > 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-emerald-500" title={`Moved up ${movement} positions`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{movement}</span>
        </span>
      );
    }

    if (movement < 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-rose-500" title={`Dropped ${Math.abs(movement)} positions`}>
          <TrendingDown className="w-3.5 h-3.5" />
          <span>{movement}</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center text-xs font-mono text-slate-400" title="Position unchanged">
        <Minus className="w-3.5 h-3.5" />
      </span>
    );
  };

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 font-black font-mono text-xs flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.5)]">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 font-black font-mono text-xs flex items-center justify-center shadow-[0_0_10px_rgba(203,213,225,0.4)]">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 text-white font-black font-mono text-xs flex items-center justify-center shadow-[0_0_10px_rgba(217,119,6,0.4)]">
          3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-border/60 text-slate-700 dark:text-muted-foreground font-mono font-bold text-xs flex items-center justify-center">
        {rank}
      </div>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-border/60 bg-white dark:bg-[#0c0d16] shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-border/60 bg-slate-50/80 dark:bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-muted-foreground">
              <th className="py-3.5 px-4 w-16 text-center">Rank</th>
              <th className="py-3.5 px-3 w-16 text-center">Trend</th>
              <th className="py-3.5 px-4">
                {category === 'students' ? 'Student & Guild' : category === 'teachers' ? 'Teacher & Expertise' : 'Guild Syndicate'}
              </th>
              {category === 'students' && (
                <>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell">Verified Tasks</th>
                  <th className="py-3.5 px-4 text-center hidden lg:table-cell">Projects</th>
                  <th className="py-3.5 px-4 text-center hidden xl:table-cell">Achievements</th>
                </>
              )}
              {category === 'teachers' && (
                <>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell">Cohorts Taught</th>
                  <th className="py-3.5 px-4 text-center hidden lg:table-cell">Mentees</th>
                  <th className="py-3.5 px-4 text-center hidden sm:table-cell">Student Rating</th>
                </>
              )}
              {category === 'guilds' && (
                <>
                  <th className="py-3.5 px-4 text-center hidden md:table-cell">Contributing Members</th>
                  <th className="py-3.5 px-4 text-center hidden lg:table-cell">Completed Escrows</th>
                  <th className="py-3.5 px-4 text-center hidden sm:table-cell">Guild Trust</th>
                </>
              )}
              <th className="py-3.5 px-4 text-right">Contribution Score</th>
              <th className="py-3.5 px-4 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-border/40">
            {entries.map((entry) => {
              const isCurrentUser =
                category === 'students'
                  ? (entry as StudentLeaderboardEntry).userId === currentUserId
                  : category === 'teachers'
                  ? (entry as TeacherLeaderboardEntry).teacherId === currentUserId
                  : false;

              const avatar =
                category === 'guilds'
                  ? (entry as GuildLeaderboardEntry).logo
                  : (entry as StudentLeaderboardEntry | TeacherLeaderboardEntry).avatar;

              return (
                <tr
                  key={
                    category === 'students'
                      ? (entry as StudentLeaderboardEntry).userId
                      : category === 'teachers'
                      ? (entry as TeacherLeaderboardEntry).teacherId
                      : (entry as GuildLeaderboardEntry).guildId
                  }
                  className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03] ${
                    isCurrentUser ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : ''
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">{renderRankBadge(entry.rank)}</div>
                  </td>

                  {/* Movement Column */}
                  <td className="py-3 px-3 text-center">{renderMovementBadge(entry.rankMovement)}</td>

                  {/* Participant Main Profile Column */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-border/60 shrink-0 bg-slate-100 dark:bg-slate-800">
                        {avatar ? (
                          <img src={avatar} alt={entry.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                            {entry.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-foreground truncate max-w-[160px] sm:max-w-[240px]">
                            {entry.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-bold shrink-0">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-muted-foreground truncate">
                          {category === 'students' && (
                            <>
                              <RankBadge rank={(entry as StudentLeaderboardEntry).studentRank} size="sm" />
                              <span className="truncate hidden sm:inline">{(entry as StudentLeaderboardEntry).college}</span>
                              {(entry as StudentLeaderboardEntry).guildName && (
                                <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                                  • {(entry as StudentLeaderboardEntry).guildName}
                                </span>
                              )}
                            </>
                          )}

                          {category === 'teachers' && (
                            <>
                              <RankBadge rank={(entry as TeacherLeaderboardEntry).teacherRank} size="sm" />
                              <span className="truncate hidden sm:inline">
                                {(entry as TeacherLeaderboardEntry).headline || (entry as TeacherLeaderboardEntry).college}
                              </span>
                            </>
                          )}

                          {category === 'guilds' && (
                            <>
                              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                                Leader: {(entry as GuildLeaderboardEntry).leaderName}
                              </span>
                              <RankBadge rank={(entry as GuildLeaderboardEntry).leaderRank} size="sm" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category Specific Metrics */}
                  {category === 'students' && (
                    <>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          {(entry as StudentLeaderboardEntry).tasksCompleted}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <FolderGit2 className="w-3.5 h-3.5 text-blue-500" />
                          {(entry as StudentLeaderboardEntry).projectsCompleted}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden xl:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {(entry as StudentLeaderboardEntry).achievementsCount}
                        </span>
                      </td>
                    </>
                  )}

                  {category === 'teachers' && (
                    <>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                          {(entry as TeacherLeaderboardEntry).batchesTaught} batches
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-blue-500" />
                          {(entry as TeacherLeaderboardEntry).studentsMentored}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">
                        {(entry as TeacherLeaderboardEntry).reviewsCount >= 2 ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {(entry as TeacherLeaderboardEntry).averageRating.toFixed(1)} ({(entry as TeacherLeaderboardEntry).reviewsCount})
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Pending reviews</span>
                        )}
                      </td>
                    </>
                  )}

                  {category === 'guilds' && (
                    <>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-500" />
                          {(entry as GuildLeaderboardEntry).contributingMembersCount} / {(entry as GuildLeaderboardEntry).totalMembersCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <FolderGit2 className="w-3.5 h-3.5 text-emerald-500" />
                          {(entry as GuildLeaderboardEntry).completedProjectsCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center hidden sm:table-cell">
                        <TrustScoreBadge score={(entry as GuildLeaderboardEntry).trustScore} size="sm" />
                      </td>
                    </>
                  )}

                  {/* Contribution Score */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-mono font-extrabold text-base text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.3)]">
                      {entry.score.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                    </div>
                  </td>

                  {/* Action Link */}
                  <td className="py-3 px-4 text-center">
                    {category === 'guilds' ? (
                      <Link
                        href="/student/guild"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 inline-flex items-center justify-center transition-colors"
                        title="View Guild"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={category === 'teachers' ? '/teacher/courses' : '/student/profile'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 inline-flex items-center justify-center transition-colors"
                        title="View Profile / Work"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
