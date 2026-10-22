'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import EscrowCard from '@/components/escrow/EscrowCard';
import {
  ArrowLeft,
  FolderGit2,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  UploadCloud,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

export default function ProjectWorkspaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { projects, escrows, submitDeliverable, currentUser } = useUniStore();

  const [deliverableUrl, setDeliverableUrl] = useState('https://github.com/CyberForge-Guild/student-hiring-platform');
  const [deliverableNotes, setDeliverableNotes] = useState(
    'Delivered end-to-end full stack application with Next.js 15, Spring Boot REST architecture, PostgreSQL relational models, automated escrow releases, and responsive cybernetic UI.'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const project = projects.find((p) => p.id === resolvedParams.id) || projects[0];

  if (!project) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Project workspace not found.</p>
      </DashboardLayout>
    );
  }

  const relatedEscrow = escrows.find((e) => e.projectId === project.id || e.id === project.escrowId);

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableUrl.trim()) return;

    submitDeliverable(project.id, deliverableUrl, deliverableNotes);
    setSubmittedSuccess(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/student/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        {/* Workspace Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-accent font-mono text-[10px] font-bold">
                  CORPORATE WORKSPACE
                </span>
                <span className="text-xs text-muted-foreground font-mono">ID: {project.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{project.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Client: <span className="text-foreground font-semibold">{project.companyName}</span> • Contract Hired:{' '}
                <span className="text-foreground font-semibold">{project.hiredName}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Escrow Contract Value</span>
              <span className="text-2xl font-mono font-extrabold text-emerald-300">
                ₹{project.budgetZeni.toLocaleString()} ZENI
              </span>
            </div>
          </div>

          {/* Section 33 & 34: Escrow Card Widget with Payout Release */}
          {relatedEscrow && (
            <div>
              <EscrowCard escrow={relatedEscrow} project={project} />
            </div>
          )}

          {/* Deliverable Submission Console */}
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border/60 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Project Deliverable Submission</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  project.status === 'APPROVED_AND_PAID'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : project.status === 'SUBMITTED_FOR_REVIEW'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-muted-foreground border-border'
                }`}
              >
                {project.status}
              </span>
            </div>

            {submittedSuccess || project.deliverableUrl ? (
              <div className="p-4 rounded-xl bg-white/5 border border-border/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Deliverable Submitted for Client Review</span>
                </div>
                <p className="text-muted-foreground font-mono">
                  Repository URL:{' '}
                  <a
                    href={project.deliverableUrl || deliverableUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    {project.deliverableUrl || deliverableUrl}
                  </a>
                </p>
                <p className="text-slate-300 italic">{project.deliverableNotes || deliverableNotes}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitDeliverable} className="space-y-3.5">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Production Repository / Deployed Preview URL
                  </label>
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Release Notes & Verification Instructions
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={deliverableNotes}
                    onChange={(e) => setDeliverableNotes(e.target.value)}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Deliverable for Client Approval</span>
                </button>
              </form>
            )}
          </div>

          {/* Project Milestones */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Contract Milestones & Acceptance Criteria
            </h3>

            <div className="space-y-2">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">{m.title}</span>
                    <span className="text-[11px] text-muted-foreground">{m.description}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-300 block">
                      ₹{m.amountZeni.toLocaleString()} ZENI
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        m.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Member Task Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Team Member Work Allocation
            </h3>

            <div className="space-y-2">
              {project.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <div>
                      <span className="font-bold text-foreground block">{task.title}</span>
                      <span className="text-[11px] text-muted-foreground">Assignee: {task.assigneeName}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      task.status === 'DONE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-primary/20 text-accent border border-primary/40'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
