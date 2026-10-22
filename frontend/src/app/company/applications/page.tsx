'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import {
  Users,
  Briefcase,
  Lock,
  CheckCircle,
  Coins,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Clock
} from 'lucide-react';

export default function CompanyApplicationsPage() {
  const { applications, hireApplicant, projects, currentUser } = useUniStore();
  const [successMsg, setSuccessMsg] = useState('');

  const handleHire = (bountyId: string, appId: string, appName: string) => {
    try {
      const res = hireApplicant(bountyId, appId);
      setSuccessMsg(`Successfully hired ${appName}! 100% contract funds locked in simulated escrow vault.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Hiring failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Candidate Selection & Smart Contract Escrow
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Talent & Guild Applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review proposals from student freelancers and verified Guilds. Clicking &quot;Hire&quot; establishes a dedicated workspace and locks 100% budget in simulated escrow.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <Link
              href="/company/projects"
              className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors whitespace-nowrap"
            >
              Open Project Workspace →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-16 glass-card rounded-2xl border border-border">
              No applications submitted yet.
            </p>
          ) : (
            applications.map((app) => {
              const isAccepted = app.status === 'ACCEPTED';
              return (
                <div
                  key={app.id}
                  className={`glass-card rounded-2xl p-6 border transition-all space-y-4 ${
                    isAccepted ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.applicantAvatar}
                        alt={app.applicantName}
                        className="w-12 h-12 rounded-2xl object-cover border border-primary/40 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">{app.applicantName}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent font-mono text-[10px] font-bold">
                            {app.applicantType}
                          </span>
                          <RankBadge rank={app.applicantRank} size="sm" />
                          <TrustScoreBadge score={app.trustScore} size="sm" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Applied for: <span className="text-slate-200 font-semibold">{app.bountyTitle}</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-center border ${
                        isAccepted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-primary/20 text-accent border-primary/40'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Proposal Details */}
                  <div className="p-4 rounded-xl bg-secondary/60 border border-border/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-mono text-[11px] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" /> Proposed Delivery: {app.proposedDeliveryDays} Days
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Escrow Value: 60,000 ZENI
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">&ldquo;{app.proposal}&rdquo;</p>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {app.skills.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-border/40">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground">
                      Hiring locks 60,000 ZENI into simulated escrow (85% Guild / 15% Platform fee on release).
                    </span>

                    {!isAccepted ? (
                      <button
                        onClick={() => handleHire(app.bountyId, app.id, app.applicantName)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Hire & Lock 60,000 ZENI in Escrow</span>
                      </button>
                    ) : (
                      <Link
                        href="/company/projects"
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-1.5"
                      >
                        <span>View Project Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
