'use client';
import React, { useEffect, useRef } from 'react';

// BENTO GRID AUDIT:
// Array has 6 cards: [RankingCard, DualEconomy, GuildSystem, EscrowCard, TrustScore, Demotion]
// Grid: 3 cols
// Row 1: [col-1: RankingCard cs-1 rs-2] [col-2: DualEconomy cs-2 rs-1]
// Row 2: [col-1: FILLED-RankingCard]    [col-2: GuildSystem cs-1]        [col-3: EscrowCard cs-1]
// Row 3: [col-1: TrustScore cs-2]                                         [col-3: Demotion cs-1]
// Placed 6/6 cards ✓

export default function FeaturesBento() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.06 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Desktop bento grid */}
        <div className="hidden md:grid grid-cols-3 grid-rows-3 gap-5 auto-rows-fr" style={{ gridTemplateRows: 'repeat(3, minmax(200px, auto))' }}>

          {/* [col-1 rs-2]: RankingCard */}
          <div
            ref={(el) => { refs.current[0] = el; }}
            className="animate-on-scroll col-span-1 row-span-2 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover flex flex-col"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at top, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">E to A Ranking System</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                5-tier meritocratic progression. Every rank is earned through verified task completion — never purchased. Your rank is your reputation.
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                {['E — Verified Apprentice', 'D — Teacher & Earner', 'C — Guild & Mentor Unlock', 'B — Senior Lead', 'A — Apex Guild Master'].map((r, i) => (
                  <div key={r} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ['#64748b','#10b981','#3b82f6','#8b5cf6','#f59e0b'][i] }} />
                    <span className="text-xs text-muted-foreground">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* [col-2 cs-2]: DualEconomy */}
          <div
            ref={(el) => { refs.current[1] = el; }}
            className="animate-on-scroll col-span-2 row-span-1 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '80ms' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(245,158,11,0.08) 100%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 h-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="rank-mono text-2xl font-bold text-primary">XP</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="rank-mono text-2xl font-bold text-accent">₹</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Dual-Economy Model</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Two parallel reward systems: XP for peer tasks builds your Trust Score, while ₹ Bounties from corporate clients reward proven talent.
                </p>
              </div>
              <div className="flex gap-3 items-end">
                {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                  <div key={i} className="w-6 rounded-sm" style={{ height: `${h}%`, background: `linear-gradient(to top, #7c3aed, #f59e0b)`, opacity: 0.5 + i * 0.07 }} />
                ))}
              </div>
            </div>
          </div>

          {/* [col-2]: GuildSystem */}
          <div
            ref={(el) => { refs.current[2] = el; }}
            className="animate-on-scroll col-span-1 row-span-1 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '160ms' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at top right, rgba(168,85,247,0.1) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Guild Formation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                C-Rank+ students create multi-role teams. Take on full-stack projects. Auto-split rewards by contribution.
              </p>
            </div>
          </div>

          {/* [col-3]: EscrowCard */}
          <div
            ref={(el) => { refs.current[3] = el; }}
            className="animate-on-scroll col-span-1 row-span-1 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '240ms' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at top right, rgba(59,130,246,0.1) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Smart Escrow</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Zero fraud. Funds locked until delivery approval. 85% to guild, 15% platform. Fully automated.
              </p>
            </div>
          </div>

          {/* [col-1 cs-2]: TrustScore */}
          <div
            ref={(el) => { refs.current[4] = el; }}
            className="animate-on-scroll col-span-2 row-span-1 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '120ms' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.06) 0%, transparent 60%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-semibold uppercase tracking-widest">Live System</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Trust Score Engine</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every task completion, rating, and delivery time feeds into a continuous Trust Score. Minimum 4.0 required for rank progression — maintained automatically.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2 w-40">
                {[{ label: 'Delivery Speed', val: 92 }, { label: 'Client Rating', val: 88 }, { label: 'Completion Rate', val: 96 }].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{m.label}</span>
                      <span className="rank-mono text-xs text-foreground">{m.val}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-green-500/70" style={{ width: `${m.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* [col-3]: Demotion */}
          <div
            ref={(el) => { refs.current[5] = el; }}
            className="animate-on-scroll col-span-1 row-span-1 glass-card rounded-2xl p-7 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '200ms', border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at bottom right, rgba(239,68,68,0.08) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Demotion Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Low rating → Trust Score drop → automatic demotion. Extreme violations: permanent &quot;Court Martial&quot; ban.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: single column */}
        <div className="md:hidden flex flex-col gap-4">
          {[
            { title: 'E to A Ranking System', color: '#f59e0b', desc: '5-tier meritocratic progression. Ranks earned through verified task completion — never purchased.' },
            { title: 'Dual-Economy Model', color: '#7c3aed', desc: 'MANA for verified skill tasks and mentorship. ZENI (₹1 = 1 ZENI) for corporate bounties and course enrollments.' },
            { title: 'Guild Formation', color: '#a855f7', desc: 'C-Rank+ students create multi-role teams. Take on full-stack projects with auto-split rewards.' },
            { title: 'Smart Escrow', color: '#3b82f6', desc: 'Zero fraud. Funds locked until delivery approval. 85% to guild, 15% platform. Fully automated.' },
            { title: 'Trust Score Engine', color: '#22c55e', desc: 'Every task feeds a continuous Trust Score. Minimum 4.0 required for rank progression.' },
            { title: 'Demotion Engine', color: '#ef4444', desc: 'Low rating → Trust Score drop → automatic demotion. Extreme violations: permanent ban.' },
          ].map((f, i) => (
            <div
              key={f.title}
              ref={(el) => { refs.current[i + 6] = el; }}
              className="animate-on-scroll glass-card rounded-xl p-6 glass-hover"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <h3 className="text-base font-bold text-foreground mb-2" style={{ color: f.color }}>{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}