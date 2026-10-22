'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { Trophy, ArrowLeft, CheckCircle, Sparkles, Coins } from 'lucide-react';

export default function AdminStudentsPage() {
  const { allUsers } = useUniStore();

  const students = [
    { id: 'user-rohan-e', name: 'Rohan Mehta', rank: 'E', trust: 4.1, tasks: 7, mana: 420, zeni: 2500, college: 'DTU' },
    { id: 'user-aarav-d', name: 'Aarav Sharma', rank: 'D', trust: 4.5, tasks: 18, mana: 1850, zeni: 12400, college: 'NSUT' },
    { id: 'user-priya-c', name: 'Priya Singh', rank: 'C', trust: 4.8, tasks: 34, mana: 3400, zeni: 28500, college: 'IIT Delhi' },
    { id: 'user-rahul-b', name: 'Rahul Verma', rank: 'B', trust: 4.7, tasks: 52, mana: 4900, zeni: 45000, college: 'IIIT Delhi' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Rank Distribution Oversight
          </span>
          <h1 className="text-2xl font-bold text-foreground">Students & Meritocratic Ranks</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time breakdown of student workforce progression across ranks E, D, C, B, A.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-3 text-xs">
          {students.map((st) => (
            <div
              key={st.id}
              className="p-4 rounded-xl bg-white/5 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{st.name}</span>
                  <RankBadge rank={st.rank as any} size="sm" />
                  <TrustScoreBadge score={st.trust} size="sm" />
                </div>
                <span className="text-muted-foreground">{st.college} • {st.tasks} verified tasks</span>
              </div>

              <div className="flex items-center gap-4 font-mono">
                <div className="text-right">
                  <span className="text-purple-300 font-bold block">{st.mana.toLocaleString()} MANA</span>
                  <span className="text-[10px] text-muted-foreground">Contribution XP</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 font-bold block">₹{st.zeni.toLocaleString()} ZENI</span>
                  <span className="text-[10px] text-muted-foreground">Wallet Balance</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
