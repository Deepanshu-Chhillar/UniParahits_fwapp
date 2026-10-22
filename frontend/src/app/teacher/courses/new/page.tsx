'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  ArrowLeft,
  GraduationCap,
  Video,
  Coins,
  CheckCircle,
  PlusCircle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function TeacherCreateCoursePage() {
  const router = useRouter();
  const { createCourse, currentUser } = useUniStore();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('Full Stack Web Development');
  const [description, setDescription] = useState(
    'Learn modern full stack engineering with React, Spring Boot REST architecture, PostgreSQL relational models, and production deployment.'
  );
  const [skillsStr, setSkillsStr] = useState('React, TypeScript, Spring Boot, PostgreSQL, Tailwind CSS');
  const [curriculumStr, setCurriculumStr] = useState(
    'Module 1: React 19 & Tailwind\nModule 2: State Management & Hooks\nModule 3: Spring Boot JPA & PostgreSQL Modeling\nModule 4: Deployment & Security'
  );
  const [priceZeni, setPriceZeni] = useState(2000);
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/uni-para-demo');
  const [isPublished, setIsPublished] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const skills = skillsStr.split(',').map((s) => s.trim());
      const curriculum = curriculumStr.split('\n').filter((c) => c.trim().length > 0);

      const created = createCourse({
        title,
        description,
        skills,
        curriculum,
        priceZeni,
        meetUrl,
      });

      setIsPublished(true);
      setTimeout(() => {
        if (created?.id) {
          router.push(`/teacher/courses/${created.id}`);
        } else {
          router.push('/teacher/courses');
        }
      }, 1500);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to create course');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/teacher/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teacher Dashboard</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                Instructor Console (Rank D+)
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Launch New Course Batch</h1>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {errorMsg}
            </div>
          )}

          {isPublished ? (
            <div className="py-12 text-center space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Course Batch Successfully Published!</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Initial batch capacity set to 10 seats. Enrolled students can now access Google Meet sessions and private classroom chat.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Step 1: Course Info */}
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Course Description & Outcomes</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what practical skills and deliverables students will master..."
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {/* Step 2: Skills */}
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">
                  Skills Taught (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                />
              </div>

              {/* Step 3: Curriculum */}
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">
                  Curriculum Modules (one per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={curriculumStr}
                  onChange={(e) => setCurriculumStr(e.target.value)}
                  className="w-full bg-secondary/80 border border-border rounded-xl p-3 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                />
              </div>

              {/* Step 4 & 5: Pricing, Capacity, and Google Meet Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Price in ZENI (₹)</label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={priceZeni}
                    onChange={(e) => setPriceZeni(Number(e.target.value))}
                    className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground font-mono"
                  />
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    You receive 85% (₹{Math.round(priceZeni * 0.85)} ZENI) per student enrolled
                  </span>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Initial Batch Capacity</label>
                  <input
                    type="number"
                    disabled
                    value={10}
                    className="w-full bg-secondary/40 border border-border rounded-xl p-2.5 text-muted-foreground font-mono cursor-not-allowed"
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Starts at 10 seats. Expandable later via ZENI capacity upgrades.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Meet Private URL</span>
                </label>
                <input
                  type="url"
                  required
                  value={meetUrl}
                  onChange={(e) => setMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full bg-secondary/80 border border-border rounded-xl p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-200/80">
                <span>By publishing, your course becomes discoverable in the course marketplace. Enrolled students gain immediate access to Google Meet sessions and private doubts chat.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Course Batch (10 Seats)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
