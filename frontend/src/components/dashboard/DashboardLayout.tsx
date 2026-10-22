'use client';

import React, { useState } from 'react';
import AppNavbar from './AppNavbar';
import AppSidebar from './AppSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Top App Navbar */}
      <AppNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar and Main Content Area */}
      <div className="flex-1 flex">
        <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Pane */}
        <main className="flex-1 lg:pl-64 min-w-0 flex flex-col relative overflow-x-hidden">
          {/* Subtle Cybernetic Background Glows */}
          <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent/5 blur-[120px] pointer-events-none -z-10" />

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
