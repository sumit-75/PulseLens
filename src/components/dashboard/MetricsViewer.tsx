'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
  Zap,
  Sparkles,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tooltip } from '@/components/ui/tooltip';
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

  const serviceOptions = React.useMemo(() => {
    return [
      { value: 'all', label: 'All Services' },
      ...services.map((s) => ({ value: s, label: s })),
    ];
  }, [services]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e7e3] flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-[#e2e7e3]" />
            Time-Series Metrics & Graphs
            {autoRefresh && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            )}
          </h1>
          <p className="text-sm sm:text-base text-[#a6aea7] mt-1 font-normal">
            Monitor real-time service latencies, resource utilization, and throughput trends with interactive area charts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Tooltip content={autoRefresh ? 'Pause 3s polling' : 'Resume live 3s polling'}>
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

          <Tooltip content="Manually fetch latest metrics">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchMetrics(true)}
              disabled={isRefreshing}
              className="text-xs sm:text-sm font-medium gap-1.5 h-10 px-3.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </Tooltip>

          <Tooltip content="Manually record a metric data point">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="text-xs sm:text-sm font-medium gap-1.5 h-10 px-3.5 border-[#e2e7e3]/20 text-[#e2e7e3] hover:bg-[#e2e7e3]/10"
            >
              <Plus className="h-4 w-4" />
              <span>Record Metric</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#181711] border border-[#e2e7e3]/20 text-[#e2e7e3] text-sm animate-in fade-in duration-150">
          <Sparkles className="h-4 w-4 text-[#e2e7e3] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Quick Add Metric Form Drawer */}
      {showQuickAdd && (
        <Card className="p-4 border-[#e2e7e3]/20 bg-[#181711]/90 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl">
          <form onSubmit={handleQuickAdd} className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[#a6aea7] font-medium">Service:</span>
              <Input
                value={customMetricService}
                onChange={(e) => setCustomMetricService(e.target.value)}
                placeholder="e.g. payment-service"
                className="h-10 text-xs sm:text-sm w-44 bg-[#0e0d08] border-[#e2e7e3]/15 text-[#e2e7e3]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[#a6aea7] font-medium">Metric:</span>
              <Input
                value={customMetricName}
                onChange={(e) => setCustomMetricName(e.target.value)}
                placeholder="e.g. response_time_ms"
                className="h-10 text-xs sm:text-sm w-48 bg-[#0e0d08] border-[#e2e7e3]/15 text-[#e2e7e3]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-[#a6aea7] font-medium">Value:</span>
              <Input
                type="number"
                step="any"
                value={customMetricValue}
                onChange={(e) => setCustomMetricValue(e.target.value)}
                placeholder="e.g. 145.2"
                className="h-10 text-xs sm:text-sm w-32 bg-[#0e0d08] border-[#e2e7e3]/15 text-[#e2e7e3] font-mono"
                required
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmittingMetric}
              className="h-10 text-xs sm:text-sm gap-1.5 px-4 font-semibold"
            >
              <Zap className="h-4 w-4" />
              <span>Emit Telemetry</span>
            </Button>
          </form>
        </Card>
      )}

      {/* Filter & Metric Selector Bar (relative z-30 with overflow-visible to prevent clipping dropdowns) */}
      <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/95 shadow-xl relative z-30 overflow-visible">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Service Selector via shadcn Select */}
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

          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-[#a6aea7] font-medium mr-1">
              Active Metric:
            </span>
            {metricNames.length === 0 ? (
              <span className="text-sm text-[#889089] italic">No metrics recorded yet</span>
            ) : (
              metricNames.map((name) => {
                const isActive = selectedMetric === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedMetric(name)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all ${
                      isActive
                        ? 'bg-[#e2e7e3] text-[#0e0d08] font-bold shadow-md'
                        : 'bg-[#0e0d08] text-[#889089] hover:text-[#e2e7e3] border border-[#e2e7e3]/10 hover:bg-[#181711]'
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            Current
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#e2e7e3] font-mono mt-1.5">
            {stats.current.toFixed(1)}{' '}
            <span className="text-xs sm:text-sm text-[#889089] font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            Average
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#e2e7e3] font-mono mt-1.5">
            {stats.avg.toFixed(1)}{' '}
            <span className="text-xs sm:text-sm text-[#889089] font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            Min Value
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1.5">
            {stats.min.toFixed(1)}{' '}
            <span className="text-xs sm:text-sm text-[#889089] font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            Max Peak
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono mt-1.5">
            {stats.max.toFixed(1)}{' '}
            <span className="text-xs sm:text-sm text-[#889089] font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            P95 Percentile
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono mt-1.5">
            {stats.p95.toFixed(1)}{' '}
            <span className="text-xs sm:text-sm text-[#889089] font-normal">
              {getMetricUnit(selectedMetric)}
            </span>
          </div>
        </Card>

        <Card className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/80 shadow-lg">
          <span className="text-xs uppercase font-semibold text-[#a6aea7] tracking-wider">
            Data Points
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#a6aea7] font-mono mt-1.5">
            {stats.count}
          </div>
        </Card>
      </div>

      {/* Main Interactive Time-Series Chart */}
      <Card className="border-[#e2e7e3]/10 bg-[#15140e]/90 p-6 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-semibold text-lg sm:text-xl text-[#e2e7e3] font-mono">
                {selectedMetric}
              </h3>
              <Badge variant="default" className="text-xs font-mono">
                {selectedService === 'all' ? 'All Services' : selectedService}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#a6aea7] mt-1 font-normal">
              Live chronological telemetry timeline
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#a6aea7] font-mono">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#e2e7e3] inline-block" />
              Recorded Value
            </span>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 text-[#e2e7e3] animate-spin" />
                <span className="text-sm text-[#a6aea7]">Loading time series data...</span>
              </div>
            </div>
          ) : activeSeriesData.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
              <Activity className="h-10 w-10 text-[#889089]/50 mb-2" />
              <p className="text-base font-semibold text-[#e2e7e3]">
                No telemetry data available for &quot;{selectedMetric}&quot;
              </p>
              <p className="text-sm text-[#a6aea7] max-w-md mt-1">
                Run &quot;npm run simulate&quot; in your terminal or use the &quot;Record Metric&quot; button above to emit data.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeSeriesData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e7e3" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#e2e7e3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(226, 231, 227, 0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="timeFormatted"
                  stroke="#889089"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(226, 231, 227, 0.12)' }}
                />
                <YAxis
                  stroke="#889089"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(226, 231, 227, 0.12)' }}
                  tickFormatter={(val) => `${val}${getMetricUnit(selectedMetric)}`}
                />
                <RechartsTooltip
                  content={
                    <CustomChartTooltip unit={getMetricUnit(selectedMetric)} />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#e2e7e3"
                  strokeWidth={2.4}
                  fillOpacity={1}
                  fill="url(#metricGradient)"
                  activeDot={{
                    r: 6,
                    fill: '#e2e7e3',
                    stroke: '#0e0d08',
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
        <div className="space-y-3.5">
          <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#a6aea7]">
            Available Metrics Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricNames.map((name) => {
              if (name === selectedMetric) return null;
              const series = metrics.filter((m) => m.name === name);
              const latestVal = series.length ? series[series.length - 1].value : 0;
              const unit = getMetricUnit(name);

              return (
                <Card
                  key={name}
                  onClick={() => setSelectedMetric(name)}
                  className="p-4 border-[#e2e7e3]/10 bg-[#15140e]/70 hover:border-[#e2e7e3]/30 cursor-pointer transition-all group shadow-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-[#e2e7e3] group-hover:text-white transition-colors font-semibold">
                      {name}
                    </span>
                    <span className="font-mono text-base font-bold text-[#e2e7e3]">
                      {latestVal.toFixed(1)} {unit}
                    </span>
                  </div>

                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={series.slice(-20)}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#e2e7e3"
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#889089] mt-2 pt-2 border-t border-[#e2e7e3]/10 font-mono">
                    <span>{series.length} data points</span>
                    <span className="text-[#e2e7e3] group-hover:underline font-semibold">
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
