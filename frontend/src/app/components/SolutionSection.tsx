'use client';
import React, { useEffect, useRef } from 'react';

const pillars = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'E to A Ranking System',
    desc: 'Skill verified through task completion — ranks are earned, never purchased. Every student has a provable, meritocratic track record.',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Dual-Economy Engine',
    desc: 'MANA for verified skill tasks, learning & teaching. ZENI (₹1 = 1 ZENI) for paid corporate bounties and course enrollments.',
    color: '#7c3aed',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Guild Formation',
    desc: 'C-Rank+ students create teams. Guilds take full-stack projects. Automatic XP and ₹ splits by contribution — the agency model for campus.',
    color: '#a855f7',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: 'Smart Escrow Contracts',
    desc: 'Zero fraud, zero manual mediation. Money locked in escrow until delivery approval — 85% to guild, 15% to platform. Fully automated.',
    color: '#3b82f6',
  },
];

export default function SolutionSection() {
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
    <section id="solution" className="py-20 px-4 sm:px-6 relative">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={(el) => { refs.current[0] = el; }} className="animate-on-scroll mb-14 text-center">
          <h2 className="section-title text-foreground mb-4">
            Where{' '}
            <span className="text-primary">EdTech</span> Meets{' '}
            <span className="text-accent">Gig Economy</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            UniParahits sits at the intersection of skill development and real earnings — a platform built from the ground up for Gen-Z students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => { refs.current[i + 2] = el; }}
              className="animate-on-scroll glass-card glass-hover rounded-2xl p-6 relative overflow-hidden group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${p.color}15 0%, transparent 60%)` }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}35` }}
              >
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2 relative z-10">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}