'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import { Users, ArrowLeft, ShieldCheck, Mail, School } from 'lucide-react';

export default function AdminUsersPage() {
  const { allUsers, switchUser, currentUser } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
              Global Directory
            </span>
            <h1 className="text-2xl font-bold text-foreground">Registered Users & Capabilities</h1>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-4 text-xs">
          <div className="space-y-3">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 rounded-xl bg-white/5 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-primary/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{u.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-accent font-mono text-[10px] font-bold">
                        {u.role}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{u.email} • {u.college}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap gap-1">
                    {u.capabilities.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-[10px]">
                        {c}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => switchUser(u.id)}
                    className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary text-primary-foreground font-bold transition-colors"
                  >
                    Simulate Login
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
