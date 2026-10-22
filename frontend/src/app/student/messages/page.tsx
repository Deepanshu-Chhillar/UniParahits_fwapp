'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChatWindow from '@/components/chat/ChatWindow';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  MessageSquare,
  GraduationCap,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

export default function StudentMessagesPage() {
  const { courses, currentUser, isStudentEnrolled } = useUniStore();

  // Find enrolled courses or all available courses
  const enrolledCourses = courses.filter((c) =>
    isStudentEnrolled(c.id, currentUser.id)
  );
  const displayCourses = enrolledCourses.length > 0 ? enrolledCourses : courses;

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    displayCourses[0]?.id || ''
  );

  const activeCourse = displayCourses.find((c) => c.id === selectedCourseId) || displayCourses[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/student/courses"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Courses Hub</span>
            </Link>
          </div>
          <Link
            href="/student/courses?tab=my_courses"
            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>My Enrolled Courses</span>
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                Course Conversations & Doubt Clearing
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Course Classroom Messages</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contextual peer and instructor communication tied directly to your enrolled courses.
            </p>
          </div>

          {/* Course Selector */}
          {displayCourses.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">Course:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="bg-slate-100 dark:bg-[#111333] text-foreground text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {displayCourses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-100 dark:bg-[#111333] text-foreground">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {activeCourse ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                {activeCourse.title}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Instructor: {activeCourse.teacherName}
              </span>
            </div>
            <ChatWindow course={activeCourse} />
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-2xl border border-border space-y-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No Course Conversations Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are not currently enrolled in any courses with an active classroom discussion.
            </p>
            <Link
              href="/student/courses?tab=browse_courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              Browse Available Courses
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
