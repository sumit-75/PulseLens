'use client';

import * as React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogsViewer } from '@/components/dashboard/LogsViewer';
import { ServicesOverview } from '@/components/dashboard/ServicesOverview';
import { BarChart3, BellRing, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { MetricsViewer } from '@/components/dashboard/MetricsViewer';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<'logs' | 'metrics' | 'alerts' | 'services'>('logs');

  return (
    <div className="flex h-screen w-full bg-[#090a0f] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.08),rgba(255,255,255,0))]">
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'logs' && <LogsViewer />}

          {activeTab === 'services' && <ServicesOverview />}

          {activeTab === 'metrics' && <MetricsViewer />}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <BellRing className="h-6 w-6 text-indigo-400" />
                  Alert Rules & Incident Events
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Threshold monitoring rules, automated node-cron background checks, and incident logs.
                </p>
              </div>

              <Card className="p-12 text-center border-slate-800/80 bg-slate-900/40">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 inline-block mb-4">
                  <BellRing className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Alert Rules & Background Checker — Scheduled for Phase 7
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Phase 7 will let you create dynamic threshold rules (e.g. error rate &gt; 10 in 5 mins) evaluated by automated background jobs.
                </p>
                <div className="mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('logs')}
                    className="gap-2 text-xs"
                  >
                    <span>Back to Log Viewer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
