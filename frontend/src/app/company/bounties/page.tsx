'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BountyCard from '@/components/bounties/BountyCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Briefcase, PlusCircle, Lock, Users } from 'lucide-react';

export default function CompanyBountiesListPage() {
  const { bounties, currentUser } = useUniStore();

  const myBounties = bounties.filter((b) => b.companyId === 'company-novatech' || currentUser.role === 'ADMIN');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                Corporate Contract Portfolio
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Manage Corporate Bounties</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review open listings, inspect incoming student/guild proposals, and monitor deliverable completion.
            </p>
          </div>

          <Link
            href="/company/bounties/new"
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Bounty</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBounties.map((b) => (
            <BountyCard key={b.id} bounty={b} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
