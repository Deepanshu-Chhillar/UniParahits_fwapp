'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

const TIERS = [
  { rank: 'A', label: 'Guild Master',       color: '#f59e0b', glow: 'rgba(245,158,11,0.6)', width: '38%' },
  { rank: 'B', label: 'Senior Lead',       color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)',  width: '52%' },
  { rank: 'C', label: 'Guild Creator',     color: '#3b82f6', glow: 'rgba(59,130,246,0.35)', width: '66%' },
  { rank: 'D', label: 'Teacher & Earner',   color: '#10b981', glow: 'rgba(16,185,129,0.3)',  width: '80%' },
  { rank: 'E', label: 'Verified Apprentice',color: '#64748b', glow: 'rgba(100,116,139,0.2)', width: '95%' },
];

export default function HeroSection() {
  const tiersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TIERS.forEach((_, i) => {
      const t = setTimeout(() => {
        const el = tiersRef.current[i];
        if (el) el.classList.add('lit');
      }, 300 + i * 120);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Atmospheric background blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blob-anim"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blob-anim-delay"
          style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 blob-anim"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '3s' }}
        />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none noise-overlay" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* LEFT SIDE: Guild Pyramid */}
          <div className="w-full flex flex-col items-center justify-center float-anim order-2 lg:order-1">
            <div className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-primary/20 relative overflow-hidden shadow-2xl shadow-purple-950/20 backdrop-blur-xl">
              {/* Header over the pyramid */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-secondary-foreground uppercase">
                    Guild Hierarchy
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                  Strict E → A Tiers
                </span>
              </div>

              {/* The 5 Tiers: A, B, C, D, E */}
              <div className="relative flex flex-col items-center gap-2 sm:gap-2.5 px-2">
                {TIERS.map((tier, i) => (
                  <div
                    key={tier.rank}
                    ref={(el) => { tiersRef.current[i] = el; }}
                    className="pyramid-tier relative flex items-center justify-between px-3 sm:px-5 rounded-xl cursor-default group"
                    style={{
                      width: tier.width,
                      minWidth: '150px',
                      height: '48px',
                      background: `linear-gradient(90deg, rgba(255,255,255,0.04) 0%, ${tier.color}22 50%, rgba(255,255,255,0.04) 100%)`,
                      border: `1px solid ${tier.color}44`,
                      color: tier.color,
                      transition: 'filter 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.boxShadow = `0 0 24px ${tier.glow}`;
                      el.style.filter = 'brightness(1.4)';
                      el.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.boxShadow = '';
                      el.style.filter = '';
                      el.style.transform = '';
                    }}
                  >
                    <span className="rank-mono text-xs sm:text-sm font-bold" style={{ color: tier.color }}>
                      {tier.rank}
                    </span>
                    <span
                      className={`${
                        tier.rank === 'A' ? 'text-[11px] sm:text-xs tracking-tight' : 'text-xs sm:text-sm'
                      } font-semibold tracking-wide opacity-90 truncate px-1 text-center`}
                      style={{ color: tier.color }}
                    >
                      {tier.label}
                    </span>
                    <span className="rank-mono text-xs opacity-50" style={{ color: tier.color }}>
                      {tier.rank}
                    </span>
                  </div>
                ))}

                {/* Pyramid bottom label & micro-stats */}
                <div className="w-full mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="opacity-75">Entry: College Verification</span>
                  <span className="text-accent font-semibold">Apex: Direct Retainers</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content (Headline, Subtitle, CTAs) */}
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-primary/30 text-xs font-semibold uppercase tracking-widest text-secondary-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Smart India Hackathon 2026
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-foreground tracking-tight leading-[1.08]">
              Rank Up.{' '}
              <span className="text-primary">Get Hired.</span>
              <br />
              <span className="glow-text-amber text-accent">The Elite Student</span>
              <br />
              Task Force.
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg font-light max-w-xl leading-relaxed">
              A hyper-local, gamified digital workforce platform built exclusively for college students. Earn XP, climb ranks, form guilds — get paid.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-1">
              <Link
                href="/student/courses"
                className="shimmer-btn text-white font-bold px-8 py-3.5 rounded-full text-sm transition-transform hover:scale-105 shadow-lg text-center"
                style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
              >
                Enter Student Simulator
              </Link>
              <Link
                href="/login?role=company"
                className="glass-card border border-border text-foreground font-semibold px-8 py-3.5 rounded-full text-sm hover:border-primary/50 hover:bg-primary/10 transition-all text-center"
              >
                Hire a Guild (Company View)
              </Link>
            </div>

            {/* Micro highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs text-muted-foreground border-t border-border/40 w-full max-w-lg">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-emerald-400">✓</span>
                <span>85/15 Escrow Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-primary">⚡</span>
                <span>MANA XP & ZENI ₹1 Peg</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
      </div>
    </section>
  );
}