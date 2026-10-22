'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseCard from '@/components/courses/CourseCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { GraduationCap } from 'lucide-react';

export default function AdminCoursesPage() {
  const { courses } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Academic Operations
          </span>
          <h1 className="text-2xl font-bold text-foreground">Course Batches & Capacity Upgrades</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit platform courses, verified instructors, batch seat caps, and Google Meet rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
