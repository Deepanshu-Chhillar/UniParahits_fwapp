'use client';
import React, { useEffect, useRef } from 'react';

export default function DualEconomySection() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="economy" className="py-20 px-4 sm:px-6 relative">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #7c3aed 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll mb-14 text-center">
          <h2 className="section-title text-foreground mb-4">
            Learn First.{' '}
            <span className="text-accent">Earn Second.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Structured like an RPG — two parallel economies that reward both skill-building and real output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* XP Side */}
          <div
            ref={(el) => { refs.current[2] = el; }}
            className="animate-on-scroll glass-card rounded-2xl p-8 relative overflow-hidden group glass-hover"
          >
            <div
              className="absolute top-0 right-0 w-56 h-56 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(30%, -30%)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="rank-mono text-lg font-bold text-primary">XP</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Points Economy</h3>
                  <p className="text-xs text-muted-foreground">Peer-to-Peer Tasks</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Help fellow students with tasks — design critiques, code reviews, notes, tutoring. Earn XP that builds your Trust Score and rank. Free, fast, and frictionless.
              </p>

              <div className="space-y-3">
                {['College Email Verified', 'Peer Task Completion', 'Trust Score Building', 'Rank Progression F→C'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div className="mt-6 flex items-end gap-2 h-16">
                {[30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm group-hover:brightness-125 transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      background: `rgba(124, 58, 237, ${0.3 + i * 0.08})`,
                      transitionDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">XP gained over 7 weeks</p>
            </div>
          </div>

          {/* INR Side */}
          <div
            ref={(el) => { refs.current[3] = el; }}
            className="animate-on-scroll glass-card rounded-2xl p-8 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '120ms' }}
          >
            <div
              className="absolute top-0 right-0 w-56 h-56 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(30%, -30%)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <span className="rank-mono text-lg font-bold text-accent">₹</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Real Money Economy</h3>
                  <p className="text-xs text-muted-foreground">Corporate Bounties</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Higher-rank students unlock corporate &quot;Bounties&quot; — real paid gigs from local startups and businesses. Guilds can take on full projects worth ₹50,000+.
              </p>

              <div className="space-y-3">
                {['D-Rank+ unlocks paid gigs', 'C-Rank+ guild formation', 'Auto smart escrow payment', 'Hall of Fame = direct interviews'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* Earnings display */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Bounty', val: '₹8K' },
                  { label: 'Guild Project', val: '₹50K+' },
                  { label: 'Platform Cut', val: '15%' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="rank-mono text-lg font-bold text-accent">{s.val}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}