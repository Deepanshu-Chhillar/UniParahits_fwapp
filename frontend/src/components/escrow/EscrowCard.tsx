'use client';

import React, { useState } from 'react';
import { Escrow, Project } from '@/lib/types';
import { useUniStore } from '@/lib/data/useUniStore';
import { Lock, Unlock, ShieldCheck, CheckCircle, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import PaymentSplitCard from './PaymentSplitCard';

interface EscrowCardProps {
  escrow: Escrow;
  project?: Project;
}

export default function EscrowCard({ escrow, project }: EscrowCardProps) {
  const { currentUser, approveProjectAndReleaseEscrow, paymentSplits } = useUniStore();
  const [isReleasing, setIsReleasing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCompany = currentUser.role === 'COMPANY' || currentUser.id === escrow.companyId || currentUser.role === 'ADMIN';
  const isReleased = escrow.status === 'RELEASED';
  const hasDeliverable = project?.deliverableUrl || project?.status === 'SUBMITTED_FOR_REVIEW';

  const relatedSplit = paymentSplits.find((p) => p.escrowId === escrow.id || p.projectId === escrow.projectId);

  const handleRelease = () => {
    setErrorMsg('');
    setIsReleasing(true);
    try {
      approveProjectAndReleaseEscrow(escrow.projectId);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to release escrow');
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border space-y-5 relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isReleased
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}
          >
            {isReleased ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Escrow Contract #{escrow.id.slice(-6)}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isReleased
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {escrow.status === 'LOCKED' ? '🔒 FUNDS LOCKED IN VAULT' : '✅ ESCROW SETTLED & RELEASED'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Client: <span className="text-slate-300 font-medium">{escrow.companyName}</span> • Beneficiary: <span className="text-slate-300 font-medium">{escrow.beneficiaryName}</span>
            </span>
          </div>
        </div>

        {/* Budget Value */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
            Locked Capital
          </span>
          <span className="text-2xl font-mono font-extrabold text-emerald-300">
            ₹{escrow.totalAmountZeni.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Escrow Rule Simulation Notice */}
      <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50 text-xs text-muted-foreground leading-relaxed">
        <span className="text-foreground font-semibold">Simulated Escrow Protection: </span>
        Funds remain cryptographically locked and safe in the platform smart vault until the client reviews and approves the submitted deliverable. Zero payment risk for both startup and student guild.
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
          <span className="text-muted-foreground block text-[11px]">85% Guild Workforce Net</span>
          <span className="text-lg font-mono font-bold text-emerald-300">
            ₹{escrow.netPayoutZeni.toLocaleString()} ZENI
          </span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Distributed automatically to verified members according to contribution roles.
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-border/40">
          <span className="text-muted-foreground block text-[11px]">15% Platform Maintenance</span>
          <span className="text-lg font-mono font-bold text-purple-300">
            ₹{escrow.platformFeeZeni.toLocaleString()} ZENI
          </span>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Covers skill verification, dispute prevention, mentor rewards, and infrastructure.
          </span>
        </div>
      </div>

      {/* Deliverable review & release buttons */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      {!isReleased && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {project?.status === 'SUBMITTED_FOR_REVIEW' ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Deliverable submitted! Awaiting client sign-off.
              </span>
            ) : (
              <span>Guild is currently working on project milestones.</span>
            )}
          </div>

          {isCompany ? (
            <button
              onClick={handleRelease}
              disabled={isReleasing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Deliverables & Release Payment</span>
            </button>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              (Switch to Company role NovaTech Labs in top switcher to simulate approval & release)
            </span>
          )}
        </div>
      )}

      {/* Embedded Settlement Split if Released */}
      {isReleased && relatedSplit && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <PaymentSplitCard split={relatedSplit} />
        </div>
      )}
    </div>
  );
}
