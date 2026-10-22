'use client';
import React, { useEffect, useRef } from 'react';

const rankData = [
  { rank: 'A', color: '#f59e0b', req: '5+ successful enterprise deliverables, 4.8+ Trust Score', perks: 'Apex Guild Master, highest tier bounties, direct company hiring retainers.', level: 1, isApex: true },
  { rank: 'B', color: '#8b5cf6', req: 'Lead active Guilds, ₹25,000+ total earned', perks: 'Priority corporate search, enterprise project access, reduced platform fee.', level: 2 },
  { rank: 'C', color: '#3b82f6', req: 'Earn ₹5,000 ZENI + 3× 5-star reviews', perks: '⚡ Unlocks Guild Creation, Mentorship of E students, Course Reviews.', level: 3, highlight: true },
  { rank: 'D', color: '#10b981', req: 'Complete 10+ verified tasks, 4.2+ Trust Score', perks: 'Paid corporate bounties, teach courses, earn ZENI & MANA.', level: 4 },
  { rank: 'E', color: '#64748b', req: 'Verify college student email & profile', perks: 'Learn, foundational tasks, submit proof, join courses, earn MANA.', level: 5 },
];

export default function RankTable() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="animate-on-scroll">
          <h2 className="section-title text-foreground mb-2 text-center">Complete Rank Reference</h2>
          <p className="text-muted-foreground text-center mb-10">All 5 meritocratic ranks (E to A), their requirements, and what they unlock.</p>

          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <div className="col-span-1">Rank</div>
              <div className="col-span-1 hidden sm:block">Lvl</div>
              <div className="col-span-5 sm:col-span-4">Requirement</div>
              <div className="col-span-6 sm:col-span-6">Unlocks</div>
            </div>

            {rankData?.map((r, i) => (
              <div
                key={r?.rank}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-border last:border-0 items-center transition-colors hover:bg-white/5 ${r?.highlight ? 'bg-blue-500/5' : ''}`}
              >
                <div className="col-span-1">
                  <span
                    className="rank-mono text-base font-bold"
                    style={{ color: r?.color, textShadow: r?.isApex ? `0 0 10px ${r?.color}` : undefined }}
                  >
                    {r?.rank}
                  </span>
                </div>
                <div className="col-span-1 hidden sm:block">
                  <span className="rank-mono text-xs text-muted-foreground">{r?.level}</span>
                </div>
                <div className="col-span-5 sm:col-span-4">
                  <span className="text-xs text-muted-foreground">{r?.req}</span>
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <span className="text-xs" style={{ color: r?.highlight ? r?.color : undefined }}>{r?.perks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}