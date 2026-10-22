'use client';
import React, { useEffect, useRef } from 'react';

const problems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
    title: 'Information Asymmetry',
    desc: "Companies don't trust student skills because there's no verifiable proof of quality. Resumes lie. Portfolios are unverified. The signal-to-noise ratio is broken.",
    accent: '#f59e0b',
    stat: '73%',
    statLabel: 'of recruiters cite unverifiable skills as #1 barrier',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'High Transaction Costs',
    desc: 'Messy, unstructured negotiations on WhatsApp with zero accountability. No escrow, no contracts, no recourse. Students get ghosted after delivering work.',
    accent: '#7c3aed',
    stat: '60%',
    statLabel: 'of student freelancers report non-payment incidents',
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div
          ref={(el) => { cardRefs.current[0] = el; }}
          className="animate-on-scroll mb-12 text-center"
        >
          <h2 className="section-title text-foreground mb-4">
            The Student Gig Economy Is{' '}
            <span className="text-primary">Broken</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Traditional platforms like Fiverr are too crowded and globalised for a first-year student to gain traction. Two core failures persist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => { cardRefs.current[i + 2] = el; }}
              className="animate-on-scroll glass-card glass-hover rounded-2xl p-8 relative overflow-hidden group"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Scan line */}
              <div className="scan-line opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Accent glow */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: `radial-gradient(circle, ${p.accent} 0%, transparent 70%)`, filter: 'blur(30px)', transform: 'translate(30%, -30%)' }}
              />

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${p.accent}20`, color: p.accent, border: `1px solid ${p.accent}40` }}
                >
                  {p.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{p.desc}</p>

                <div className="flex items-end gap-3 pt-4 border-t border-border">
                  <span
                    className="rank-mono text-4xl font-bold"
                    style={{ color: p.accent }}
                  >
                    {p.stat}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight mb-1 max-w-[180px]">
                    {p.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}