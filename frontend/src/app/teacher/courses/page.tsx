'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseCard from '@/components/courses/CourseCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { GraduationCap, PlusCircle, Users, Video, MessageSquare } from 'lucide-react';

export default function TeacherCoursesListPage() {
  const { courses, currentUser } = useUniStore();

  const myCourses = courses.filter((c) => c.teacherId === currentUser.id || currentUser.role === 'ADMIN');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                Course Management
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">My Teaching Batches</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitor batch enrollments, upgrade seat capacities (+10 seats), and manage live Google Meet sessions.
            </p>
          </div>

          <Link
            href="/teacher/courses/new"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch New Course</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
