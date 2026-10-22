'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import BountyCard from '@/components/bounties/BountyCard';
import { ArrowLeft, Users, Lock, Coins, CheckCircle } from 'lucide-react';

export default function CompanyBountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { bounties, applications } = useUniStore();

  const bounty = bounties.find((b) => b.id === resolvedParams.id) || bounties[0];
  const relatedApps = applications.filter((a) => a.bountyId === bounty?.id);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/company/bounties"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bounties</span>
        </Link>

        {bounty && (
          <div className="space-y-6">
            <BountyCard bounty={bounty} />

            <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="text-base font-bold text-foreground">
                  Applicant Proposals ({relatedApps.length})
                </h3>
                <Link
                  href="/company/applications"
                  className="text-xs text-primary hover:text-accent font-semibold"
                >
                  Go to Hiring Decision Console →
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                {relatedApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-foreground block">{app.applicantName}</span>
                      <span className="text-muted-foreground">Proposed {app.proposedDeliveryDays} days delivery</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold">{app.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
