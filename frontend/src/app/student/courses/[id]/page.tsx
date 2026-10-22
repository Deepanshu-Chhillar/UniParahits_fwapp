'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import ChatWindow from '@/components/chat/ChatWindow';
import {
  ArrowLeft,
  Video,
  Users,
  Calendar,
  Clock,
  Star,
  BookOpen,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Lock,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

export default function CourseClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { courses, currentUser, isStudentEnrolled, addCourseReview } = useUniStore();
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];
  const enrolled = course ? isStudentEnrolled(course.id, currentUser.id) : false;
  const isTeacher = course?.teacherId === currentUser.id;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !course) return;
    try {
      addCourseReview(course.id, reviewRating, reviewComment);
      setReviewSubmitted(true);
      setReviewComment('');
    } catch (e) {
      console.error(e);
    }
  };

  if (!course) {
    return (
      <DashboardLayout>
        <p className="text-center py-12 text-muted-foreground">Course not found.</p>
      </DashboardLayout>
    );
  }

  const nextSession = course.sessions?.[0];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Back Navigation & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  router.push('/student/courses');
                }
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-md shadow-purple-600/20 cursor-pointer"
            title="Click to go one step back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Link href="/student/courses" className="hover:text-foreground transition-colors">
              Courses Hub
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
          </div>
        </div>

        {/* Instructor Switcher Banner (If User is the Teacher of this Course) */}
        {isTeacher && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-foreground block text-sm">Instructor Console Available</span>
                <span className="text-muted-foreground">You created and manage this course. Open the dedicated Teacher Management Console to monitor batches, seat capacities, and student rosters.</span>
              </div>
            </div>
            <Link
              href={`/teacher/courses/${course.id}`}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shrink-0 flex items-center gap-2 shadow-md shadow-amber-500/20 self-start sm:self-center"
            >
              <span>Manage Course as Teacher</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Course Header Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <img
                src={course.teacherAvatar}
                alt={course.teacherName}
                className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/40"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{course.title}</h1>
                <span className="text-xs text-muted-foreground">
                  Instructor: <span className="text-foreground font-semibold">{course.teacherName}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <RankBadge rank={course.teacherRank} size="md" showTitle />
              <TrustScoreBadge score={course.teacherTrustScore} size="md" />
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>

          {/* Section 20: Google Meet Class Widget */}
          {nextSession && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-secondary to-purple-950/40 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 block">
                    NEXT LIVE CLASS (GOOGLE MEET)
                  </span>
                  <h3 className="text-base font-bold text-foreground">{nextSession.topic}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> {nextSession.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> {nextSession.startTime} - {nextSession.endTime}
                    </span>
                  </div>
                </div>
              </div>

              {enrolled || isTeacher ? (
                <a
                  href={nextSession.meetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>JOIN GOOGLE MEET</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Enroll to access private Google Meet link</span>
                </div>
              )}
            </div>
          )}

          {/* Curriculum & Lessons */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
              Curriculum Roadmap ({course.lessons.length} Modules)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl bg-white/5 border border-border/40 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center text-muted-foreground text-[11px] font-mono">
                    <span>Lesson {lesson.orderIndex}</span>
                    <span>{lesson.durationMinutes} mins</span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{lesson.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 21: Private Course Classroom Chat */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Private Classroom Chat & Q&A</span>
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              Teacher + Enrolled Students Only
            </span>
          </div>

          <ChatWindow course={course} />
        </section>

        {/* Section 22: Course Reviews */}
        <section className="glass-card rounded-2xl p-6 border border-border space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div>
              <h3 className="text-base font-bold text-foreground">Verified Student Reviews</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1 text-amber-400 font-bold font-mono text-sm">
                  <Star className="w-4 h-4 fill-amber-400" /> {course.rating.toFixed(1)}
                </span>
                <span>Average rating ({course.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {course.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-white/5 border border-border/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.studentAvatar}
                      alt={rev.studentName}
                      className="w-6 h-6 rounded-full object-cover border border-border"
                    />
                    <span className="font-bold text-foreground">{rev.studentName}</span>
                    <RankBadge rank={rev.studentRank} size="sm" />
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form (Enrolled Students Only) */}
          {enrolled && (
            <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-border/50 space-y-3 text-xs">
              <h4 className="font-bold text-foreground">Leave a Review for {course.teacherName}</h4>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white font-semibold border border-slate-300 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value={5} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold py-1">⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                  <option value={4} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold py-1">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                  <option value={3} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold py-1">⭐⭐⭐ 3 Stars - Average</option>
                  <option value={2} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold py-1">⭐⭐ 2 Stars - Needs Improvement</option>
                  <option value={1} className="bg-white dark:bg-[#111333] text-slate-900 dark:text-white font-semibold py-1">⭐ 1 Star - Poor</option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your feedback about the teaching quality, pace, and live classes..."
                className="w-full bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold border border-slate-300 dark:border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              >
                Submit Review
              </button>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
