'use client';

import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { MessageSquare, Building2 } from 'lucide-react';

export default function CompanyMessagesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Corporate Communications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Direct channels with hired Guild leaders and shortlisted student applicants.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-border">
          <MessageSquare className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-base font-bold text-foreground">CyberForge Guild Project Channel Active</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Communicate directly through the project workspace or course private chats.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
