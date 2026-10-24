'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUniStore } from '@/lib/data/useUniStore';
import AppLogo from '@/components/ui/AppLogo';
import RankBadge from '@/components/common/RankBadge';
import TrustScoreBadge from '@/components/common/TrustScoreBadge';
import ThemeToggle from '@/components/theme/ThemeToggle';
import {
  Bell,
  Coins,
  Sparkles,
  Menu,
  GraduationCap,
  Shield,
  Building2,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  LogOut,
  User as UserIcon,
  Wallet,
  CheckCircle2,
  Lock,
  CheckCheck,
  Trophy
} from 'lucide-react';

export default function AppNavbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const currentPath = pathname || '';
  const router = useRouter();
  const { currentUser, studentProfile, companyProfile, notifications, markNotificationAsRead, markAllNotificationsAsRead, switchUser } = useUniStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isUniversalDemo = currentUser.id === 'user-universal-demo';

  const handleLogout = () => {
    setShowUserMenu(false);
    // Switch to default beginner student or reset session
    switchUser('user-rohan-e');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#07080d]/95 backdrop-blur-xl border-b border-slate-200 dark:border-border/60 px-4 sm:px-6 py-2.5 transition-colors shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: BACK button, Mobile hamburger & Logo */}
        <div className="flex items-center gap-2.5">
          {/* Functional BACK Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-purple-600/30 cursor-pointer flex-shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BACK</span>
          </button>

          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2 group ml-1">
            <AppLogo size={28} />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-foreground group-hover:text-cyan-400 transition-colors">
              Uni<span className="text-cyan-400 font-black">Parahits</span>
            </span>
          </Link>

          {/* Role-Specific Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200 dark:border-border/60 text-xs">
            {currentUser.role === 'STUDENT' && (
              <>
                <Link
                  href="/student/dashboard"
                  className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                    currentPath.startsWith('/student')
                      ? 'bg-indigo-50 dark:bg-cyan-500/15 text-indigo-700 dark:text-cyan-300 font-bold border border-indigo-200 dark:border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                      : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                  }`}
                >
                  Student Hub
                </Link>

                {/* Teacher Link (Rank D+) */}
                {(studentProfile?.currentRank === 'D' ||
                  studentProfile?.currentRank === 'C' ||
                  studentProfile?.currentRank === 'B' ||
                  studentProfile?.currentRank === 'A') && (
                  <Link
                    href="/teacher/dashboard"
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                      currentPath.startsWith('/teacher')
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-500/40'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    Teaching
                  </Link>
                )}

                {/* Mentor Link (Rank C+) */}
                {(studentProfile?.currentRank === 'C' ||
                  studentProfile?.currentRank === 'B' ||
                  studentProfile?.currentRank === 'A') && (
                  <Link
                    href="/teacher/mentorship"
                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                      currentPath.startsWith('/teacher/mentorship') || currentPath.startsWith('/mentor')
                        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-500/40'
                        : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    Mentorship
                  </Link>
                )}

                {/* Leaderboard Link (Hall of Merit) */}
                <Link
                  href={currentPath.startsWith('/teacher') ? '/teacher/leaderboard' : '/student/leaderboard'}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                    currentPath.includes('/leaderboard')
                      ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-500/40 shadow-sm'
                      : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  Hall of Merit
                </Link>
              </>
            )}

            {currentUser.role === 'COMPANY' && (
              <Link
                href="/company/dashboard"
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium ${
                  currentPath.startsWith('/company')
                    ? 'bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-500/40'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                Corporate Portal
              </Link>
            )}

            {currentUser.role === 'ADMIN' && (
              <Link
                href="/admin/dashboard"
                className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                  currentPath.startsWith('/admin')
                    ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-500/40'
                    : 'text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground'
                }`}
              >
                Admin Command Center
              </Link>
            )}

            {/* Universal Demo Account Quick Switcher Pill for SIH Judges */}
            {isUniversalDemo && (
              <div className="flex items-center gap-1 pl-2 border-l border-cyan-500/30">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40">
                  ⚡ SIH JURY
                </span>
                <Link
                  href="/company/dashboard"
                  className="px-2 py-0.5 rounded text-[11px] text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 font-medium"
                >
                  Company
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="px-2 py-0.5 rounded text-[11px] text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Balances, Theme Toggle, Notifications, User menu */}
        <div className="flex items-center gap-2.5">
          {/* Economy Balances (If Student) */}
          {studentProfile && (
            <div className="flex items-center gap-2">
              {/* MANA pill (Electric Cyan) */}
              <Link
                href="/wallet/mana"
                title="MANA - Internal Contribution & Learning XP (Cannot be bought)"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:border-cyan-400 text-xs font-mono transition-all hover:scale-105 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span className="font-bold">{studentProfile.manaBalance.toLocaleString()}</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400/80 font-sans hidden sm:inline">MANA</span>
              </Link>

              {/* ZENI pill (Amber Gold) */}
              <Link
                href={currentPath.startsWith('/teacher') ? '/teacher/wallet' : '/student/wallet'}
                title={currentPath.startsWith('/teacher') ? 'Teacher Wallet - Revenue, Royalties & Capacity Sinks' : 'ZENI - Project & Course Economy (1 ZENI = ₹1)'}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 hover:border-amber-400 text-xs font-mono transition-all hover:scale-105 shadow-sm"
              >
                <Coins className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="font-bold">₹{studentProfile.zeniBalance.toLocaleString()}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-sans hidden sm:inline">ZENI</span>
              </Link>
            </div>
          )}

          {/* Theme Toggle Button (Light/Dark Mode) */}
          <ThemeToggle />

          {/* Notifications dropdown trigger (Edit 7) */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-border/40 transition-colors cursor-pointer"
              aria-label={`Notifications (${unreadCount} unread)`}
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] text-[10px] font-mono font-bold rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-border/80 p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-border/60 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-foreground">Notifications</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto" />
                      <p className="text-xs text-slate-500 dark:text-muted-foreground font-medium">All caught up! No notifications.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link) {
                            setShowNotifications(false);
                            router.push(n.link);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200 dark:border-border/40 opacity-75 hover:opacity-100 hover:border-slate-300 dark:hover:border-border'
                            : 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/40 hover:bg-cyan-100/80 dark:hover:bg-cyan-500/20 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-foreground mb-1">
                          <div className="flex items-center gap-1.5">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_6px_rgba(0,240,255,0.8)]" />}
                            <span className="font-bold">{n.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-muted-foreground font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-muted-foreground leading-relaxed pl-3.5">{n.message}</p>
                        {n.link && (
                          <div className="mt-2 pl-3.5 flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                            <span>Open details</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown (Edit 5) */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-border/60 hover:border-cyan-500/40 bg-slate-50 dark:bg-white/5 transition-all text-left cursor-pointer"
              aria-label="User Account Menu & Student Profile"
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-foreground leading-tight">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-muted-foreground leading-tight font-mono">
                  {currentPath.startsWith('/teacher')
                    ? `Teacher • Rank ${studentProfile?.currentRank || 'D'}`
                    : currentPath.startsWith('/company')
                    ? 'Company'
                    : currentPath.startsWith('/admin')
                    ? 'Admin'
                    : studentProfile
                    ? `Rank ${studentProfile.currentRank}`
                    : currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-muted-foreground hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-border/80 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-200 dark:border-border/60 pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-foreground">{currentUser.name}</span>
                    {studentProfile && <RankBadge rank={studentProfile.currentRank} size="sm" />}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-muted-foreground truncate block">{currentUser.email}</span>
                  {studentProfile && (
                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-transparent">
                      <span className="text-slate-500 dark:text-muted-foreground">Trust Score:</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{studentProfile.trustScore.toFixed(1)} / 5.0</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  {currentPath.startsWith('/teacher') ? (
                    <>
                      <Link
                        href="/teacher/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-500" />
                        <span>Teacher Dashboard</span>
                      </Link>
                      <Link
                        href="/teacher/wallet"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-amber-500" />
                        <span>Teacher Wallet & Revenue</span>
                      </Link>
                      <Link
                        href="/teacher/courses"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                        <span>Manage Courses</span>
                      </Link>
                      <Link
                        href="/teacher/guild"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Guild Hub</span>
                      </Link>
                      <Link
                        href="/teacher/mentorship"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        <span>Mentorship & Reviews</span>
                      </Link>
                      <div className="pt-1 border-t border-slate-200 dark:border-white/10 mt-1">
                        <Link
                          href="/student/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-[11px] font-mono"
                        >
                          <span>Switch to Student View</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </>
                  ) : currentUser.role === 'STUDENT' ? (
                    <>
                      {/* Prominent Student Profile Entry (Edit 5) */}
                      <Link
                        href="/student/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/30 transition-all group"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <span className="font-bold text-slate-900 dark:text-foreground">Student Profile</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                          OPEN
                        </span>
                      </Link>
                      <Link
                        href="/student/wallet"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Dual Token Vault</span>
                      </Link>
                      <Link
                        href="/student/rank"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        <span>Rank Progression Matrix</span>
                      </Link>
                    </>
                  ) : currentUser.role === 'COMPANY' ? (
                    <>
                      <Link
                        href="/company/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>Company Portal</span>
                      </Link>
                      <Link
                        href="/company/escrow"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Lock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span>Escrow Vault</span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>Admin Command Center</span>
                    </Link>
                  )}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-border/60">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-xs font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
