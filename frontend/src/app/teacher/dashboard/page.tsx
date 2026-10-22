'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  GraduationCap,
  Users,
  Coins,
  Sparkles,
  Star,
  Video,
  PlusCircle,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Flame,
  Check,
  Zap,
  Send,
  BookOpen,
  Shield,
  Wallet
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';

export default function TeacherDashboardPage() {
  const { currentUser, studentProfile, courses, upgradeCourseCapacity } = useUniStore();

  // State for capacity sink test
  const [courseCapacity, setCourseCapacity] = useState(10);
  const [enrolledCount, setEnrolledCount] = useState(10);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Aarav Sharma', text: 'How do we connect the 85/15 split in the Spring Boot backend?', time: '10:42 AM', isTeacher: false },
    { id: 2, user: 'Priya Singh (You)', text: 'The economyService.calculateEscrowSplit handles the 85% guild and 15% platform formula automatically!', time: '10:44 AM', isTeacher: true },
    { id: 3, user: 'Rahul Verma', text: 'Got it, testing with 60,000 ZENI payload now.', time: '10:45 AM', isTeacher: false },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExpandCapacity = () => {
    setCourseCapacity((prev) => prev + 10);
    showToast('Capacity Expanded! Burned 500 ZENI sink. New capacity: ' + (courseCapacity + 10) + ' seats.');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: `${currentUser.name} (You)`,
        text: newMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTeacher: true,
      },
    ]);
    setNewMsg('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-amber-500 text-black font-mono text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TMS CLASSROOM & COMPUTE SINK HEADER (Stitch Screen 2)    */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-xl shadow-amber-500/20"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono text-xs font-bold">
                    TMS Verified Instructor
                  </span>
                  <RankBadge rank={studentProfile?.currentRank || 'C'} size="sm" showTitle />
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body">
                  Decentralized TMS Classroom & Compute Sink Orchestrator
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
                  Min Rank D+ Gate Verified // Eligible for Course Monetization
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Capacity Status</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {enrolledCount} / {courseCapacity}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Course Price</span>
                <span className="text-base font-bold text-amber-500">2,000 ZENI</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Student Rating</span>
                <span className="text-base font-bold text-emerald-500 flex items-center gap-1">
                  <span>4.7</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-500" />
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase">Total Revenue</span>
                <span className="text-base font-bold text-cyan-500">20,000 ZENI</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* QUICK HUB NAVIGATION CARDS                               */}
        {/* ======================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/teacher/courses"
            className="p-5 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Teaching Batches
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Manage seats, curriculum &amp; Google Meet
              </p>
            </div>
          </Link>

          <Link
            href="/teacher/wallet"
            className="p-5 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Teacher Financial Vault
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                ₹{(studentProfile?.zeniBalance || 0).toLocaleString()} ZENI • 85% Royalties
              </p>
            </div>
          </Link>

          <Link
            href="/teacher/guild"
            className="p-5 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                Collegiate Guild Hub
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-sig agency &amp; quorum governance
              </p>
            </div>
          </Link>

          <Link
            href="/teacher/mentorship"
            className="p-5 rounded-2xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 hover:border-blue-500/50 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                Mentorship &amp; Reviews
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Peer reviews &amp; +50 MANA XP rewards
              </p>
            </div>
          </Link>
        </section>

        {/* ======================================================== */}
        {/* ACTIVE COURSE & 500 ZENI EXPANSION SINK (Stitch S2)      */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Course Management Card (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-500 font-bold">
                  Active Monitored Masterclass
                </span>
                <h2 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  Full Stack Web Development (React & Spring Boot)
                </h2>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                enrolledCount >= courseCapacity
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
              }`}>
                {enrolledCount >= courseCapacity ? 'BATCH FULL (10/10)' : `OPEN SEATS (${enrolledCount}/${courseCapacity})`}
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-500 dark:text-slate-400">Classroom Capacity</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {enrolledCount} of {courseCapacity} Seats Taken ({Math.round((enrolledCount / courseCapacity) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (enrolledCount / courseCapacity) * 100)}%` }}
                />
              </div>
            </div>

            {/* Capacity Expansion Sink Box (Stitch S2 Action) */}
            <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white">
                    Deflationary Capacity Expansion Sink
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-body">
                    Admit 10 more students by burning 500 ZENI. Prevents server bloat and circulates token value.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleExpandCapacity}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white font-mono text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Flame className="w-4 h-4" />
                <span>Burn 500 ZENI (+10 Seats)</span>
              </button>
            </div>

            {/* Google Meet Live Session Bar */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white">
                    Scheduled Daily Lecture (07:00 PM IST)
                  </h4>
                  <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                    meet.google.com/uni-para-live
                  </span>
                </div>
              </div>
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Google Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Enrolled Students Roster */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Enrolled Student Roster ({enrolledCount} Active)
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                {[
                  { name: 'Aarav Sharma', rank: 'E-Rank', progress: '78%', fee: '2,000 ZENI Paid' },
                  { name: 'Meera Patel', rank: 'E-Rank', progress: '92%', fee: '2,000 ZENI Paid' },
                  { name: 'Kabir Das', rank: 'D-Rank', progress: '65%', fee: '2,000 ZENI Paid' },
                  { name: 'Neha Gupta', rank: 'E-Rank', progress: '85%', fee: '2,000 ZENI Paid' },
                ].map((s) => (
                  <div key={s.name} className="p-3 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{s.name}</span>
                      <span className="text-slate-400 ml-2">({s.rank})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 font-bold">{s.progress} Done</span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">{s.fee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Doubt Chat (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#111333] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col h-[580px]">
            <div className="pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-500" />
                <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                  Classroom Doubt Channel
                </h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 font-sans text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    msg.isTeacher
                      ? 'ml-auto bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                    <span className="font-bold">{msg.user}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Send Form */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-white/10 flex gap-2">
              <input
                type="text"
                placeholder="Answer student doubts as instructor..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
