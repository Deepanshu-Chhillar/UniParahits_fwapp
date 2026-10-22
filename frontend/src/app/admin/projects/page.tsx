'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EscrowCard from '@/components/escrow/EscrowCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { Lock } from 'lucide-react';

export default function AdminProjectsPage() {
  const { escrows, projects } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Escrow Audit
          </span>
          <h1 className="text-2xl font-bold text-foreground">Projects & Escrow Smart Contracts</h1>
        </div>

        <div className="space-y-6">
          {escrows.map((escrow) => (
            <EscrowCard
              key={escrow.id}
              escrow={escrow}
              project={projects.find((p) => p.id === escrow.projectId)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
