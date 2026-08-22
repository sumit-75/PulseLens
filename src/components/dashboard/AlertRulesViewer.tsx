'use client';

import * as React from 'react';
import {
  BellRing,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Clock,
  Radio,
  Zap,
  Terminal,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateRuleModal } from './CreateRuleModal';
import { timeAgo, formatDate } from '@/lib/utils';

export interface AlertRuleItem {
  id: string;
  service: string;
  metric: string | null;
  logLevel: string | null;
  condition: string;
  threshold: number;
  windowMinutes: number;
  enabled: boolean;
  createdAt: string;
  events?: Array<{ id: string; triggeredAt: string; details: string }>;
  _count?: { events: number };
}

export interface AlertEventItem {
  id: string;
  ruleId: string;
  triggeredAt: string;
  details: string;
  rule?: {
    service: string;
    condition: string;
    logLevel: string | null;
    metric: string | null;
    threshold: number;
    windowMinutes: number;
  };
}

export function AlertRulesViewer() {
  const [rules, setRules] = React.useState<AlertRuleItem[]>([]);
  const [events, setEvents] = React.useState<AlertEventItem[]>([]);
  const [services, setServices] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Fetch Rules & Incidents
  const fetchData = React.useCallback(async () => {
    try {
      const [rulesRes, eventsRes, servicesRes] = await Promise.all([
        fetch('/api/alerts/rules'),
        fetch('/api/alerts/events'),
        fetch('/api/services'),
      ]);

      if (rulesRes.ok) {
        const json = await rulesRes.json();
        if (json.success) setRules(json.data);
      }

      if (eventsRes.ok) {
        const json = await eventsRes.json();
        if (json.success) setEvents(json.data);
      }

      if (servicesRes.ok) {
        const json = await servicesRes.json();
        if (json.success && json.data?.services) {
          const names = json.data.services.map((s: { service: string }) => s.service);
          setServices(names.length > 0 ? names : ['payment-service', 'auth-service', 'order-service']);
        }
      }
    } catch (err) {
      console.error('Error fetching alert data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling every 5s for live incident stream
  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Toggle Rule Status (Enable/Disable)
  const handleToggleRule = async (ruleId: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/alerts/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, enabled: !currentEnabled }),
      });

      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === ruleId ? { ...r, enabled: !currentEnabled } : r))
        );
      }
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  // Delete Rule
  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this alert rule?')) return;

    try {
      const res = await fetch(`/api/alerts/rules?id=${ruleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRules((prev) => prev.filter((r) => r.id !== ruleId));
        setNotification('Alert rule deleted');
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  // Run On-Demand Check
  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/alerts/check', {
        method: 'POST',
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setNotification(
          `Evaluated ${json.evaluatedRulesCount} rule(s). Triggered: ${json.triggeredIncidentsCount}`
        );
        setTimeout(() => setNotification(null), 4000);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to evaluate rules:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const activeRulesCount = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BellRing className="h-6 w-6 text-indigo-400" />
            Alert Rules & Background Checker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated threshold conditions checked continuously every minute via node-cron.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            className="text-xs gap-1.5"
          >
            <Zap className={`h-3.5 w-3.5 text-amber-400 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>Check Rules Now</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Alert Rule</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-200 text-xs animate-in fade-in duration-150">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Alert KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-800/80 bg-gradient-to-br from-indigo-500/10 to-transparent">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Configured Rules</span>
            <BellRing className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{rules.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Threshold definitions</p>
        </Card>

        <Card className="p-4 border-slate-800/80 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Rules</span>
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {activeRulesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Evaluated every 60s by cron</p>
        </Card>

        <Card className="p-4 border-slate-800/80 bg-gradient-to-br from-rose-500/10 to-transparent">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Triggered Incidents</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {events.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Recorded violation events</p>
        </Card>

        <Card className="p-4 border-slate-800/80 bg-gradient-to-br from-slate-500/10 to-transparent">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Cron Interval</span>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1 min</div>
          <p className="text-[11px] text-slate-500 mt-1">node-cron (* * * * *)</p>
        </Card>
      </div>

      {/* Main Grid: Rules Table on Left / Incident Events Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-800/80 bg-slate-900/40 overflow-hidden">
            <div className="p-4 border-b border-slate-800/70 flex items-center justify-between bg-slate-950/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Configured Rules ({rules.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Auto-evaluates every minute
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/60 bg-slate-950/20 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4 w-32">Service</th>
                    <th className="py-2.5 px-4">Condition</th>
                    <th className="py-2.5 px-4 w-28">Threshold</th>
                    <th className="py-2.5 px-4 w-24">Status</th>
                    <th className="py-2.5 px-3 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-3 px-4">
                          <div className="h-5 w-20 bg-slate-800 rounded" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-5 w-48 bg-slate-800 rounded" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-5 w-16 bg-slate-800 rounded" />
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-5 w-12 bg-slate-800 rounded" />
                        </td>
                        <td className="py-3 px-3"></td>
                      </tr>
                    ))
                  ) : rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <BellRing className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-medium text-slate-300">No alert rules configured</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Click &quot;Create Alert Rule&quot; to set up error count or metric latency threshold monitoring.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <span className="text-indigo-300 font-medium text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {rule.service}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-200">
                          <div className="flex items-center gap-1.5">
                            {rule.logLevel ? (
                              <Terminal className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            ) : (
                              <BarChart3 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className="truncate max-w-xs">{rule.condition}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                          {rule.threshold} / {rule.windowMinutes}m
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleRule(rule.id, rule.enabled)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
                              rule.enabled
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {rule.enabled ? 'Enabled' : 'Paused'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                            title="Delete Rule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Incident Events Feed (1 Col) */}
        <div className="space-y-4">
          <Card className="border-slate-800/80 bg-slate-900/40 overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 border-b border-slate-800/70 flex items-center justify-between bg-slate-950/40">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Incident Timeline ({events.length})
              </span>
              <button
                onClick={fetchData}
                className="text-slate-400 hover:text-slate-200 text-xs"
                title="Refresh feed"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Scrollable Events Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="h-4 w-28 bg-slate-800 rounded mb-2" />
                    <div className="h-3 w-full bg-slate-800 rounded" />
                  </div>
                ))
              ) : events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                  <p className="text-sm font-medium text-slate-200">All services healthy</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    No threshold violations recorded in the event log.
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-indigo-300 font-semibold text-[11px]">
                        {event.rule?.service || 'service'}
                      </span>
                      <span
                        title={formatDate(event.triggeredAt)}
                        className="text-[10px] text-slate-400 font-mono"
                      >
                        {timeAgo(event.triggeredAt)}
                      </span>
                    </div>

                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                      {event.details}
                    </p>

                    {event.rule?.condition && (
                      <div className="mt-2 pt-1.5 border-t border-rose-500/10 text-[10px] text-slate-500 font-mono truncate">
                        Rule: {event.rule.condition}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal to Create Alert Rule */}
      <CreateRuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRuleCreated={fetchData}
        services={services}
      />
    </div>
  );
}
