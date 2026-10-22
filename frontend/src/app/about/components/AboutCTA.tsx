'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AboutCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.2 }
    );
    if (ref?.current) observer?.observe(ref?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={ref}
          className="animate-on-scroll glass-card rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, #7c3aed 0%, transparent 60%)' }}
          />
          {/* Noise */}
          <div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none" />

          <div className="relative z-10">
            {/* Pyramid mini */}
            <div className="flex flex-col items-center gap-1 mb-8">
              {['A', 'B', 'C', 'D', 'E']?.map((tier, i) => {
                const colors = ['#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#64748b'];
                const widths = ['24%', '42%', '60%', '78%', '96%'];
                return (
                  <div
                    key={tier}
                    className="flex items-center justify-center rounded-md"
                    style={{
                      width: widths?.[i],
                      height: '28px',
                      background: `linear-gradient(90deg, transparent, ${colors?.[i]}30, transparent)`,
                      border: `1px solid ${colors?.[i]}40`,
                    }}
                  >
                    <span className="rank-mono text-xs font-bold" style={{ color: colors?.[i] }}>{tier}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
              Your Rank Awaits.{' '}
              <span className="text-accent glow-text-amber">Start at E.</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Every A-Rank Guild Master started at E-Rank. The only question is: how fast will you climb?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?role=student"
                className="shimmer-btn text-white font-bold px-8 py-3.5 rounded-full text-sm transition-transform hover:scale-105 text-center"
                style={{ boxShadow: '0 0 30px rgba(124,58,237,0.35)' }}
              >
                Join as Student
              </Link>
              <Link
                href="/features"
                className="glass-card border border-border text-foreground font-semibold px-8 py-3.5 rounded-full text-sm hover:border-primary/50 transition-colors"
              >
                Explore Features
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground opacity-60">
              Launching in Delhi/NCR — August 2026 · Prepared by Akshit Bhatt for SIH 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}