'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import EscrowCard from '@/components/escrow/EscrowCard';
import { ArrowLeft, FolderGit2, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export default function CompanyProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { projects, escrows } = useUniStore();

  const project = projects.find((p) => p.id === resolvedParams.id) || projects[0];

  if (!project) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Project not found.</p>
      </DashboardLayout>
    );
  }

  const relatedEscrow = escrows.find((e) => e.projectId === project.id || e.id === project.escrowId);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          href="/company/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Company Projects</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest block">
                Corporate Contract Oversight
              </span>
              <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
              <p className="text-xs text-muted-foreground">
                Hired Team: <span className="text-foreground font-semibold">{project.hiredName}</span>
              </p>
            </div>

            <span className="text-2xl font-mono font-extrabold text-emerald-300">
              ₹{project.budgetZeni.toLocaleString()} ZENI
            </span>
          </div>

          {/* Interactive EscrowCard with release button */}
          {relatedEscrow && <EscrowCard escrow={relatedEscrow} project={project} />}

          {/* Deliverable Review */}
          {project.deliverableUrl && (
            <div className="p-5 rounded-2xl bg-secondary/60 border border-emerald-500/40 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Submitted Work For Review</span>
                </div>
                <span className="text-muted-foreground font-mono">
                  Submitted: {project.submittedAt?.slice(0, 10)}
                </span>
              </div>
              <p className="text-slate-200 font-mono">
                Repository:{' '}
                <a
                  href={project.deliverableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline flex-inline items-center gap-1"
                >
                  {project.deliverableUrl}
                </a>
              </p>
              <p className="text-muted-foreground italic">&ldquo;{project.deliverableNotes}&rdquo;</p>
            </div>
          )}

          {/* Milestones */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Milestones</h3>
            <div className="space-y-2">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-foreground block">{m.title}</span>
                    <span className="text-[11px] text-muted-foreground">{m.description}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-300 font-bold block">₹{m.amountZeni.toLocaleString()} ZENI</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
