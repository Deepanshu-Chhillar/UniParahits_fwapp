'use client';
import React, { useEffect, useRef } from 'react';

export default function MissionVision() {
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
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div
            ref={(el) => { refs.current[0] = el; }}
            className="animate-on-scroll glass-card rounded-2xl p-8 relative overflow-hidden group glass-hover"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'radial-gradient(circle at top left, rgba(124,58,237,0.1) 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  🎯
                </div>
                <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To build India&apos;s most trusted, gamified student talent network — where every college student can prove their skills, earn real money, and grow through a merit-based rank system that employers actually trust.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div
            ref={(el) => { refs.current[1] = el; }}
            className="animate-on-scroll glass-card rounded-2xl p-8 relative overflow-hidden group glass-hover"
            style={{ transitionDelay: '120ms' }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'radial-gradient(circle at top right, rgba(245,158,11,0.1) 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  🌟
                </div>
                <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A future where every Indian college student has a verifiable digital work identity — their rank is their resume, their guild is their firm, and their first ₹ earned in college is just the beginning of a lifelong career.
              </p>
            </div>
          </div>
        </div>

        {/* Origin Story */}
        <div
          ref={(el) => { refs.current[2] = el; }}
          className="animate-on-scroll mt-6 glass-card rounded-2xl p-8 relative overflow-hidden"
          style={{ transitionDelay: '200ms' }}
        >
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">The Origin Story</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In 2026, Akshit Bhatt — a student frustrated by the chaos of WhatsApp-based freelancing, ghost payments, and unverifiable skill claims — designed UniParahits for the Smart India Hackathon. The insight was simple: the gig economy needed what gaming already had — a rank system that meant something.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The name <span className="text-foreground font-semibold">UniParahits</span> reflects the platform&apos;s dual identity: <em>University</em> (the origin) and <em>Parahits</em> (beyond self — serving others through skilled collaboration). It&apos;s not just a platform. It&apos;s a movement to make college talent verifiable, valuable, and visible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}