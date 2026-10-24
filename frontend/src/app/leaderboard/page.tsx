'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LeaderboardView from '@/components/leaderboard/LeaderboardView';
import { useUniStore } from '@/lib/data/useUniStore';

export default function UniversalLeaderboardPage() {
  const { currentUser } = useUniStore();
  const isTeacher = currentUser.capabilities && currentUser.capabilities.includes('TEACHER');

  return (
    <DashboardLayout>
      <LeaderboardView initialCategory={isTeacher ? 'teachers' : 'students'} />
    </DashboardLayout>
  );
}
