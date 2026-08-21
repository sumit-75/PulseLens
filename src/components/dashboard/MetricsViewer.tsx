'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Filter,
  Activity,
  Gauge,
  Zap,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CustomChartTooltip } from './CustomChartTooltip';

export interface MetricItem {
  id: string;
  service: string;
  name: string;
  value: number;
  timestamp: string;
}

export function MetricsViewer() {
  const [metrics, setMetrics] = React.useState<MetricItem[]>([]);
  const [services, setServices] = React.useState<string[]>([]);
  const [metricNames, setMetricNames] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  // Filters
  const [selectedService, setSelectedService] = React.useState<string>('all');
  const [selectedMetric, setSelectedMetric] = React.useState<string>('response_time_ms');

  // Quick Ingestion Modal state
  const [showQuickAdd, setShowQuickAdd] = React.useState(false);
  const [customMetricName, setCustomMetricName] = React.useState('response_time_ms');
  const [customMetricValue, setCustomMetricValue] = React.useState('120');
  const [customMetricService, setCustomMetricService] = React.useState('payment-service');
  const [isSubmittingMetric, setIsSubmittingMetric] = React.useState(false);
  const [notification, setNotification] = React.useState<string | null>(null);

  // Fetch all metrics
  const fetchMetrics = React.useCallback(
    async (showRefreshIndicator = false) => {
      if (showRefreshIndicator) setIsRefreshing(true);
      try {
        const params = new URLSearchParams();
        if (selectedService !== 'all') params.append('service', selectedService);
        params.append('order', 'asc'); // Chronological order for time series charts
        params.append('limit', '500');

        const res = await fetch(`/api/metrics?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const data: MetricItem[] = json.data;
            setMetrics(data);

            // Extract unique metric names and services
            const names = Array.from(new Set(data.map((m) => m.name)));
            setMetricNames(names);

            const svcs = Array.from(new Set(data.map((m) => m.service)));
            setServices(svcs);

            // If selected metric not in list and list has items, default to first
            if (names.length > 0 && !names.includes(selectedMetric) && selectedMetric === 'response_time_ms') {
              if (names.length > 0) setSelectedMetric(names[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setIsLoading(false);
        if (showRefreshIndicator) {
          setTimeout(() => setIsRefreshing(false), 400);
        }
      }
    },
    [selectedService, selectedMetric]
  );

  // Initial Load
  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Polling Effect
  React.useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchMetrics(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchMetrics]);

  // Filtered dataset for active metric
  const activeSeriesData = React.useMemo(() => {
    return metrics
      .filter((m) => m.name === selectedMetric)
      .map((m) => ({
        ...m,
        timeFormatted: new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date(m.timestamp)),
      }));
  }, [metrics, selectedMetric]);

  // Statistical calculations
  const stats = React.useMemo(() => {
    if (!activeSeriesData.length) {
      return { current: 0, avg: 0, min: 0, max: 0, p95: 0, count: 0 };
    }

    const values = activeSeriesData.map((d) => d.value);
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.min(Math.floor(sorted.length * 0.95), sorted.length - 1);
    const p95 = sorted[p95Index];
    const current = values[values.length - 1];

    return { current, avg, min, max, p95, count: values.length };
  }, [activeSeriesData]);

  // Handle Quick Add Metric
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customMetricValue);
    if (isNaN(val)) return;

    setIsSubmittingMetric(true);
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: customMetricService,
          name: customMetricName,
          value: val,
        }),
      });

      if (res.ok) {
        setNotification(`Recorded ${customMetricName} = ${val} for ${customMetricService}`);
        setTimeout(() => setNotification(null), 3000);
        setShowQuickAdd(false);
        fetchMetrics(true);
      }
    } catch (err) {
      console.error('Failed to submit metric:', err);
    } finally {
      setIsSubmittingMetric(false);
    }
  };

  const getMetricUnit = (name: string) => {
    if (name.includes('ms') || name.includes('time') || name.includes('latency')) return 'ms';
    if (name.includes('pct') || name.includes('usage') || name.includes('cpu')) return '%';
    if (name.includes('mb') || name.includes('memory')) return 'MB';
    if (name.includes('usd') || name.includes('amount')) return '$';
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="h-6 w-6 text-indigo-400" />
            Time-Series Metrics & Graphs
            {autoRefresh && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time service latencies, resource utilization, and throughput trends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="text-xs gap-1.5"
          >
            {autoRefresh ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Live (3s)</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Paused</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchMetrics(true)}
            disabled={isRefreshing}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="text-xs gap-1.5 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Metric</span>
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

      {/* Quick Add Metric Form Drawer */}
      {showQuickAdd && (
        <Card className="p-4 border-indigo-500/30 bg-indigo-950/20 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleQuickAdd} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Service:</span>
              <Input
                value={customMetricService}
                onChange={(e) => setCustomMetricService(e.target.value)}
                placeholder="e.g. payment-service"
                className="h-8 text-xs w-36 bg-slate-900/80 border-slate-700"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Metric:</span>
              <Input
                value={customMetricName}
                onChange={(e) => setCustomMetricName(e.target.value)}
                placeholder="e.g. response_time_ms"
                className="h-8 text-xs w-40 bg-slate-900/80 border-slate-700"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Value:</span>
              <Input
                type="number"
                step="any"
                value={customMetricValue}
                onChange={(e) => setCustomMetricValue(e.target.value)}
                placeholder="e.g. 145.2"
                className="h-8 text-xs w-28 bg-slate-900/80 border-slate-700 font-mono"
                required
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmittingMetric}
              className="h-8 text-xs gap-1.5"
            >
              <Zap className="h-3 w-3" />
              <span>Emit Telemetry</span>
            </Button>
          </form>
        </Card>
      )}

      {/* Filter & Metric Selector Bar */}
      <Card className="p-3.5 border-slate-800/80 bg-slate-900/50">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Service Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-400 font-medium">Service:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="all" className="bg-slate-900 text-white">
                  All Services
                </option>
                {services.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">
              Active Metric:
            </span>
            {metricNames.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No metrics recorded yet</span>
            ) : (
              metricNames.map((name) => {
                const isActive = selectedMetric === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedMetric(name)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40 font-semibold'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    {name}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </Card>

      {/* KPI Cards for the Active Metric */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Current
          </span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {stats.current.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Average
          </span>
          <div className="text-xl font-bold text-indigo-300 font-mono mt-1">
            {stats.avg.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Min Value
          </span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {stats.min.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Max Peak
          </span>
          <div className="text-xl font-bold text-rose-400 font-mono mt-1">
            {stats.max.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            P95 Percentile
          </span>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">
            {stats.p95.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-3.5 border-slate-800/80 bg-slate-900/40">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Data Points
          </span>
          <div className="text-xl font-bold text-slate-200 font-mono mt-1">
            {stats.count}
          </div>
        </Card>
      </div>

      {/* Main Interactive Time-Series Chart */}
      <Card className="border-slate-800/80 bg-[#0c0e18]/80 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-white font-mono">
                {selectedMetric}
              </h3>
              <Badge variant="default" className="text-[10px] font-mono">
                {selectedService === 'all' ? 'All Services' : selectedService}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live chronological telemetry timeline
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 inline-block" />
              Recorded Value
            </span>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400">Loading time series data...</span>
              </div>
            </div>
          ) : activeSeriesData.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
              <Activity className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">
                No telemetry data available for &quot;{selectedMetric}&quot;
              </p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Run &quot;npm run simulate&quot; in terminal or use the &quot;Record Metric&quot; button above to emit data.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeSeriesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="timeFormatted"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickFormatter={(val) => `${val}${getMetricUnit(selectedMetric)}`}
                />
                <Tooltip
                  content={
                    <CustomChartTooltip unit={getMetricUnit(selectedMetric)} />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricGradient)"
                  activeDot={{
                    r: 5,
                    fill: '#818cf8',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Multi-Metric Mini Sparklines Breakdown */}
      {metricNames.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Metrics Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {metricNames.map((name) => {
              if (name === selectedMetric) return null;
              const series = metrics.filter((m) => m.name === name);
              const latestVal = series.length ? series[series.length - 1].value : 0;
              const unit = getMetricUnit(name);

              return (
                <Card
                  key={name}
                  onClick={() => setSelectedMetric(name)}
                  className="p-4 border-slate-800/70 bg-slate-900/30 hover:border-indigo-500/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-slate-200 group-hover:text-indigo-300 transition-colors font-medium">
                      {name}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {latestVal.toFixed(1)} {unit}
                    </span>
                  </div>

                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={series.slice(-20)}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#818cf8"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                    <span>{series.length} data points</span>
                    <span className="text-indigo-400 group-hover:underline">
                      View full chart →
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
