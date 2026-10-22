'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CourseCard from '@/components/courses/CourseCard';
import ChatWindow from '@/components/chat/ChatWindow';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  GraduationCap,
  Video,
  Users,
  Sparkles,
  CheckCircle,
  PlusCircle,
  BookOpen,
  ArrowRight,
  Search,
  X,
  MessageSquare,
  Compass,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Course } from '@/lib/types';

export default function StudentCoursesPage() {
  const router = useRouter();
  const { courses, currentUser, isStudentEnrolled } = useUniStore();

  // EDIT 1.C: Make "My Courses" the default dashboard view
  const [tab, setTab] = useState<'MY_COURSES' | 'DISCOVERY' | 'CHAT'>('MY_COURSES');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatCourseId, setSelectedChatCourseId] = useState<string>('');

  // Enrolled courses for the authenticated student
  const enrolledCourses = useMemo(() => {
    return courses.filter((c) => isStudentEnrolled(c.id, currentUser.id));
  }, [courses, currentUser.id, isStudentEnrolled]);

  // Active chat course selection
  const activeChatCourse = useMemo(() => {
    if (selectedChatCourseId) {
      return courses.find((c) => c.id === selectedChatCourseId) || enrolledCourses[0] || courses[0];
    }
    return enrolledCourses[0] || courses[0];
  }, [courses, selectedChatCourseId, enrolledCourses]);

  // EDIT 1.B: Partial and case-insensitive matching across title, skills, description, and teacher
  const filterCourse = (c: Course, query: string) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.teacherName.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  };

  const filteredEnrolledCourses = useMemo(() => {
    return enrolledCourses.filter((c) => filterCourse(c, searchQuery));
  }, [enrolledCourses, searchQuery]);

  const filteredDiscoveryCourses = useMemo(() => {
    return courses.filter((c) => filterCourse(c, searchQuery));
  }, [courses, searchQuery]);

  const handleOpenChat = (courseId: string) => {
    setSelectedChatCourseId(courseId);
    setTab('CHAT');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header & Main Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-bold">
                Peer Learning & Teaching Ecosystem
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold">
                GOOGLE MEET LIVE SESSIONS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Courses Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl leading-relaxed">
              Master hands-on software development, system design, and AI from verified Rank D+ student teachers. 85% tuition directly supports student educators.
            </p>
          </div>

          {/* Hub Tab Switcher (My Courses by default) */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-secondary/80 border border-slate-200 dark:border-border text-xs self-start lg:self-center shrink-0">
            <button
              onClick={() => setTab('MY_COURSES')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                tab === 'MY_COURSES'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>My Courses ({enrolledCourses.length})</span>
            </button>

            <button
              onClick={() => setTab('DISCOVERY')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                tab === 'DISCOVERY'
                  ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Courses ({courses.length})</span>
            </button>

            <button
              onClick={() => setTab('CHAT')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                tab === 'CHAT'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Course Chat</span>
            </button>
          </div>
        </div>

        {/* EDIT 1.B: Course Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search courses by title, instructor, or topic (e.g. "AI Course", "Web", "PostgreSQL")...'
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
            {searchQuery ? (
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                Found {tab === 'MY_COURSES' ? filteredEnrolledCourses.length : filteredDiscoveryCourses.length} results
              </span>
            ) : (
              <span>{tab === 'MY_COURSES' ? `${enrolledCourses.length} Enrolled` : `${courses.length} Available`}</span>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MY COURSES (Default View - Edit 1.C)               */}
        {/* ======================================================== */}
        {tab === 'MY_COURSES' && (
          <div className="space-y-6">
            {filteredEnrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrolledCourses.map((course) => (
                  <div key={course.id} className="flex flex-col">
                    <CourseCard course={course} />
                    {/* Quick Access Contextual Chat action for enrolled courses (Edit 6) */}
                    <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
                      <span className="text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Classroom Discussion</span>
                      </span>
                      <button
                        onClick={() => handleOpenChat(course.id)}
                        className="font-mono text-[11px] font-bold text-cyan-600 dark:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Chat</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              /* No search results state */
              <div className="py-16 text-center space-y-3 glass-card rounded-3xl border border-border">
                <Search className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold text-foreground">No enrolled courses match &ldquo;{searchQuery}&rdquo;</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your search terms or browse available courses in the marketplace.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-foreground font-semibold text-xs"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setTab('DISCOVERY');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Browse All Courses
                  </button>
                </div>
              </div>
            ) : (
              /* Empty My Courses state */
              <div className="py-16 text-center space-y-4 glass-card rounded-3xl border border-border p-8 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">No Enrolled Courses Yet</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 leading-relaxed">
                    You haven&apos;t enrolled in any cohorts yet. Explore our student-taught courses to attend live Google Meet sessions and access private doubt-solving chat.
                  </p>
                </div>
                <button
                  onClick={() => setTab('DISCOVERY')}
                  className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Browse Available Courses</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COURSE DISCOVERY / BROWSE (Edit 1.D)               */}
        {/* ======================================================== */}
        {tab === 'DISCOVERY' && (
          <div className="space-y-6">
            {/* Economic Sink Explanation Banner */}
            <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-foreground block">Circulating Student Economy & Batch Capacity</span>
                  <span className="text-muted-foreground text-[11px]">
                    Courses start with 10 seats. Once full, enrollment is locked until the teacher burns 500 ZENI to expand capacity (+10 seats).
                  </span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold whitespace-nowrap">
                85% Tuition to Teacher
              </span>
            </div>

            {filteredDiscoveryCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiscoveryCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 glass-card rounded-3xl border border-border">
                <Search className="w-10 h-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-bold text-foreground">No courses found matching &ldquo;{searchQuery}&rdquo;</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try searching for keywords like &ldquo;AI&rdquo;, &ldquo;React&rdquo;, or &ldquo;Spring Boot&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: INTEGRATED COURSE CHAT (Edit 6)                    */}
        {/* ======================================================== */}
        {tab === 'CHAT' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Classroom Discussion & Doubts</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Private real-time conversation between certified instructors and enrolled students.
                </p>
              </div>

              {/* Course Selector Tabs for Enrolled Courses */}
              {enrolledCourses.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-md">
                  {enrolledCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChatCourseId(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        activeChatCourse.id === c.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-white/5 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Window */}
            {activeChatCourse ? (
              <ChatWindow course={activeChatCourse} />
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl border border-border">
                <p className="text-xs text-muted-foreground">Please select an enrolled course to view its classroom chat.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
