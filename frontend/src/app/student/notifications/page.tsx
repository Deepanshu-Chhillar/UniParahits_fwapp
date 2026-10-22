'use client';

import React from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUniStore } from '@/lib/data/useUniStore';
import { Bell, CheckCircle, Info, Sparkles, Trophy, ArrowRight } from 'lucide-react';

export default function StudentNotificationsPage() {
  const { notifications, markNotificationAsRead } = useUniStore();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
              System Dispatcher
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Notifications & Alerts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time notifications for task approvals, escrow locks, payment distributions, and live classes.
          </p>
        </div>

        <div className="glass-card rounded-2xl border border-border p-6 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-12">No notifications found.</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 text-xs transition-colors cursor-pointer ${
                  notif.read ? 'bg-white/2 border-border/40 opacity-75' : 'bg-primary/10 border-primary/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    {notif.type === 'ACHIEVEMENT' ? (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    ) : notif.type === 'SUCCESS' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block text-sm">{notif.title}</span>
                    <p className="text-muted-foreground leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-muted-foreground font-mono block pt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {notif.link && (
                  <Link
                    href={notif.link}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-primary transition-colors flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
