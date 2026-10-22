'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChatWindow from '@/components/chat/ChatWindow';
import { useUniStore } from '@/lib/data/useUniStore';
import {
  MessageSquare,
  GraduationCap,
  ArrowLeft,
  LayoutDashboard,
  Home,
  CheckSquare,
  Briefcase,
  Shield,
  Wallet,
} from 'lucide-react';

export default function StudentMessagesPage() {
  const router = useRouter();
  const { courses } = useUniStore();

  const activeCourse = courses[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
              Direct Peer & Instructor Comms
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Course Classroom Messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time chat with instructor and enrolled classmates for doubt clearing and assignment guidance.
          </p>
        </div>

        {activeCourse ? (
          <ChatWindow course={activeCourse} />
        ) : (
          <p className="text-xs text-muted-foreground text-center py-12">No active course chats found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
