'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bounty } from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import { useUniStore } from '@/lib/data/useUniStore';
import { Briefcase, Building2, Coins, Calendar, Users, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
}

export default function BountyCard({ bounty }: BountyCardProps) {
  const { currentUser, studentProfile, applyToBounty, applications, guilds } = useUniStore();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const [days, setDays] = useState(14);
  const userGuild = guilds.find(
    (g) => g.leaderId === currentUser.id || g.members?.some((m) => m.studentId === currentUser.id)
  );
  const [applicantType, setApplicantType] = useState<'STUDENT' | 'GUILD'>(
    bounty.targetType === 'GUILD' && userGuild ? 'GUILD' : 'STUDENT'
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCompany = currentUser.role === 'COMPANY';
  const hasApplied = applications.some(
    (a) => a.bountyId === bounty.id && (a.applicantId === currentUser.id || (userGuild && a.applicantId === userGuild.id))
  );

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal.trim()) return;

    applyToBounty(bounty.id, applicantType, days, proposal, userGuild?.id);
    setIsSubmitted(true);
    setTimeout(() => {
      setShowApplyModal(false);
      setIsSubmitted(false);
    }, 1200);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <img
              src={bounty.companyLogo}
              alt={bounty.companyName}
              className="w-8 h-8 rounded-xl object-cover border border-purple-500/30"
            />
            <div>
              <span className="text-xs font-bold text-foreground block">{bounty.companyName}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" /> Verified Startup
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-accent font-mono font-bold">
              {bounty.targetType} BOUNTY
            </span>
            <RankBadge rank={bounty.minRank} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {bounty.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {bounty.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bounty.skills.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-border/40 font-mono">
              {s}
            </span>
          ))}
        </div>

        {/* Deliverables snippet */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-secondary/40 border border-slate-200 dark:border-border/40 mb-4 text-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 dark:text-muted-foreground uppercase tracking-widest block font-semibold">
            Scope & Escrow Deliverables
          </span>
          <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            {bounty.deliverables.slice(0, 2).map((d, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="truncate">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer / Budget & Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-muted-foreground block font-mono font-medium">Guaranteed Escrow</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
              ₹{bounty.budgetZeni.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">ZENI</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCompany ? (
            <Link
              href={`/company/applications`}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
            >
              <span>Applications ({bounty.applicationsCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : hasApplied ? (
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Applied
            </span>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/25 transition-all"
            >
              <span>Apply to Bounty</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            href={`/student/bounties/${bounty.id}`}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-slate-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground text-xs"
            title="View bounty milestones and escrow breakdown"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Apply to Bounty Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full glass-card rounded-2xl p-6 border border-primary/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                  Corporate Proposal Submission
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">{bounty.title}</h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Application Sent!</h4>
                <p className="text-xs text-muted-foreground">
                  Application registered on-chain. When hired, the {bounty.budgetZeni.toLocaleString()} ZENI will be locked in smart escrow.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-muted-foreground mb-1 font-medium">Applying As</label>
                  <select
                    value={applicantType}
                    onChange={(e) => setApplicantType(e.target.value as 'STUDENT' | 'GUILD')}
                    className="w-full bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    {userGuild ? (
                      <option value="GUILD" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-slate-100">
                        {userGuild.name} (Lead: {userGuild.leaderName})
                      </option>
                    ) : (
                      <option value="GUILD" disabled className="bg-white dark:bg-[#111333] text-slate-400">
                        No Guild Joined (Join a guild first)
                      </option>
                    )}
                    <option value="STUDENT" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-slate-100">
                      Individual Student ({currentUser.name})
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-muted-foreground mb-1 font-medium">
                    Estimated Delivery Timeline (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 font-semibold border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary font-mono shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-muted-foreground mb-1 font-medium">
                    Proposal / Technical Approach
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe your tech stack, member role allocation, milestone roadmap, and deliverable quality guarantees..."
                    className="w-full bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20 text-[11px] text-purple-800 dark:text-purple-200/80">
                  <span>Economic Rule: Upon hire, 100% funds lock in simulated escrow. On client approval: </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">85% goes to Guild members</span>
                  <span> and 15% to platform.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold hover:opacity-90 shadow-lg shadow-accent/20"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
