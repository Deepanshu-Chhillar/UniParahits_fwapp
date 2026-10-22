'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { Briefcase, ArrowLeft, PlusCircle, Coins, Lock, CheckCircle } from 'lucide-react';
import { RankCode } from '@/lib/types';

export default function CompanyPostBountyPage() {
  const router = useRouter();
  const { postBounty } = useUniStore();

  const [title, setTitle] = useState('Build Student Hiring Platform');
  const [description, setDescription] = useState(
    'NovaTech Labs requires an end-to-end multi-role web platform allowing verified student talent to collaborate in Guilds, receive escrow-protected corporate contracts, and complete milestones.'
  );
  const [skillsStr, setSkillsStr] = useState('React, Node.js, Spring Boot, PostgreSQL, Tailwind CSS');
  const [budgetZeni, setBudgetZeni] = useState(60000);
  const [deadline, setDeadline] = useState('2026-10-15T23:59:59Z');
  const [minRank, setMinRank] = useState<RankCode>('C');
  const [targetType, setTargetType] = useState<'INDIVIDUAL' | 'GUILD'>('GUILD');
  const [deliverablesStr, setDeliverablesStr] = useState(
    'Responsive React + Tailwind dashboard\nRelational PostgreSQL schema with constraints\nEscrow payment release pipeline\nRole-based Guild payout distribution'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr.split(',').map((s) => s.trim());
    const deliverables = deliverablesStr.split('\n').filter((d) => d.trim().length > 0);

    postBounty({
      title,
      description,
      skills,
      budgetZeni,
      deadline,
      minRank,
      targetType,
      deliverables,
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/company/bounties');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/company/bounties"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bounties</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary block">
                Corporate Work Creator
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Post Corporate Bounty</h1>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Corporate Bounty Successfully Published!</h2>
              <p className="text-xs text-muted-foreground">
                Verified student candidates and Guilds can now review the deliverables and apply.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Bounty Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Project Scope & Deliverable Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Target Work Entity</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as any)}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground"
                  >
                    <option value="GUILD" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Student Guild (Team of Specialists)</option>
                    <option value="INDIVIDUAL" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Individual Student Contractor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Minimum Verified Rank</label>
                  <select
                    value={minRank}
                    onChange={(e) => setMinRank(e.target.value as any)}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground"
                  >
                    <option value="C" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Rank C (Guild Creator / Senior)</option>
                    <option value="D" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Rank D (Contributor / Earner)</option>
                    <option value="B" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Rank B (Project Lead)</option>
                    <option value="A" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white">Rank A (Apex Guild Master)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Budget in ZENI (1 ZENI = ₹1)</label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={budgetZeni}
                    onChange={(e) => setBudgetZeni(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    Locked in simulated escrow upon hiring applicant.
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Completion Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline.slice(0, 10)}
                    onChange={(e) => setDeadline(`${e.target.value}T23:59:59Z`)}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Required Technical Skills (comma separated)</label>
                <input
                  type="text"
                  required
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Key Milestone Deliverables (one per line)</label>
                <textarea
                  rows={4}
                  required
                  value={deliverablesStr}
                  onChange={(e) => setDeliverablesStr(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Bounty to Student Marketplace</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
