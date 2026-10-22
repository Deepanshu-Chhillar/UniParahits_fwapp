'use client';
import React, { useEffect, useRef } from 'react';

const markets = [
  {
    label: 'TAM',
    full: 'Total Addressable Market',
    value: '$455B',
    desc: 'Global Gig Economy Market',
    size: 100,
    color: '#7c3aed',
  },
  {
    label: 'SAM',
    full: 'Serviceable Addressable Market',
    value: '$20–30B',
    desc: 'Indian Freelance & Student Economy (40M+ higher-ed students)',
    size: 66,
    color: '#a855f7',
  },
  {
    label: 'SOM',
    full: 'Serviceable Obtainable Market',
    value: 'Delhi/NCR',
    desc: 'Initial launchpad — College ecosystem in Delhi/NCR',
    size: 33,
    color: '#f59e0b',
  },
];

export default function MarketSizeSection() {
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
    <section id="market" className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={(el) => { refs.current[1] = el; }} className="animate-on-scroll mb-14 text-center">
          <h2 className="section-title text-foreground mb-4">
            A{' '}<span className="text-primary">$455 Billion</span> Opportunity
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Starting hyper-local in Delhi/NCR, scaling to India&apos;s 40M+ higher-education students.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {markets.map((m, i) => (
            <div
              key={m.label}
              ref={(el) => { refs.current[i + 2] = el; }}
              className="animate-on-scroll glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden group glass-hover"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, ${m.color}10 0%, transparent 60%)` }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <span
                    className="rank-mono text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}
                  >
                    {m.label}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{m.full}</p>
                      <p className="text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                    <span
                      className="rank-mono text-2xl sm:text-3xl font-bold flex-shrink-0"
                      style={{ color: m.color }}
                    >
                      {m.value}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${m.size}%`, background: `linear-gradient(90deg, ${m.color}80, ${m.color})` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}