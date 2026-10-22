'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import EscrowCard from '@/components/escrow/EscrowCard';
import { FolderGit2, ArrowRight, Lock, Building2, CheckCircle } from 'lucide-react';

export default function CompanyProjectsPage() {
  const { projects, escrows, currentUser } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Contract Fulfillment Workspaces
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Hired Projects & Workspaces</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track hired student teams, review submitted deliverables, and release locked escrow funds.
          </p>
        </div>

        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-border">
              <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No active hired projects yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Visit the Applications tab to hire CyberForge Guild and lock 60,000 ZENI into simulated escrow.
              </p>
              <Link
                href="/company/applications"
                className="inline-block px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs"
              >
                Go to Applications
              </Link>
            </div>
          ) : (
            projects.map((project) => {
              const relatedEscrow = escrows.find((e) => e.projectId === project.id || e.id === project.escrowId);
              return (
                <div key={project.id} className="space-y-4">
                  <div className="glass-card rounded-2xl p-6 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-accent font-mono text-[10px] font-bold">
                          {project.hiredType} CONTRACT
                        </span>
                        <span className="text-xs text-muted-foreground">Hired: {project.hiredName}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      <span className="text-xs font-mono text-emerald-300 font-bold block">
                        ₹{project.budgetZeni.toLocaleString()} ZENI in Escrow Vault
                      </span>
                    </div>

                    <Link
                      href={`/company/projects/${project.id}`}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-primary/20"
                    >
                      <span>Open Workspace Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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
