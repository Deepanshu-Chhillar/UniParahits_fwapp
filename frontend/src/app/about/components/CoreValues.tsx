'use client';
import React, { useEffect, useRef } from 'react';

const values = [
  {
    icon: '⚔️',
    title: 'Meritocracy First',
    desc: 'Every rank is earned through demonstrated skill. No shortcuts, no pay-to-win. Your track record speaks for you.',
    color: '#f59e0b',
  },
  {
    icon: '🔒',
    title: 'Trust by Design',
    desc: 'Smart escrow, college email verification, and automated quality control ensure every transaction is safe for both sides.',
    color: '#3b82f6',
  },
  {
    icon: '🎮',
    title: 'Gamified Growth',
    desc: 'Progression should feel rewarding. We borrow the best mechanics from RPGs to make skill-building genuinely fun.',
    color: '#a855f7',
  },
  {
    icon: '🤝',
    title: 'Community Over Competition',
    desc: 'Guilds create mentorship loops. Senior A and B-rank leaders coach E-rank recruits. Rising together is baked into the model.',
    color: '#22c55e',
  },
  {
    icon: '🌏',
    title: 'Hyper-Local Roots',
    desc: 'Starting in Delhi/NCR colleges. We grow trust city by city, campus by campus — not globally diluted from day one.',
    color: '#7c3aed',
  },
  {
    icon: '⚡',
    title: 'Zero Friction',
    desc: 'Automated payments, auto-split escrow, algorithmic quality control. No manual mediation. No human bottlenecks.',
    color: '#ef4444',
  },
];

export default function CoreValues() {
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
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full glass-card border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Core Values
          </span>
          <h2 className="section-title text-foreground mb-4">
            What We{' '}
            <span className="text-primary">Stand For</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Six principles that guide every product decision at UniParahits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <div
              key={v.title}
              ref={(el) => { refs.current[i + 1] = el; }}
              className="animate-on-scroll glass-card rounded-2xl p-6 group glass-hover relative overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 30% 30%, ${v.color}10 0%, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
                >
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}