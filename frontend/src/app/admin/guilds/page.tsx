'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GuildCard from '@/components/guild/GuildCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Shield } from 'lucide-react';

export default function AdminGuildsPage() {
  const { guilds } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Workforce Governance
          </span>
          <h1 className="text-2xl font-bold text-foreground">Registered Student Guilds</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit guild leadership (Rank C+ required), verified member distribution, and cumulative project payouts.
          </p>
        </div>

        <div className="space-y-6">
          {guilds.map((g) => (
            <GuildCard key={g.id} guild={g} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
