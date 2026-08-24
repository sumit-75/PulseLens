'use client';

import * as React from 'react';
import {
  Activity,
  Terminal,
  BarChart3,
  BellRing,
  Server,
  ExternalLink,
  LogOut,
  LogIn,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { LiveDot } from '@/components/ui/live-dot';

interface SidebarProps {
  activeTab: 'logs' | 'metrics' | 'alerts' | 'services';
  setActiveTab: (tab: 'logs' | 'metrics' | 'alerts' | 'services') => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { data: session, status } = useSession();

  const navItems = [
    {
      id: 'logs' as const,
      label: 'Log Viewer',
      icon: Terminal,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'metrics' as const,
      label: 'Metrics & Graphs',
      icon: BarChart3,
    },
    {
      id: 'alerts' as const,
      label: 'Alert Rules',
      icon: BellRing,
    },
    {
      id: 'services' as const,
      label: 'Services Overview',
      icon: Server,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#e2e7e3]/10 bg-[#12110b]/95 backdrop-blur-xl flex flex-col justify-between p-4 shrink-0 select-none">
      <div>
        {/* Brand Header linking to Landing Page */}
        <Tooltip content="Return to Landing Page" side="right">
          <Link
            href="/"
            className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#e2e7e3]/10 pb-5 hover:opacity-90 transition-opacity group block"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#e2e7e3] to-[#889089] flex items-center justify-center shadow-lg shadow-[#e2e7e3]/10 text-[#0e0d08] group-hover:scale-105 transition-transform shrink-0">
              <Activity className="h-5 w-5 animate-pulse font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#e2e7e3]">
                  PulseLens
                </span>
                <span className="text-[11px] uppercase font-bold tracking-wider bg-[#e2e7e3]/10 text-[#e2e7e3] border border-[#e2e7e3]/20 px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-[#a6aea7] font-medium tracking-wide">Real-Time Telemetry</p>
            </div>
          </Link>
        </Tooltip>

        {/* Navigation items */}
        <nav className="space-y-2">
          {/* Quick Exit to Landing Page */}
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#a6aea7] hover:text-[#e2e7e3] hover:bg-[#1c1a12] transition-colors border border-[#e2e7e3]/10 mb-3 group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5 text-[#889089] group-hover:text-[#e2e7e3] transition-colors" />
              <span>Back to Home</span>
            </div>
            <span className="text-[10px] font-mono text-[#889089] uppercase">Landing</span>
          </Link>

          <div className="text-xs font-bold uppercase tracking-wider text-[#889089] px-3 mb-2">
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
                  'w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-all group',
                  isActive
                    ? 'bg-[#e2e7e3] text-[#0e0d08] shadow-md'
                    : 'text-[#a6aea7] hover:text-[#e2e7e3] hover:bg-[#1c1a12]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-[#0e0d08]' : 'text-[#889089] group-hover:text-[#e2e7e3]'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1.5',
                      isActive ? 'bg-[#0e0d08]/15 border-[#0e0d08]/25 text-[#0e0d08]' : item.badgeColor
                    )}
                  >
                    <LiveDot size="sm" />
                    <span>{item.badge}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: User Card + Status */}
      <div className="space-y-3 pt-4 border-t border-[#e2e7e3]/10">
        {/* User Profile Card */}
        {status === 'authenticated' && session?.user ? (
          <div className="p-3 rounded-xl bg-[#181711] border border-[#e2e7e3]/12 flex items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={34}
                  height={34}
                  className="h-8.5 w-8.5 rounded-full border border-[#e2e7e3]/30 object-cover shrink-0"
                />
              ) : (
                <div className="h-8.5 w-8.5 rounded-full bg-[#e2e7e3]/15 border border-[#e2e7e3]/30 flex items-center justify-center text-[#e2e7e3] text-sm font-bold shrink-0">
                  {session.user.name?.charAt(0) || <User className="h-4 w-4" />}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-bold text-[#e2e7e3] truncate">
                  {session.user.name || 'Engineer'}
                </p>
                <p className="text-[11px] text-[#889089] font-mono truncate">
                  {session.user.email || 'engineer@pulselens.io'}
                </p>
              </div>
            </div>

            <Tooltip content="Sign Out" side="left">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-2 text-[#889089] hover:text-rose-400 hover:bg-[#232018] rounded-lg transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#e2e7e3] text-[#0e0d08] hover:bg-[#f0f4f1] text-xs sm:text-sm font-bold transition-all shadow-md"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In to Dashboard</span>
          </Link>
        )}


        {/* GitHub link */}
        <a
          href="https://github.com/sumit-75/PulseLens"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between text-xs sm:text-sm text-[#a6aea7] hover:text-[#e2e7e3] hover:bg-[#1c1a12] px-3.5 py-2.5 rounded-lg border border-[#e2e7e3]/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="font-mono text-xs">PulseLens</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-[#889089]" />
        </a>
      </div>
    </aside>
  );
}
