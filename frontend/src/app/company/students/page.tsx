'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { Search, Filter, School, CheckCircle, ExternalLink, Mail, UserCheck } from 'lucide-react';

export default function CompanyStudentDiscoveryPage() {
  const { allUsers, studentProfile } = useUniStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');

  const studentUsers = allUsers.filter((u) => u.role === 'STUDENT');

  const filtered = studentUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || (u.headline && u.headline.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Verified Student Workforce
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Student Talent Discovery</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Discover verified student developers, designers, and project managers backed by provable merit and trust scores.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl glass-card border border-border flex flex-col sm:flex-row items-center gap-3 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, role, or technical skill..."
              className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-muted-foreground whitespace-nowrap">Filter Rank:</span>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="bg-secondary border border-border rounded-xl px-3 py-2 text-foreground"
            >
              <option value="ALL" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">All Ranks (E to A)</option>
              <option value="E" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank E</option>
              <option value="D" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank D</option>
              <option value="C" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank C</option>
              <option value="B" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank B</option>
              <option value="A" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Rank A</option>
            </select>
          </div>
        </div>

        {/* Students Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="glass-card rounded-2xl p-5 border border-border hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-xl object-cover border border-primary/40"
                  />
                  <div className="flex items-center gap-1.5">
                    <RankBadge
                      rank={user.id === 'user-rohan-e' ? 'E' : user.id === 'user-aarav-d' ? 'D' : user.id === 'user-priya-c' ? 'C' : 'B'}
                      size="sm"
                    />
                    <TrustScoreBadge score={user.id === 'user-priya-c' ? 4.8 : 4.5} size="sm" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground">{user.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{user.headline}</p>

                <div className="flex items-center gap-1 text-[11px] text-primary mt-2">
                  <School className="w-3.5 h-3.5" />
                  <span className="truncate">{user.college}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" /> College Verified
                </span>

                <a
                  href={`mailto:${user.email}`}
                  className="px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-colors border border-primary/40"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
