'use client';

import * as React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogsViewer } from '@/components/dashboard/LogsViewer';
import { ServicesOverview } from '@/components/dashboard/ServicesOverview';
import { MetricsViewer } from '@/components/dashboard/MetricsViewer';
import { AlertRulesViewer } from '@/components/dashboard/AlertRulesViewer';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'logs' | 'metrics' | 'alerts' | 'services'>('logs');

  return (
    <div className="flex h-screen w-full bg-[#0e0d08] text-[#e2e7e3] overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(226,231,227,0.06),rgba(0,0,0,0))]">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'logs' && <LogsViewer />}

          {activeTab === 'services' && <ServicesOverview />}

          {activeTab === 'metrics' && <MetricsViewer />}

          {activeTab === 'alerts' && <AlertRulesViewer />}
        </div>
      </main>
    </div>
  );
}
