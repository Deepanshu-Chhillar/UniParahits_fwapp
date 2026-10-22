'use client';

import React from 'react';
import Link from 'next/link';
import { Guild } from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { Shield, Users, Briefcase, Coins, ArrowRight, UserCheck } from 'lucide-react';

interface GuildCardProps {
  guild: Guild;
}

export default function GuildCard({ guild }: GuildCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={guild.logo}
              alt={guild.name}
              className="w-12 h-12 rounded-2xl object-cover border border-primary/40 shadow-lg shadow-primary/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                  {guild.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent font-mono text-[10px] font-bold">
                  GUILD
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{guild.tagline}</span>
            </div>
          </div>

          <TrustScoreBadge score={guild.trustScore} size="sm" />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          {guild.description}
        </p>

        {/* Guild Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/50 text-xs mb-4">
          <div>
            <span className="text-[10px] text-muted-foreground block">Guild Leader</span>
            <span className="font-bold text-foreground block truncate">{guild.leaderName}</span>
            <RankBadge rank={guild.leaderRank} size="sm" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Projects Completed</span>
            <span className="font-bold text-foreground font-mono text-sm">{guild.completedProjects} Done</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Total Revenue</span>
            <span className="font-bold text-emerald-300 font-mono text-sm">₹{guild.totalZeniEarned.toLocaleString()}</span>
          </div>
        </div>

        {/* Member Team Roster & Role Splits (Section 34) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Specialized Roster & Escrow Split ({guild.members.length} Members)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {guild.members.map((member) => (
              <div
                key={member.id}
                className="p-2 rounded-lg bg-white/5 border border-border/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={member.studentAvatar}
                    alt={member.studentName}
                    className="w-6 h-6 rounded-full object-cover border border-border flex-shrink-0"
                  />
                  <div className="truncate">
                    <span className="font-semibold text-foreground block truncate">{member.studentName}</span>
                    <span className="text-[10px] text-muted-foreground block truncate">{member.role}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-1">
                  <span className="text-xs font-mono font-bold text-emerald-300">{member.sharePercentage}%</span>
                  <RankBadge rank={member.studentRank} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {guild.skills.slice(0, 4).map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-border/40">
              {s}
            </span>
          ))}
        </div>

        <Link
          href="/student/guild"
          className="px-3.5 py-1.5 rounded-xl bg-primary/20 hover:bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1.5 border border-primary/40 transition-colors"
        >
          <span>Guild Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
