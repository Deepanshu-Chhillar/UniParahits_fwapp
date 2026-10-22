'use client';
import React, { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Company Posts Bounty',
    desc: 'A verified local business or startup posts a paid project with clear deliverables and budget.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: '#3b82f6',
  },
  {
    num: '02',
    title: 'Guild Applies',
    desc: 'A verified guild (or high-rank solo student) applies. Their rank and Trust Score are visible.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'Escrow Locked',
    desc: 'Company deposits the full project fee into the Smart Escrow Contract. Funds are secured — zero risk.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    color: '#f59e0b',
  },
  {
    num: '04',
    title: 'Work Delivered & Approved',
    desc: 'Guild submits work. Company reviews and approves. Rating is given. No manual mediation needed.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    color: '#a855f7',
  },
  {
    num: '05',
    title: 'Auto-Split Released',
    desc: 'Smart contract auto-releases: 85% to Guild (split by contribution) + 15% platform fee. Instant, zero fraud.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: '#f59e0b',
    isLast: true,
  },
];

export default function EscrowSection() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.08 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="escrow" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll mb-4 text-center">
          <h2 className="section-title text-foreground mb-4">
            Zero Fraud.{' '}
            <span className="text-accent">Fully Automated.</span>
          </h2>
        </div>
        <div ref={(el) => { refs.current[2] = el; }} className="animate-on-scroll mb-14 text-center">
          <p className="text-muted-foreground max-w-lg mx-auto">
            Smart Escrow Contracts eliminate payment risk for both sides. The Demotion Engine maintains quality without any manual review.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-px bg-gradient-to-b from-border via-primary/30 to-transparent hidden sm:block" />

          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => { refs.current[i + 3] = el; }}
                className="animate-on-scroll flex gap-4 sm:gap-6 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Step indicator */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center z-10 relative glass-card group-hover:scale-110 transition-transform"
                    style={{ border: `1px solid ${step.color}40`, color: step.color }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 glass-card rounded-xl p-5 group-hover:border-white/20 transition-colors relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${step.color}08 0%, transparent 60%)` }}
                  />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:gap-4">
                    <span
                      className="rank-mono text-xs font-bold mb-1 sm:mb-0 sm:mt-0.5 flex-shrink-0"
                      style={{ color: step.color }}
                    >
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                    {step.isLast && (
                      <div className="mt-3 sm:mt-0 sm:ml-auto flex-shrink-0 flex gap-3">
                        <div className="text-center px-3 py-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                          <p className="rank-mono text-base font-bold text-accent">85%</p>
                          <p className="text-xs text-muted-foreground">Guild</p>
                        </div>
                        <div className="text-center px-3 py-2 rounded-lg" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
                          <p className="rank-mono text-base font-bold text-primary">15%</p>
                          <p className="text-xs text-muted-foreground">Platform</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demotion Engine */}
        <div
          ref={(el) => { refs.current[steps.length + 3] = el; }}
          className="animate-on-scroll mt-10 glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden group"
          style={{ border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'radial-gradient(ellipse at left, rgba(239,68,68,0.05) 0%, transparent 60%)' }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground mb-1">
                The Demotion Engine — Automated Quality Control
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Late delivery or plagiarised work → low client rating → algorithm instantly drops Trust Score → automatic rank demotion (e.g., B-Rank → C-Rank). Extreme violations result in permanent ban: <span className="font-bold text-red-400">&quot;Court Martial.&quot;</span> No manual review. No bias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}