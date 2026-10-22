'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseCard from '@/components/courses/CourseCard';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  GraduationCap,
  Video,
  Users,
  Sparkles,
  CheckCircle,
  PlusCircle,
  BookOpen,
  ArrowLeft,
  LayoutDashboard,
  Home,
  CheckSquare,
  Briefcase,
  Shield,
  Wallet,
  MessageSquare,
} from 'lucide-react';

export default function StudentCoursesPage() {
  const router = useRouter();
  const { courses, currentUser, isStudentEnrolled } = useUniStore();
  const [tab, setTab] = useState<'ALL' | 'ENROLLED'>('ALL');

  const enrolledCourses = courses.filter((c) => isStudentEnrolled(c.id, currentUser.id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
                Peer Learning & Teaching Ecosystem
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold">
                GOOGLE MEET LIVE SESSIONS
              </span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Student Courses & Batches</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Learn practical development & design from verified Rank D+ student teachers. 85% revenue goes directly to teachers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border text-xs">
              <button
                onClick={() => setTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  tab === 'ALL' ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Browse Marketplace ({courses.length})
              </button>
              <button
                onClick={() => setTab('ENROLLED')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  tab === 'ENROLLED' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Classroom ({enrolledCourses.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Economic Sink Explanation Banner (Section 16 & 17) */}
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-foreground block">Circulating Student Economy & Batch Capacity</span>
              <span className="text-muted-foreground text-[11px]">
                Courses start with 10 seats. Once full, enrollment is locked until the teacher spends ZENI to expand capacity (+10 seats).
              </span>
            </div>
          </div>
          <Link
            href="/features"
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold whitespace-nowrap"
          >
            How Capacity Sinks Work →
          </Link>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(tab === 'ALL' ? courses : enrolledCourses).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}

          {tab === 'ENROLLED' && enrolledCourses.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-3 glass-card rounded-2xl border border-border">
              <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No enrolled courses yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore the marketplace and enroll using your ZENI balance to unlock live classes and private doubts chat.
              </p>
              <button
                onClick={() => setTab('ALL')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
              >
                Browse All Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
