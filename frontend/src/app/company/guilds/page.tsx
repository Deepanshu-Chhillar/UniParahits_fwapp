'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GuildCard from '@/components/guild/GuildCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Shield, Users, Briefcase } from 'lucide-react';

export default function CompanyGuildDiscoveryPage() {
  const { guilds } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Full-Stack Student Agencies
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Guild Discovery</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hire pre-vetted teams of students (Frontend, Backend, UI/UX, QA) under a single contract with automated payout split.
          </p>
        </div>

        <div className="space-y-6">
          {guilds.map((guild) => (
            <GuildCard key={guild.id} guild={guild} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
