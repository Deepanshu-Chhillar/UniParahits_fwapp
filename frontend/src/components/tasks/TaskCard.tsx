'use client';

import React, { useState } from 'react';
import { Task, SubmissionType } from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import { Sparkles, Coins, Clock, ArrowRight, UploadCloud, CheckCircle, ExternalLink } from 'lucide-react';
import { useUniStore } from '@/lib/data/useUniStore';

interface TaskCardProps {
  task: Task;
  onSelect?: (task: Task) => void;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { studentProfile, submitTask } = useUniStore();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('GITHUB');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    submitTask(task.id, submissionType, submissionUrl, notes);
    setIsSubmitted(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setIsSubmitted(false);
      setSubmissionUrl('');
      setNotes('');
    }, 1200);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group">
      <div>
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium border border-border">
              {task.category}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">
              {task.difficulty}
            </span>
          </div>
          <RankBadge rank={task.requiredRank} size="sm" />
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
          {task.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {task.description}
        </p>

        {/* Required Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.requiredSkills.map((skill) => (
            <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-border/40 font-mono">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Rewards & Action */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-300 font-bold" title="MANA XP reward">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>+{task.manaReward}</span>
            <span className="text-[10px] text-purple-600/80 dark:text-purple-400/70 font-sans">MANA</span>
          </div>

          {task.zeniReward > 0 && (
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold" title="Paid task ZENI reward">
              <Coins className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>₹{task.zeniReward}</span>
              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/70 font-sans">ZENI</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary dark:bg-primary/20 text-primary dark:text-foreground hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-primary/40"
        >
          <span>Submit Proof</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Proof Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-lg w-full glass-card rounded-2xl p-6 border border-primary/40 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                  Proof of Work Verification
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">{task.title}</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1"
              >
                ✕
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Proof Submitted Successfully!</h4>
                <p className="text-xs text-muted-foreground">
                  Your submission has been queued for peer & mentor review. MANA (+{task.manaReward}) will be awarded upon approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Submission Type</label>
                  <select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
                    className="w-full bg-slate-50 dark:bg-[#111333] text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    <option value="GITHUB" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">GitHub Repository URL</option>
                    <option value="FIGMA" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Figma Design File URL</option>
                    <option value="WEBSITE" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Live Deployed Website / Demo URL</option>
                    <option value="FILE" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Document / Code File Gist</option>
                    <option value="VIDEO" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Loom / Video Walkthrough</option>
                    <option value="TEXT" className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold">Written Solution / Documentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    {submissionType} Link or Identifier
                  </label>
                  <input
                    type="url"
                    required
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://github.com/your-username/project-repo"
                    className="w-full bg-slate-50 dark:bg-[#111333] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">
                    Notes for Evaluator / Mentor
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe how you met the acceptance criteria and solved edge cases..."
                    className="w-full bg-slate-50 dark:bg-[#111333] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium border border-slate-300 dark:border-white/10 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-border/40 text-[11px] text-muted-foreground">
                  <span>Acceptance requirement: </span>
                  <span className="text-slate-300">{task.submissionRequirements}</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Submit For Verification
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
