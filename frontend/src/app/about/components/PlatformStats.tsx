'use client';
import React, { useEffect, useRef } from 'react';

const stats = [
  { value: '40M+', label: 'Higher-Ed Students in India', color: '#f59e0b' },
  { value: '$455B', label: 'Global Gig Economy TAM', color: '#7c3aed' },
  { value: '5', label: 'Rank Tiers (E to A)', color: '#a855f7' },
  { value: '85%', label: 'Guild Payout on Every Bounty', color: '#3b82f6' },
  { value: '15%', label: 'Platform Commission (flat)', color: '#6b7280' },
  { value: '0', label: 'Manual Payment Mediations', color: '#22c55e' },
];

export default function PlatformStats() {
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
    <section className="py-16 px-4 sm:px-6 relative">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #7c3aed 0%, transparent 60%)' }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll text-center mb-12">
          <h2 className="section-title text-foreground mb-4">
            The Numbers Behind{' '}
            <span className="text-accent">UniParahits</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A platform built on real data, real opportunity, and a real commitment to student welfare.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => { refs.current[i + 1] = el; }}
              className="animate-on-scroll glass-card rounded-2xl p-6 text-center group glass-hover relative overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(circle at center, ${s.color}08 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <p
                  className="rank-mono text-3xl sm:text-4xl font-bold mb-2"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SIH context */}
        <div
          ref={(el) => { refs.current[stats.length + 1] = el; }}
          className="animate-on-scroll mt-8 glass-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5"
          style={{ border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            🏆
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground mb-1">
              Smart India Hackathon 2026 — SIH Submission
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              UniParahits was conceived and developed as a SIH 2026 project by <span className="text-foreground font-medium">Akshit Bhatt</span> in August 2026. The platform addresses the real, documented problem of unverifiable student talent and high-friction freelance transactions in India&apos;s college ecosystem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}