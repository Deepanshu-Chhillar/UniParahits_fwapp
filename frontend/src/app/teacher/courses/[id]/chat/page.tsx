'use client';

import React, { use } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ChatWindow from '@/components/chat/ChatWindow';
import { useUniStore } from '@/lib/data/useUniStore';
import { ArrowLeft } from 'lucide-react';

export default function TeacherCourseChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses } = useUniStore();

  const course = courses.find((c) => c.id === resolvedParams.id) || courses[0];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href={`/teacher/courses/${course?.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Management</span>
        </Link>

        {course && <ChatWindow course={course} />}
      </div>
    </DashboardLayout>
  );
}
