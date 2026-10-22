'use client';
import React, { useEffect, useRef } from 'react';

const swot = [
  {
    label: 'Strengths',
    icon: '💪',
    color: '#22c55e',
    items: [
      'Hyper-local trust via College Email verification',
      'Gamified retention — E to A rank progression',
      'Guild system simplifies hiring for startups',
      'Zero-fraud smart escrow eliminates payment risk',
    ],
  },
  {
    label: 'Weaknesses',
    icon: '⚠️',
    color: '#f59e0b',
    items: [
      'Requires highly engaged user base (chicken-and-egg)',
      'Tech-heavy infrastructure for automated escrow',
      'Initial trust-building with businesses is slow',
    ],
  },
  {
    label: 'Opportunities',
    icon: '🚀',
    color: '#7c3aed',
    items: [
      'Massive untapped market of 40M+ Gen-Z students',
      'Data monetization: talent analytics to corporate HRs',
      'Campus placement partnerships with top companies',
      'Expansion to Tier-2 and Tier-3 college cities',
    ],
  },
  {
    label: 'Threats',
    icon: '🛡️',
    color: '#ef4444',
    items: [
      'Platform leakage (off-platform dealing) — mitigated by rank lock',
      'Global giants (Fiverr) introducing student-only features',
      'Regulatory risk around student employment contracts',
    ],
  },
];

export default function SwotSection() {
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
    <section id="swot" className="py-20 px-4 sm:px-6 relative">
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(7,7,26,0.8), transparent)' }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll mb-14 text-center">
          <h2 className="section-title text-foreground mb-4">
            Honest{' '}
            <span className="text-primary">Self-Assessment</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We know where we stand. UniParahits is built on a clear-eyed view of the competitive landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {swot.map((q, i) => (
            <div
              key={q.label}
              ref={(el) => { refs.current[i + 2] = el; }}
              className="animate-on-scroll glass-card rounded-2xl p-6 sm:p-8 group glass-hover relative overflow-hidden"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(ellipse at top left, ${q.color}08 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{q.icon}</span>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: q.color }}
                  >
                    {q.label}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {q.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: q.color }}
                      />
                      <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={(el) => { refs.current[swot.length + 2] = el; }}
          className="animate-on-scroll mt-16 text-center"
        >
          <div className="glass-card rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: 'radial-gradient(ellipse at center, #7c3aed 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Ready to{' '}
                <span className="text-accent glow-text-amber">Rank Up?</span>
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join the waitlist for UniParahits — launching in Delhi/NCR colleges first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#"
                  className="shimmer-btn text-white font-bold px-8 py-3.5 rounded-full text-sm transition-transform hover:scale-105"
                  style={{ boxShadow: '0 0 30px rgba(124,58,237,0.35)' }}
                >
                  Join as Student
                </a>
                <a
                  href="#"
                  className="glass-card border border-border text-foreground font-semibold px-8 py-3.5 rounded-full text-sm hover:border-primary/50 transition-colors"
                >
                  Hire a Guild
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}