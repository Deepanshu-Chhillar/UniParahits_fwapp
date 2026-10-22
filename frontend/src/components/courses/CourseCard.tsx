'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Course } from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  Users,
  Coins,
  Video,
  Star,
  ArrowRight,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Lock,
  GraduationCap
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { currentUser, studentProfile, enrollInCourse, upgradeCourseCapacity, isStudentEnrolled } = useUniStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const enrolled = isStudentEnrolled(course.id, currentUser.id);
  const isTeacher = course.teacherId === currentUser.id;
  const isTeacherContext = currentPath.startsWith('/teacher') || isTeacher;
  const courseDetailUrl = isTeacherContext ? `/teacher/courses/${course.id}` : `/student/courses/${course.id}`;
  const isFull = course.enrolledCount >= course.batchCapacity;
  const capacityPct = Math.min(100, Math.round((course.enrolledCount / course.batchCapacity) * 100));

  const handleEnroll = () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = enrollInCourse(course.id, currentUser.id);
      setSuccessMsg(res.message);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to enroll');
    }
  };

  const handleUpgrade = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsUpgrading(true);
    try {
      const res = upgradeCourseCapacity(course.id);
      setSuccessMsg(`Expanded to ${res.newCapacity} seats!`);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to upgrade');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 group relative overflow-hidden">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <img
              src={course.teacherAvatar}
              alt={course.teacherName}
              className="w-7 h-7 rounded-full object-cover border border-primary/40"
            />
            <div className="text-xs">
              <span className="font-bold text-foreground block">{course.teacherName}</span>
              <span className="text-[10px] text-muted-foreground">Instructor</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <RankBadge rank={course.teacherRank} size="sm" />
            <TrustScoreBadge score={course.teacherTrustScore} size="sm" />
          </div>
        </div>

        {/* Course Title & Rating */}
        <div className="mb-2">
          <Link href={courseDetailUrl} className="group-hover:underline">
            <h4 className="text-base font-bold text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
              {course.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
            </span>
            <span>({course.reviewsCount} verified reviews)</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {course.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.skills.map((s) => (
            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-border/40 font-mono">
              {s}
            </span>
          ))}
        </div>

        {/* Batch Capacity Bar (Section 16: e.g. 7 / 10 seats) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-secondary/50 border border-slate-200 dark:border-border/40 mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between items-center font-medium">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Batch Capacity</span>
            </span>
            <span className={`font-mono font-bold ${isFull ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {course.enrolledCount} / {course.batchCapacity} Seats
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/40 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFull ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
              }`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px]">
            {isFull ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> BATCH FULL
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                {course.batchCapacity - course.enrolledCount} seats remaining
              </span>
            )}

            <span className="text-slate-500 dark:text-muted-foreground font-mono flex items-center gap-1">
              <Video className="w-3 h-3 text-blue-500" /> Google Meet Live
            </span>
          </div>
        </div>

        {/* Messages / Alerts */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-[11px] mb-3">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] mb-3">
            {successMsg}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
            ₹{course.priceZeni.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">ZENI</span>
        </div>

        <div className="flex items-center gap-2">
          {isTeacher ? (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/teacher/courses/${course.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Manage Course</span>
              </Link>
              <button
                onClick={handleUpgrade}
                disabled={isUpgrading}
                title="Expand batch capacity (+10 Seats for 500 ZENI)"
                className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold transition-all"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          ) : enrolled ? (
            <Link
              href={`/student/courses/${course.id}`}
              className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary dark:bg-primary/20 text-primary dark:text-primary-foreground hover:text-white text-xs font-bold flex items-center gap-1.5 border border-primary/40 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Enter Classroom</span>
            </Link>
          ) : isFull ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> BATCH FULL
              </span>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Enroll Now</span>
            </button>
          )}

          <Link
            href={courseDetailUrl}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-slate-100 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground text-xs"
            title={isTeacherContext ? 'Instructor Course Management' : 'Course details and curriculum'}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
