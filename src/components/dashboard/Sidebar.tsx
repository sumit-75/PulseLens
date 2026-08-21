'use client';

import * as React from 'react';
import {
  Activity,
  Terminal,
  BarChart3,
  BellRing,
  Server,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: 'logs' | 'metrics' | 'alerts' | 'services';
  setActiveTab: (tab: 'logs' | 'metrics' | 'alerts' | 'services') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    {
      id: 'logs' as const,
      label: 'Log Viewer',
      icon: Terminal,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'metrics' as const,
      label: 'Metrics & Graphs',
      icon: BarChart3,
      badge: 'Phase 6',
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
    },
    {
      id: 'alerts' as const,
      label: 'Alert Rules',
      icon: BellRing,
      badge: 'Phase 7',
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700',
    },
    {
      id: 'services' as const,
      label: 'Services Overview',
      icon: Server,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0c0e17]/80 backdrop-blur-xl flex flex-col justify-between p-4 shrink-0 select-none">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-slate-800/60 pb-5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">
                PulseLens
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-1.5 py-0.2 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Mini Observability</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Telemetry Platform
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[9px] font-medium border px-1.5 py-0.5 rounded-full',
                      item.badgeColor
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Status footer */}
      <div className="space-y-3 pt-4 border-t border-slate-800/60">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-emerald-400 animate-ping" />
              Ingestion API
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase">
              Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            POST /api/logs
          </p>
        </div>

        <a
          href="https://github.com/sumit-75/PulseLens"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="font-mono text-[11px]">PulseLens</span>
          </div>
          <ExternalLink className="h-3 w-3 text-slate-500" />
        </a>
      </div>
    </aside>
  );
}
