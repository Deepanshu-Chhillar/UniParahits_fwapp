'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RankProgressionEngine from '@/components/common/RankProgressionEngine';

export default function StudentRankPage() {
  return (
    <DashboardLayout>
      <div className="-mt-8">
        <RankProgressionEngine id="student-rank-progression" showTitle={true} />
      </div>
    </DashboardLayout>
  );
}
