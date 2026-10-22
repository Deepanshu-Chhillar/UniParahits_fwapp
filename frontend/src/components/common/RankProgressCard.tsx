'use client';

import React, { useState } from 'react';
import { useUniStore } from '@/lib/data/useUniStore';
import { Trophy, CheckCircle, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';
import RankBadge from './RankBadge';
import { RANK_DEFINITIONS } from '@/lib/data/initialData';
import { GrowthPath } from '@/lib/types';

export default function RankProgressCard() {
  const { studentProfile, economyConfig, promoteToRankD } = useUniStore();
  const [showGrowthModal, setShowGrowthModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState<GrowthPath>('BOTH');

  if (!studentProfile) return null;

  const currentRank = studentProfile.currentRank;
  const isRankE = currentRank === 'E';
  const isRankD = currentRank === 'D';
  const isRankC = currentRank === 'C';

  // Target requirement logic
  const targetRank = isRankE ? 'D' : isRankD ? 'C' : isRankC ? 'B' : 'A';
  const targetDef = RANK_DEFINITIONS[targetRank];

  const tasksRequired = isRankE ? economyConfig.minTasksRankD : 25;
  const tasksCurrent = studentProfile.tasksCompleted;
  const tasksPct = Math.min(100, Math.round((tasksCurrent / tasksRequired) * 100));

  const trustRequired = isRankE ? economyConfig.minTrustScoreRankD : 4.4;
  const trustCurrent = studentProfile.trustScore;

  const isDReady = studentProfile.isDReady || (isRankE && tasksCurrent >= tasksRequired && trustCurrent >= trustRequired);

  const handlePromote = () => {
    promoteToRankD(studentProfile.userId, selectedPath);
    setShowGrowthModal(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Rank Progression Engine
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-accent text-[10px] font-bold">
              MERITOCRATIC
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RankBadge rank={currentRank} size="lg" showTitle />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <RankBadge rank={targetRank} size="md" showTitle />
          </div>
        </div>

        {isDReady && isRankE && (
          <button
            onClick={() => setShowGrowthModal(true)}
            className="px-4 py-2 rounded-xl shimmer-btn text-white text-xs font-bold shadow-lg shadow-primary/30 flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            RANK UP TO D (READY)
          </button>
        )}
      </div>

      {/* Progress Bars and Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
        {/* Metric 1: Verified Tasks */}
        <div className="p-3 rounded-xl bg-white/5 border border-border/40">
          <div className="flex justify-between items-center text-muted-foreground mb-1">
            <span>Verified Tasks</span>
            <span className="font-mono font-bold text-foreground">
              {tasksCurrent} / {tasksRequired}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${tasksPct}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            {tasksPct >= 100 ? '✅ Requirement satisfied' : `${tasksRequired - tasksCurrent} more tasks needed`}
          </span>
        </div>

        {/* Metric 2: Trust Score */}
        <div className="p-3 rounded-xl bg-white/5 border border-border/40">
          <div className="flex justify-between items-center text-muted-foreground mb-1">
            <span>Trust Score</span>
            <span className="font-mono font-bold text-foreground">
              {trustCurrent.toFixed(1)} / {trustRequired.toFixed(1)}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary/80 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (trustCurrent / 5.0) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground mt-1 block">
            {trustCurrent >= trustRequired ? '✅ Maintained above threshold' : 'Requires higher peer ratings'}
          </span>
        </div>

        {/* Metric 3: Proof of Work */}
        <div className="p-3 rounded-xl bg-white/5 border border-border/40">
          <div className="flex justify-between items-center text-muted-foreground mb-1">
            <span>Practical Proof</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> APPROVED
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            GitHub code repository and Figma mockups verified by senior peer review.
          </p>
        </div>

        {/* Metric 4: Mentor Recommendation */}
        <div className="p-3 rounded-xl bg-white/5 border border-border/40">
          <div className="flex justify-between items-center text-muted-foreground mb-1">
            <span>Mentor Endorsement</span>
            <span className="text-blue-400 font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> RECOMMENDED
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Endorsed by C-Rank Mentor Priya Singh for active initiative.
          </p>
        </div>
      </div>

      {/* Growth Path Modal (Section 23: FLOW 2) */}
      {showGrowthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full glass-card rounded-2xl p-6 border border-primary/40 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Choose Your Growth Path</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You have reached Rank D! Select your focus path (you can always adapt later):
              </p>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setSelectedPath('PROJECT')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPath === 'PROJECT' ? 'border-primary bg-primary/20 shadow-md' : 'border-border/60 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="path"
                  checked={selectedPath === 'PROJECT'}
                  onChange={() => setSelectedPath('PROJECT')}
                  className="mt-1"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Option A: Project Path</h4>
                  <p className="text-xs text-muted-foreground">
                    Work on paid corporate bounties, join high-value Guild missions, build freelance reputation.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedPath('TEACHING')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPath === 'TEACHING' ? 'border-emerald-500 bg-emerald-500/20 shadow-md' : 'border-border/60 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="path"
                  checked={selectedPath === 'TEACHING'}
                  onChange={() => setSelectedPath('TEACHING')}
                  className="mt-1"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Option B: Teaching Path</h4>
                  <p className="text-xs text-muted-foreground">
                    Launch courses, conduct live Google Meet classes, earn 85% course revenue & teaching MANA.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setSelectedPath('BOTH')}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedPath === 'BOTH' ? 'border-accent bg-accent/20 shadow-md' : 'border-border/60 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="path"
                  checked={selectedPath === 'BOTH'}
                  onChange={() => setSelectedPath('BOTH')}
                  className="mt-1"
                />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Option C: Both (Recommended)</h4>
                  <p className="text-xs text-muted-foreground">
                    Deliver corporate projects while mentoring students and running courses simultaneously.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowGrowthModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-xs text-muted-foreground hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handlePromote}
                className="flex-1 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs hover:opacity-90 shadow-lg shadow-accent/20"
              >
                Confirm Rank D Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
