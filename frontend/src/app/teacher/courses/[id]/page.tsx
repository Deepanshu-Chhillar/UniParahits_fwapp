'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import CourseCard from '@/components/courses/CourseCard';
import { ArrowLeft, Users, Video, MessageSquare, PlusCircle } from 'lucide-react';

export default function TeacherCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses } = useUniStore();

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  if (!course) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Course not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/teacher/courses"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                Instructor Console
              </span>
              <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2 text-xs">
              <Link
                href={`/teacher/courses/${course.id}/students`}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-white/10 text-foreground border border-border flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enrolled Students</span>
              </Link>
              <Link
                href={`/teacher/courses/${course.id}/sessions`}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-white/10 text-foreground border border-border flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Classes</span>
              </Link>
              <Link
                href={`/teacher/courses/${course.id}/chat`}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-white/10 text-foreground border border-border flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>Classroom Chat</span>
              </Link>
            </div>
          </div>

          <CourseCard course={course} />
        </div>
      </div>
    </DashboardLayout>
  );
}
