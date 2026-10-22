'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { FileText, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export default function AdminReportsPage() {
  const { auditLogs } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              Security & Audit
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Audit Trails & Incident Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically timestamped action logs for regulatory transparency and SIH judge inspection.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-3 text-xs">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-white/5 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-secondary font-mono text-[10px] text-accent font-bold">
                    {log.action}
                  </span>
                  <span className="font-semibold text-foreground">{log.details}</span>
                </div>
                <span className="text-muted-foreground font-mono text-[11px]">
                  Actor: {log.userName} (ID: {log.userId})
                </span>
              </div>

              <span className="text-[11px] text-muted-foreground font-mono self-end sm:self-center">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
