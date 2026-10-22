'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GuildHubView from '@/components/guild/GuildHubView';

export default function TeacherGuildPage() {
  return (
    <DashboardLayout>
      <GuildHubView portalType="teacher" />
    </DashboardLayout>
  );
}
