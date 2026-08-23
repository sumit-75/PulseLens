'use client';

import * as React from 'react';
import {
  Search,
  RefreshCw,
  Filter,
  Play,
  Pause,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
import { LogDetailModal, type LogEntry } from './LogDetailModal';
import { StatsCards } from './StatsCards';
import { timeAgo, formatDate } from '@/lib/utils';

export function LogsViewer() {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [services, setServices] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState({
    totalLogs: 0,
    errorCount1h: 0,
    warnCount1h: 0,
    activeServicesCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [selectedLog, setSelectedLog] = React.useState<LogEntry | null>(null);

  // Filters
  const [selectedService, setSelectedService] = React.useState<string>('all');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Quick Ingestion Modal / State
  const [isSendingTestLog, setIsSendingTestLog] = React.useState(false);
  const [testLogNotification, setTestLogNotification] = React.useState<string | null>(null);

  // Fetch Services & Stats
  const fetchServicesAndStats = React.useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const serviceNames = json.data.services.map((s: { service: string }) => s.service);
          setServices(serviceNames);
          if (json.data.stats) {
            setStats(json.data.stats);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching services/stats:', err);
    }
  }, []);

  // Fetch Logs
  const fetchLogs = React.useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) setIsRefreshing(true);
      try {
        const params = new URLSearchParams();
        if (selectedService !== 'all') params.append('service', selectedService);
        if (selectedLevel !== 'all') params.append('level', selectedLevel);
        params.append('limit', '100');

        const res = await fetch(`/api/logs?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setLogs(json.data);
          }
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setIsLoading(false);
        if (showRefreshIndicator) {
          setTimeout(() => setIsRefreshing(false), 400);
        }
      }
    },
    [selectedService, selectedLevel]
  );

  // Initial Load
  React.useEffect(() => {
    fetchServicesAndStats();
    fetchLogs();
  }, [fetchServicesAndStats, fetchLogs]);

  // Polling Effect
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs(false);
      fetchServicesAndStats();
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs, fetchServicesAndStats]);

  // Client-side Keyword Filtering
  const filteredLogs = React.useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase().trim();
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(query) ||
        log.service.toLowerCase().includes(query) ||
        log.id.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // Quick Test Log Sender
  const handleSendTestLog = async (level: 'info' | 'warn' | 'error') => {
    setIsSendingTestLog(true);
    try {
      const targetService = selectedService !== 'all' ? selectedService : 'payment-service';
      const sampleMessages = {
        info: `Processed webhook payload for order #ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
        warn: `Rate limit approaching (85% quota consumed) on ${targetService}`,
        error: `Database connection pool timeout while acquiring client socket`,
      };

      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: targetService,
          level,
          message: sampleMessages[level],
        }),
      });

      if (res.ok) {
        setTestLogNotification(`Sent test ${level.toUpperCase()} log to ${targetService}`);
        setTimeout(() => setTestLogNotification(null), 3000);
        fetchLogs(true);
        fetchServicesAndStats();
      }
    } catch (err) {
      console.error('Failed to emit test log:', err);
    } finally {
      setIsSendingTestLog(false);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-rose-500/10 text-rose-300 border border-rose-500/25 whitespace-nowrap">
            <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
            error
          </span>
        );
      case 'warn':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/25 whitespace-nowrap">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            warn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap">
            <Info className="h-3.5 w-3.5 text-sky-400" />
            info
          </span>
        );
    }
  };

  const serviceOptions = React.useMemo(() => {
    return [
      { value: 'all', label: 'All Services' },
      ...services.map((s) => ({ value: s, label: s })),
    ];
  }, [services]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e7e3] flex items-center gap-2.5">
            Real-time Log Stream
            {autoRefresh && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            )}
          </h1>
          <p className="text-sm sm:text-base text-[#a6aea7] mt-1 font-normal">
            Query, filter, and inspect structured telemetry logs across all registered microservices in real time.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Live Auto-Refresh Toggle */}
          <Tooltip content={autoRefresh ? 'Pause 3s stream' : 'Resume live 3s stream'}>
            <Button
              variant={autoRefresh ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-xs sm:text-sm font-medium gap-1.5 h-10 px-3.5"
            >
              {autoRefresh ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Live (3s)</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Paused</span>
                </>
              )}
            </Button>
          </Tooltip>

          {/* Manual Refresh */}
          <Tooltip content="Manually refresh log stream">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchLogs(true)}
              disabled={isRefreshing}
              className="text-xs sm:text-sm font-medium gap-1.5 h-10 px-3.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </Tooltip>

          {/* Emit Quick Test Log */}
          <div className="flex items-center rounded-lg border border-[#e2e7e3]/15 bg-[#181711] p-1">
            <Tooltip content="Dispatch test info log">
              <button
                onClick={() => handleSendTestLog('info')}
                disabled={isSendingTestLog}
                className="px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-500/10 rounded transition-colors"
              >
                + Info
              </button>
            </Tooltip>
            <Tooltip content="Dispatch test warning log">
              <button
                onClick={() => handleSendTestLog('warn')}
                disabled={isSendingTestLog}
                className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/10 rounded transition-colors"
              >
                + Warn
              </button>
            </Tooltip>
            <Tooltip content="Dispatch test error log">
              <button
                onClick={() => handleSendTestLog('error')}
                disabled={isSendingTestLog}
                className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
              >
                + Error
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Test Log Notification Toast */}
      {testLogNotification && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#181711] border border-[#e2e7e3]/20 text-[#e2e7e3] text-sm animate-in fade-in duration-150">
          <Sparkles className="h-4 w-4 text-[#e2e7e3] shrink-0" />
          <span>{testLogNotification}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Control Bar: Search & Filters (relative z-30 with overflow-visible to prevent clipping dropdowns) */}
      <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/95 shadow-xl relative z-30 overflow-visible">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#889089]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs by keyword, message, or ID (e.g. order, timeout, 500)..."
              className="pl-10 bg-[#0e0d08] border-[#e2e7e3]/15 text-sm h-10 text-[#e2e7e3]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#889089] hover:text-[#e2e7e3]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 relative z-40">
            {/* shadcn Select Component for Service Filter */}
            <div className="flex items-center gap-2 relative z-50">
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                options={serviceOptions}
                icon={<Filter className="h-3.5 w-3.5 text-[#889089]" />}
                className="min-w-[190px]"
                triggerClassName="h-10 text-xs sm:text-sm bg-[#0e0d08]"
              />
            </div>

            {/* Level Filter Pills */}
            <div className="flex items-center bg-[#0e0d08] border border-[#e2e7e3]/15 rounded-lg p-1">
              {(['all', 'info', 'warn', 'error'] as const).map((level) => {
                const isActive = selectedLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold capitalize transition-all ${
                      isActive
                        ? level === 'error'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : level === 'warn'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : level === 'info'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-[#e2e7e3] text-[#0e0d08] font-bold shadow-sm'
                        : 'text-[#889089] hover:text-[#e2e7e3]'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Logs Table / Stream View (relative z-10) */}
      <Card className="border-[#e2e7e3]/10 overflow-hidden bg-[#15140e]/70 shadow-2xl relative z-10">
        <div className="px-5 py-3.5 border-b border-[#e2e7e3]/10 flex items-center justify-between bg-[#12110b]/90">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#e2e7e3]">
              Matched Logs ({filteredLogs.length})
            </span>
            {selectedService !== 'all' && (
              <Badge variant="service" className="text-xs">
                {selectedService}
              </Badge>
            )}
          </div>
          <span className="text-xs sm:text-sm text-[#889089] font-normal">
            Click any row to open JSON Inspector Drawer
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e7e3]/10 bg-[#0e0d08]/60 text-xs font-semibold text-[#a6aea7] uppercase tracking-wider">
                <th className="py-3 px-5 w-32 whitespace-nowrap">Level</th>
                <th className="py-3 px-5 whitespace-nowrap min-w-[200px]">Service</th>
                <th className="py-3 px-5 min-w-[300px]">Message</th>
                <th className="py-3 px-5 whitespace-nowrap w-48">Timestamp</th>
                <th className="py-3 px-4 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e7e3]/8">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-5">
                      <div className="h-6 w-16 bg-[#232018] rounded-full" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-5 w-28 bg-[#232018] rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-5 w-4/5 bg-[#232018] rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-5 w-32 bg-[#232018] rounded" />
                    </td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={5} className="py-14 text-center text-[#889089]">
                    <div className="flex flex-col items-center justify-center space-y-2.5">
                      <Search className="h-10 w-10 text-[#889089]/50" />
                      <p className="text-base font-semibold text-[#e2e7e3]">
                        No logs match your filter criteria
                      </p>
                      <p className="text-sm text-[#a6aea7] max-w-md">
                        Try clearing your search query, selecting &quot;All Services&quot;, or clicking one of the &quot;+ Info / Warn / Error&quot; buttons above to dispatch test data.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Render Logs
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-[#201e16] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-5 font-mono whitespace-nowrap">
                      {getLevelBadge(log.level)}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="font-mono text-[#e2e7e3] font-semibold text-xs sm:text-[13px] bg-[#181711] px-2.5 py-1 rounded-md border border-[#e2e7e3]/12 whitespace-nowrap inline-flex items-center shadow-sm">
                        {log.service}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[13.5px] text-[#e2e7e3] truncate max-w-xl group-hover:text-white leading-relaxed font-normal">
                      {log.message}
                    </td>
                    <td className="py-3.5 px-5 text-[#a6aea7] whitespace-nowrap text-xs sm:text-[13px] font-mono">
                      <span title={formatDate(log.timestamp)}>
                        {timeAgo(log.timestamp)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <ChevronRight className="h-4 w-4 text-[#889089] group-hover:text-[#e2e7e3] inline transition-transform group-hover:translate-x-1" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Detail Inspector Modal */}
      <LogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
