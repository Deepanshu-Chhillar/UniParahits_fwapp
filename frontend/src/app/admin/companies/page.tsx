'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { Building2, ShieldCheck, Coins, Briefcase } from 'lucide-react';

export default function AdminCompaniesPage() {
  const { companyProfile } = useUniStore();

  const companies = [companyProfile || {
    companyName: 'NovaTech Labs',
    industry: 'Artificial Intelligence & SaaS',
    trustScore: 4.9,
    bountiesPosted: 3,
    totalSpentZeni: 180000,
    website: 'https://novatechlabs.ai',
  }];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Partner Oversight
          </span>
          <h1 className="text-2xl font-bold text-foreground">Registered Corporate Partners</h1>
        </div>

        <div className="space-y-4">
          {companies.map((c, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">{c.companyName}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                      VERIFIED PARTNER
                    </span>
                  </div>
                  <span className="text-muted-foreground">{c.industry} • {c.website}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-emerald-300 font-bold block text-sm">₹{c.totalSpentZeni.toLocaleString()} ZENI Spent</span>
                <span className="text-[10px] text-muted-foreground">{c.bountiesPosted} Bounties Posted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
