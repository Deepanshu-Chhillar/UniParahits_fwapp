'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  GraduationCap,
  Shield,
  FolderGit2,
  Wallet,
  Trophy,
  User,
  MessageSquare,
  Bell,
  PlusCircle,
  Users,
  Search,
  Lock,
  DollarSign,
  FileSpreadsheet,
  Settings,
  Flame,
  ArrowRight
} from 'lucide-react';
import RankBadge from '@/components/common/RankBadge';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const { currentUser, studentProfile } = useUniStore();

  const isStudentArea = currentPath.startsWith('/student') || currentPath.startsWith('/wallet');
  const isTeacherArea = currentPath.startsWith('/teacher');
  const isMentorArea = currentPath.startsWith('/mentor');
  const isCompanyArea = currentPath.startsWith('/company');
  const isAdminArea = currentPath.startsWith('/admin');

  // Student Links (Section 9 & 41)
  const studentLinks = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Tasks & Proofs', href: '/student/tasks', icon: CheckSquare },
    { label: 'Work / Bounties', href: '/student/bounties', icon: Briefcase },
    { label: 'Courses Hub', href: '/student/courses', icon: GraduationCap },
    { label: 'Guild Hub', href: '/student/guild', icon: Shield },
    { label: 'Projects & Workspaces', href: '/student/projects', icon: FolderGit2 },
    { label: 'Wallet & Ledger', href: '/student/wallet', icon: Wallet },
    { label: 'MANA XP', href: '/wallet/mana', icon: Flame },
    { label: 'Rank Progression', href: '/student/rank', icon: Trophy },
    { label: 'Student Profile', href: '/student/profile', icon: User },
    { label: 'Course Chat / Messages', href: '/student/messages', icon: MessageSquare },
    { label: 'Notifications', href: '/student/notifications', icon: Bell },
  ];

  // Teacher Links (Rank D+)
  const teacherLinks = [
    { label: 'Teacher Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'Manage Courses', href: '/teacher/courses', icon: GraduationCap },
    { label: 'Create New Course', href: '/teacher/courses/new', icon: PlusCircle },
    { label: 'Teacher Wallet', href: '/teacher/wallet', icon: Wallet },
  ];

  // Mentor Links (Rank C+)
  const mentorLinks = [
    { label: 'Mentor Dashboard', href: '/mentor/dashboard', icon: Shield },
    { label: 'Mentored Students', href: '/mentor/students', icon: Users },
    { label: 'Review Submissions', href: '/mentor/reviews', icon: CheckSquare },
  ];

  // Company Links (Section 28)
  const companyLinks = [
    { label: 'Company Overview', href: '/company/dashboard', icon: LayoutDashboard },
    { label: 'Post New Bounty', href: '/company/bounties/new', icon: PlusCircle },
    { label: 'Manage Bounties', href: '/company/bounties', icon: Briefcase },
    { label: 'Applications', href: '/company/applications', icon: CheckSquare },
    { label: 'Student Discovery', href: '/company/students', icon: Search },
    { label: 'Guild Discovery', href: '/company/guilds', icon: Users },
    { label: 'Active Projects', href: '/company/projects', icon: FolderGit2 },
    { label: 'Escrow Vault', href: '/company/escrow', icon: Lock },
    { label: 'Payments & Invoices', href: '/company/payments', icon: DollarSign },
    { label: 'Messages', href: '/company/messages', icon: MessageSquare },
  ];

  // Admin Links (Section 38)
  const adminLinks = [
    { label: 'Admin Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Students & Ranks', href: '/admin/students', icon: Trophy },
    { label: 'Companies', href: '/admin/companies', icon: Briefcase },
    { label: 'Guilds', href: '/admin/guilds', icon: Shield },
    { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
    { label: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
    { label: 'Projects & Escrow', href: '/admin/projects', icon: Lock },
    { label: 'Transactions Ledger', href: '/admin/transactions', icon: FileSpreadsheet },
    { label: 'Economy Config', href: '/admin/economy', icon: Settings },
    { label: 'Audit Reports', href: '/admin/reports', icon: FileSpreadsheet },
  ];

  const currentLinks = isTeacherArea
    ? teacherLinks
    : isMentorArea
    ? mentorLinks
    : isCompanyArea
    ? companyLinks
    : isAdminArea
    ? adminLinks
    : studentLinks;

  const currentHubTitle = isTeacherArea
    ? 'Teacher Portal'
    : isMentorArea
    ? 'Mentorship Portal'
    : isCompanyArea
    ? 'Corporate Portal'
    : isAdminArea
    ? 'Admin Console'
    : 'Student Taskforce';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-[57px] bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#08081c] border-r border-slate-200 dark:border-border/60 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm dark:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Hub Header */}
        <div className="p-4 border-b border-slate-200 dark:border-border/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-muted-foreground block">
              Active Hub
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-foreground">{currentHubTitle}</span>
          </div>
          {studentProfile && !isCompanyArea && !isAdminArea && (
            <RankBadge rank={studentProfile.currentRank} size="sm" />
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-500/40 shadow-sm dark:shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-indigo-600 dark:text-cyan-400'
                      : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-foreground'
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Hub Jumpers: Only displayed for Universal Demo/Evaluator account */}
        {currentUser.id === 'user-universal-demo' ? (
          <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0c0d24] space-y-2 text-xs">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-bold">
                SIH EVALUATOR HUBS
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 font-mono font-bold">
                DEMO
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/student/dashboard"
                onClick={onClose}
                className={`p-2 rounded-lg text-center border text-[11px] transition-all ${
                  isStudentArea
                    ? 'border-indigo-300 dark:border-cyan-500/50 bg-indigo-50 dark:bg-cyan-500/15 text-indigo-800 dark:text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111333]/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Student Hub
              </Link>

              <Link
                href="/teacher/dashboard"
                onClick={onClose}
                className={`p-2 rounded-lg text-center border text-[11px] transition-all ${
                  isTeacherArea
                    ? 'border-emerald-300 dark:border-emerald-500/60 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111333]/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Teacher Hub
              </Link>

              <Link
                href="/mentor/dashboard"
                onClick={onClose}
                className={`p-2 rounded-lg text-center border text-[11px] transition-all ${
                  isMentorArea
                    ? 'border-blue-300 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111333]/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Mentor Hub
              </Link>

              <Link
                href="/company/dashboard"
                onClick={onClose}
                className={`p-2 rounded-lg text-center border text-[11px] transition-all ${
                  isCompanyArea
                    ? 'border-purple-300 dark:border-purple-500/60 bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111333]/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Company Hub
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className={`col-span-2 p-1.5 rounded-lg text-center border text-[11px] transition-all ${
                  isAdminArea
                    ? 'border-amber-300 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 bg-white dark:bg-[#111333]/80 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Admin Command Center
              </Link>
            </div>
          </div>
        ) : (
          /* Production Mode: Unlocked Student Capabilities */
          studentProfile && (
            <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0c0d24] space-y-2 text-xs">
              <span className="text-[10px] font-mono text-slate-500 dark:text-muted-foreground uppercase tracking-widest block px-1 font-semibold">
                Unlocked Capabilities
              </span>
              <div className="flex flex-col gap-1.5">
                {(studentProfile.currentRank === 'D' ||
                  studentProfile.currentRank === 'C' ||
                  studentProfile.currentRank === 'B' ||
                  studentProfile.currentRank === 'A') && (
                  <Link
                    href="/teacher/dashboard"
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-lg border text-[11px] transition-colors ${
                      isTeacherArea
                        ? 'border-emerald-300 dark:border-emerald-500/60 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold'
                        : 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#111333]/80 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <span>Teaching Portal</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                      D+
                    </span>
                  </Link>
                )}

                {(studentProfile.currentRank === 'C' ||
                  studentProfile.currentRank === 'B' ||
                  studentProfile.currentRank === 'A') && (
                  <Link
                    href="/mentor/dashboard"
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-lg border text-[11px] transition-colors ${
                      isMentorArea
                        ? 'border-blue-300 dark:border-blue-500/60 bg-blue-50 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-bold'
                        : 'border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 bg-white dark:bg-[#111333]/80 hover:bg-blue-50 dark:hover:bg-blue-500/10'
                    }`}
                  >
                    <span>Mentorship Hub</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono font-bold">
                      C+
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )
        )}
      </aside>
    </>
  );
}
