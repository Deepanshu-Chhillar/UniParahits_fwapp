'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { ArrowLeft, Video, Calendar, Clock, ExternalLink, PlusCircle } from 'lucide-react';

export default function TeacherCourseSessionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses } = useUniStore();

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href={`/teacher/courses/${course?.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Management</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/50">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
                Live Interactive Classes
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Google Meet Scheduled Classes</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{course?.title}</p>
            </div>
          </div>

          <div className="space-y-3">
            {course?.sessions?.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl bg-white/5 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 block">Lesson {session.lessonNumber}</span>
                    <h4 className="text-sm font-bold text-foreground">{session.topic}</h4>
                    <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" /> {session.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> {session.startTime} - {session.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={session.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Live Class</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
