'use client';
import React, { useEffect, useRef } from 'react';

export default function AboutHero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => ref?.current?.classList?.add('is-visible'), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 text-center overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] opacity-12 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #f59e0b 0%, #7c3aed 40%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none" />

      <div ref={ref} className="animate-on-scroll relative z-10 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1 rounded-full glass-card border border-border text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          About UniParahits
        </span>
        <h1 className="hero-title text-foreground mb-6">
          Built by Students,{' '}
          <span className="text-accent">For Students</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          UniParahits was conceived for the Smart India Hackathon 2026 by Akshit Bhatt — a student who experienced first-hand the broken trust between college talent and local businesses.
        </p>
      </div>
    </section>
  );
}