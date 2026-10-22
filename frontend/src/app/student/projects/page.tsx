'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { FolderGit2, Building2, Coins, ArrowRight, CheckCircle, Lock, Calendar } from 'lucide-react';
import EscrowCard from '@/components/escrow/EscrowCard';

export default function StudentProjectsPage() {
  const { projects, escrows, currentUser } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                Corporate Delivery Workspace
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                ESCROW BACKED
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Active Workspaces & Projects</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live corporate workspaces for hired student teams. Milestone tracking, task assignment, and deliverable review.
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-border">
              <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No active corporate projects yet</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Once a company accepts your Guild application, a dedicated workspace is created and contract funds lock into escrow.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/student/bounties"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Browse Open Bounties
                </Link>
                <Link
                  href="/company/applications"
                  className="px-4 py-2 rounded-xl bg-secondary border border-border text-xs text-foreground font-semibold"
                >
                  Simulate Company Hire (FLOW 8)
                </Link>
              </div>
            </div>
          ) : (
            projects.map((project) => {
              const relatedEscrow = escrows.find((e) => e.projectId === project.id || e.id === project.escrowId);
              return (
                <div key={project.id} className="space-y-4">
                  <div className="glass-card rounded-2xl p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent text-[10px] font-mono font-bold">
                          {project.hiredType} WORKSPACE
                        </span>
                        <span className="text-xs text-muted-foreground">• Client: {project.companyName}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Contract Value: <span className="text-emerald-300 font-mono font-bold">₹{project.budgetZeni.toLocaleString()} ZENI</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/student/projects/${project.id}`}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {relatedEscrow && <EscrowCard escrow={relatedEscrow} project={project} />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
