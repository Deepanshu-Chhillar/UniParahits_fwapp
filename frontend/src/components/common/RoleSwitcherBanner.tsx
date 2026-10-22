'use client';

import React from 'react';
import { useUniStore } from '@/lib/data/useUniStore';
import { UserCheck, RefreshCw, Sparkles, Building2, ShieldCheck, GraduationCap } from 'lucide-react';
import RankBadge from './RankBadge';

export default function RoleSwitcherBanner() {
  const { currentUser, studentProfile, switchUser, resetDatabase, allUsers } = useUniStore();

  const handleReset = () => {
    if (confirm('Reset UniParahits simulation database back to original SIH demo state?')) {
      resetDatabase();
      window.location.reload();
    }
  };

  const getRoleLabel = (userId: string) => {
    switch (userId) {
      case 'user-rohan-e':
        return 'E-Rank Student (Rohan)';
      case 'user-aarav-d':
        return 'D-Rank Teacher & Earner (Aarav)';
      case 'user-priya-c':
        return 'C-Rank Mentor & Guild Lead (Priya)';
      case 'user-rahul-b':
        return 'B-Rank Senior Lead (Rahul)';
      case 'user-novatech':
        return 'Company (NovaTech Labs)';
      case 'user-admin':
        return 'Platform Administrator';
      default:
        return userId;
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0c0c24]/90 backdrop-blur-md border-b border-primary/20 px-3 py-2 sm:px-6 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left info */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-muted-foreground uppercase tracking-wider hidden sm:inline">
            SIH 2026 LIVE DEMO
          </span>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span>Current Role:</span>
            <span className="text-accent font-bold">{currentUser.name}</span>
            {studentProfile && <RankBadge rank={studentProfile.currentRank} size="sm" />}
            {currentUser.role === 'COMPANY' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                COMPANY
              </span>
            )}
            {currentUser.role === 'ADMIN' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Right Switcher pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground hidden md:inline font-mono">Quick Switch:</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-white/10 text-white font-bold border border-white/20 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer shadow-sm hover:bg-white/15 transition-colors"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id} className="bg-[#111333] text-white font-semibold py-1">
                {getRoleLabel(u.id)}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            title="Reset database to initial demo state"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
