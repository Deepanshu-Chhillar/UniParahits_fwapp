'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  X,
  ArrowLeft,
  Home,
  GraduationCap,
  Briefcase,
  Layers,
  Info,
  LayoutDashboard,
  CheckSquare,
  Shield,
  Wallet,
  Sparkles,
  MessageSquare,
  Trophy,
  User,
  Building2,
  Settings,
  ChevronRight
} from 'lucide-react';

interface WebappNavModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebappNavModal({ isOpen, onClose }: WebappNavModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStepBack = () => {
    onClose();
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.push('/');
      }
    }
  };

  const publicLinks = [
    { label: 'Home Landing Page', href: '/', icon: Home, badge: 'Main' },
    { label: 'Platform Features', href: '/features', icon: Layers, badge: 'Architecture' },
    { label: 'Classrooms & Courses', href: '/student/courses', icon: GraduationCap, badge: 'Live Meet' },
    { label: 'Corporate Bounties', href: '/student/bounties', icon: Briefcase, badge: 'Escrow' },
    { label: 'About Project', href: '/about', icon: Info, badge: 'SIH 2026' },
  ];

  const studentLinks = [
    { label: 'Student Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Peer Tasks & Proofs', href: '/student/tasks', icon: CheckSquare },
    { label: 'Bounties & Escrow', href: '/student/bounties', icon: Briefcase },
    { label: 'Courses & Batches', href: '/student/courses', icon: GraduationCap },
    { label: 'CyberForge Guild', href: '/student/guild', icon: Shield },
    { label: 'Wallet & Ledger', href: '/student/wallet', icon: Wallet },
    { label: 'MANA XP Balance', href: '/wallet/mana', icon: Sparkles },
    { label: 'Classroom Doubt Chat', href: '/student/messages', icon: MessageSquare },
    { label: 'Rank Progression', href: '/student/rank', icon: Trophy },
    { label: 'Profile Settings', href: '/student/profile', icon: User },
  ];

  const roleHubs = [
    { label: 'Teacher Portal (Rank D+)', href: '/teacher/dashboard', icon: GraduationCap, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { label: 'Mentor Hub (Rank C+)', href: '/mentor/dashboard', icon: Shield, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { label: 'Company Hub (NovaTech)', href: '/company/dashboard', icon: Building2, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { label: 'Platform Admin', href: '/admin/dashboard', icon: Settings, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl glass-card border border-primary/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/60 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>Webapp Navigation & Navbar</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Direct access to public website routes, simulator hubs, and role portals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStepBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-bold transition-all hover:scale-105 active:scale-95"
              title="Go one step back"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Step Back</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          {/* 1. Public Webapp Navbar */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <h4 className="text-xs font-mono font-bold tracking-wider text-secondary-foreground uppercase">
                Public Webapp Navbar
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {publicLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-secondary/40 hover:bg-secondary/80 border border-border/60 hover:border-primary/50 text-foreground transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-border/40 text-muted-foreground">
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 2. Student Simulator & Dashboard */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h4 className="text-xs font-mono font-bold tracking-wider text-secondary-foreground uppercase">
                Student Simulator Hubs
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {studentLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-primary/20 border border-border/40 hover:border-primary/40 text-foreground transition-all flex items-center justify-between group text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Multi-Role Portals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h4 className="text-xs font-mono font-bold tracking-wider text-secondary-foreground uppercase">
                Multi-Role Portals
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roleHubs.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between group ${item.color}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="pt-4 mt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleStepBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md shadow-purple-600/30 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go One Step Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground border border-border font-semibold transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-accent" />
              <span>Landing Page</span>
            </Link>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
