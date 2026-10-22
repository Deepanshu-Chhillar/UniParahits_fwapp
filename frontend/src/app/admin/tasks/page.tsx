'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TaskCard from '@/components/tasks/TaskCard';
import { useUniStore } from '@/lib/data/useUniStore';
import { CheckSquare } from 'lucide-react';

export default function AdminTasksPage() {
  const { tasks } = useUniStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Verification Protocol
          </span>
          <h1 className="text-2xl font-bold text-foreground">Active Tasks & Practical Challenges</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
