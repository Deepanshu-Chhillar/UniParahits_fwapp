'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LeaderboardView from '@/components/leaderboard/LeaderboardView';

export default function StudentLeaderboardPage() {
  return (
    <DashboardLayout>
      <LeaderboardView initialCategory="students" />
    </DashboardLayout>
  );
}
