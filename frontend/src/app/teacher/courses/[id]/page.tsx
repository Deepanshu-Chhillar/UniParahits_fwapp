'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import {
  ArrowLeft,
  Users,
  Video,
  MessageSquare,
  PlusCircle,
  Flame,
  Coins,
  Star,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function TeacherCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses, currentUser, upgradeCourseCapacity, studentProfile } = useUniStore();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  if (!course) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
          <p className="text-muted-foreground text-sm">Course not found or no longer available.</p>
          <Link
            href="/teacher/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Courses</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isTeacher = course.teacherId === currentUser.id || currentUser.role === 'ADMIN';
  const isFull = course.enrolledCount >= course.batchCapacity;
  const capacityPct = Math.min(100, Math.round((course.enrolledCount / course.batchCapacity) * 100));
  const teacherShare = Math.round(course.priceZeni * 0.85);
  const nextSession = course.sessions?.[0];

  const handleUpgradeCapacity = () => {
    setIsUpgrading(true);
    try {
      const res = upgradeCourseCapacity(course.id);
      showToast(`Batch Capacity Expanded! Burned 500 ZENI deflationary sink. New capacity: ${res.newCapacity} seats.`);
    } catch (e: any) {
      showToast(e.message || 'Failed to expand capacity.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <Flame className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Back Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/teacher/courses"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-muted-foreground hover:text-foreground text-xs font-mono font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Manage Courses</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono text-[10px] font-bold">
              INSTRUCTOR MANAGEMENT CONSOLE
            </span>
            <RankBadge rank={course.teacherRank} size="sm" />
          </div>
        </div>

        {/* Course Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-start gap-4">
              <img
                src={course.teacherAvatar}
                alt={course.teacherName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
              />
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-500 font-bold block">
                  Active Monitored Masterclass // Batch #{course.id.slice(-4)}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white">
                  {course.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono pt-0.5">
                  <span>Instructor: <span className="font-bold text-slate-800 dark:text-slate-200">{course.teacherName}</span></span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{course.rating.toFixed(1)}</span>
                  </span>
                  <span>({course.reviewsCount} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Sub-portal Quick Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
              <Link
                href={`/teacher/courses/${course.id}/students`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold transition-all"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Roster ({course.enrolledCount})</span>
              </Link>
              <Link
                href={`/teacher/courses/${course.id}/sessions`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold transition-all"
              >
                <Video className="w-4 h-4 text-blue-500" />
                <span>Live Classes</span>
              </Link>
              <Link
                href={`/teacher/courses/${course.id}/chat`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span>Doubt Chat</span>
              </Link>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-body">
            {course.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 mr-1">Skills Taught:</span>
            {course.skills.map((s) => (
              <span
                key={s}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-mono font-medium"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Course Price</span>
              <span className="text-lg font-bold text-amber-500 mt-0.5 block">₹{course.priceZeni.toLocaleString()} ZENI</span>
              <span className="text-[10px] text-emerald-500 font-sans">₹{teacherShare} (85% net) per student</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Enrolled Students</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 block">
                {course.enrolledCount} / {course.batchCapacity} Seats
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                {course.batchCapacity - course.enrolledCount} open slots remaining
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Cumulative Revenue</span>
              <span className="text-lg font-bold text-cyan-500 mt-0.5 block">
                ₹{(course.enrolledCount * teacherShare).toLocaleString()} ZENI
              </span>
              <span className="text-[10px] text-slate-400 font-sans">Credited to Teacher Wallet</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Student Rating</span>
              <span className="text-lg font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
                <span>{course.rating.toFixed(1)}</span>
                <Star className="w-4 h-4 fill-emerald-500" />
              </span>
              <span className="text-[10px] text-slate-400 font-sans">{course.reviewsCount} ratings</span>
            </div>
          </div>
        </div>

        {/* Batch Capacity & Deflationary Expansion Sink (Section 16) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
                TMS Compute & Seat Allocation Sink
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-headline text-slate-900 dark:text-white">
                Classroom Batch Capacity ({course.enrolledCount} / {course.batchCapacity} Seats)
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-mono text-xs font-bold border self-start sm:self-center ${
                isFull
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              }`}
            >
              {isFull ? 'BATCH FULL' : `${course.batchCapacity - course.enrolledCount} SEATS AVAILABLE`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400">Seat Occupancy</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {course.enrolledCount} of {course.batchCapacity} Seats Taken ({capacityPct}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isFull ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>

          {/* Deflationary Capacity Burn Action */}
          <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white">
                  Expand Batch Capacity (+10 Seats)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-body">
                  Burn 500 ZENI deflationary sink to admit 10 more students into this batch.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUpgradeCapacity}
              disabled={isUpgrading}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white font-mono text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>{isUpgrading ? 'Expanding...' : 'Burn 500 ZENI (+10 Seats)'}</span>
            </button>
          </div>
        </div>

        {/* Live Google Meet Session Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-bold block">
                Scheduled Daily Lecture
              </span>
              <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                Live Google Meet Interactive Room
              </h3>
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                {course.meetUrl || 'https://meet.google.com/uni-para-demo'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={course.meetUrl || 'https://meet.google.com/uni-para-demo'}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Video className="w-4 h-4" />
              <span>Launch Live Meet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href={`/teacher/courses/${course.id}/sessions`}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border border-slate-200 dark:border-white/10 transition-all"
            >
              All Sessions
            </Link>
          </div>
        </div>

        {/* Curriculum & Lesson Breakdown */}
        {course.curriculum && course.curriculum.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  Curriculum Modules & Lesson Plan
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400">
                {course.curriculum.length} Modules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.curriculum.map((mod, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono flex items-start gap-3"
                >
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 shrink-0">
                    M{idx + 1}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-sans font-medium leading-relaxed">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Student Reviews */}
        {course.reviews && course.reviews.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  Verified Student Testimonials & Ratings
                </h3>
              </div>
              <span className="font-mono text-xs text-amber-500 font-bold">
                {course.rating.toFixed(1)} / 5.0 Rating
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.studentAvatar}
                        alt={rev.studentName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-white/10"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{rev.studentName}</span>
                      <RankBadge rank={rev.studentRank} size="sm" />
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
