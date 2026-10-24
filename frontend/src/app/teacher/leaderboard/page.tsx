'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LeaderboardView from '@/components/leaderboard/LeaderboardView';

export default function TeacherLeaderboardPage() {
  return (
    <DashboardLayout>
      <LeaderboardView initialCategory="teachers" />
    </DashboardLayout>
  );
}
