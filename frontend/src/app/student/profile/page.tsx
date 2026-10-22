'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { useUniStore } from '@/lib/data/useUniStore';
import { User, Mail, School, Shield, Trophy, Sparkles, Coins, GitBranch, ExternalLink, CheckCircle } from 'lucide-react';

export default function StudentProfilePage() {
  const { currentUser, studentProfile } = useUniStore();

  if (!studentProfile) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Student profile not loaded.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/50 shadow-xl shadow-primary/20"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                  <RankBadge rank={studentProfile.currentRank} size="md" showTitle />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentUser.headline}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-primary" /> {studentProfile.college}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-accent" /> {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            <TrustScoreBadge score={studentProfile.trustScore} size="lg" />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">About & Objectives</h3>
            <p className="text-sm text-foreground leading-relaxed">{studentProfile.bio}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Tasks Completed</span>
              <span className="text-xl font-mono font-bold text-foreground">{studentProfile.tasksCompleted}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
              <span className="text-muted-foreground block text-[11px]">Projects Completed</span>
              <span className="text-xl font-mono font-bold text-foreground">{studentProfile.projectsCompleted}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
              <span className="text-purple-300 block text-[11px]">MANA Earned</span>
              <span className="text-xl font-mono font-bold text-purple-300">
                {studentProfile.manaBalance.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-emerald-300 block text-[11px]">ZENI Earned</span>
              <span className="text-xl font-mono font-bold text-emerald-300">
                ₹{studentProfile.zeniBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Verified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {studentProfile.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-border/40 text-xs text-foreground flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-accent" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="pt-4 border-t border-border/50 flex flex-wrap gap-3">
            {studentProfile.githubUrl && (
              <a
                href={studentProfile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-secondary/80 border border-border hover:border-primary text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            )}
            {studentProfile.portfolioUrl && (
              <a
                href={studentProfile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-secondary/80 border border-border hover:border-primary text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Portfolio Website</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
