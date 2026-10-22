'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import { ArrowLeft, Users, Calendar, Coins, CheckCircle } from 'lucide-react';

export default function TeacherCourseStudentsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses } = useUniStore();

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  // Mock roster of enrolled students
  const enrolledStudents = [
    { id: 'user-rohan-e', name: 'Rohan Mehta', rank: 'E', date: '2026-09-01', zeniPaid: 2000, progress: '35%' },
    { id: 'user-tanmay', name: 'Tanmay Joshi', rank: 'E', date: '2026-09-02', zeniPaid: 2000, progress: '60%' },
    { id: 'user-ananya', name: 'Ananya Gupta', rank: 'E', date: '2026-09-03', zeniPaid: 2000, progress: '75%' },
    { id: 'user-kartik', name: 'Kartik Sharma', rank: 'E', date: '2026-09-04', zeniPaid: 2000, progress: '20%' },
    { id: 'user-sneha', name: 'Sneha Rao', rank: 'E', date: '2026-09-05', zeniPaid: 2000, progress: '50%' },
    { id: 'user-manish', name: 'Manish Kumar', rank: 'E', date: '2026-09-06', zeniPaid: 2000, progress: '40%' },
    { id: 'user-pooja', name: 'Pooja Verma', rank: 'E', date: '2026-09-07', zeniPaid: 2000, progress: '80%' },
  ];

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
                Classroom Attendance & Enrollment
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Enrolled Students ({enrolledStudents.length} / {course?.batchCapacity || 10})
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">{course?.title}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-right">
              <span className="text-muted-foreground block text-[10px]">Your 85% Net Revenue</span>
              <span className="text-lg font-mono font-bold text-emerald-300">
                ₹{(enrolledStudents.length * (course?.priceZeni || 2000) * 0.85).toLocaleString()} ZENI
              </span>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="space-y-2">
            {enrolledStudents.map((st, i) => (
              <div
                key={st.id}
                className="p-3.5 rounded-xl bg-white/5 border border-border/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-mono w-4">{i + 1}.</span>
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center font-bold">
                    {st.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{st.name}</span>
                    <span className="text-[11px] text-muted-foreground">Enrolled on {st.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="font-mono text-emerald-300 font-bold block">+₹{st.zeniPaid * 0.85} Share</span>
                    <span className="text-[10px] text-muted-foreground">Progress: {st.progress}</span>
                  </div>
                  <RankBadge rank={st.rank as any} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
