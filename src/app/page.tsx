'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Activity,
  Terminal,
  BarChart3,
  BellRing,
  Server,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  Database,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LiveDot } from '@/components/ui/live-dot';

export default function LandingPage() {
  const [copiedTab, setCopiedTab] = React.useState<'sdk' | 'curl' | 'traffic'>('sdk');
  const [copied, setCopied] = React.useState(false);
  const [activeCodeTab, setActiveCodeTab] = React.useState<'sdk' | 'curl' | 'traffic'>('sdk');

  const codeSnippets = {
    sdk: `import { PulseLens } from '@pulselens/sdk';

// 1. Initialize PulseLens SDK
const pulse = new PulseLens({
  endpoint: 'http://localhost:3000',
  service: 'payment-service',
});

// 2. Ingest structured telemetry logs
await pulse.log({
  level: 'info',
  message: 'Processed stripe webhook for order #9821',
});

// 3. Emit real-time time-series metrics
await pulse.metric({
  name: 'response_time_ms',
  value: 42.5,
});`,
    curl: `# Ingest a structured log event
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "auth-service",
    "level": "error",
    "message": "Token verification failed: expired session"
  }'

# Emit time-series metric data point
curl -X POST http://localhost:3000/api/metrics \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": "auth-service",
    "name": "cpu_usage_pct",
    "value": 78.4
  }'`,
    traffic: `# Run the autonomous multi-service traffic generator
npm run simulate

# Starts concurrent telemetry emitters for:
# - payment-service (webhooks, latency, DB timeouts)
# - auth-service (token verifications, rate limits)
# - order-service (checkout transactions, memory spikes)
# - notification-service (email queue dispatches)`,
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#0e0d08] text-[#e2e7e3] selection:bg-[#e2e7e3]/20 selection:text-[#e2e7e3] font-sans overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#e2e7e3]/[0.025] blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#e2e7e3]/[0.02] blur-[160px]" />
      </div>

      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e2e7e3]/10 bg-[#0e0d08]/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#e2e7e3] to-[#889089] flex items-center justify-center shadow-lg shadow-[#e2e7e3]/10 text-[#0e0d08] transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5 animate-pulse font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#e2e7e3]">
                  PulseLens
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#e2e7e3]/10 text-[#e2e7e3] border border-[#e2e7e3]/20 px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-[#a6aea7] font-medium hidden sm:block">
                Real-Time Telemetry
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a6aea7]">
            <a href="#features" className="hover:text-[#e2e7e3] transition-colors">
              Features
            </a>
            <a href="#sdk" className="hover:text-[#e2e7e3] transition-colors">
              SDK & API
            </a>
            <a href="#architecture" className="hover:text-[#e2e7e3] transition-colors">
              Architecture
            </a>
            <a
              href="https://github.com/sumit-75/PulseLens#readme"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#e2e7e3] transition-colors flex items-center gap-1"
            >
              Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#a6aea7] hover:text-[#e2e7e3] transition-colors"
            >
              Sign In
            </Link>

            <Link href="/dashboard">
              <Button
                variant="default"
                size="sm"
                className="h-10 px-4 sm:px-5 text-xs sm:text-sm font-bold gap-2 shadow-lg shadow-[#e2e7e3]/5 hover:shadow-[#e2e7e3]/15 transition-all"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181711] border border-[#e2e7e3]/15 text-xs sm:text-sm text-[#e2e7e3] mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Sparkles className="h-4 w-4 text-[#e2e7e3]" />
          <span className="font-medium text-[#a6aea7]">
            Full-Stack Telemetry & Distributed Monitoring Platform
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#e2e7e3] max-w-5xl mx-auto leading-[1.1]">
          Unified Telemetry for Modern Cloud & Microservices
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-[#a6aea7] max-w-3xl mx-auto font-normal leading-relaxed">
          Ingest structured logs, monitor real-time time-series metrics with Recharts, inspect JSON payloads, and automate background threshold alerting in milliseconds.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-sm sm:text-base font-bold gap-2 shadow-xl"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <a
            href="https://github.com/sumit-75/PulseLens"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-semibold gap-2.5 border-[#e2e7e3]/15 bg-[#15140e] hover:bg-[#1f1e16] text-[#e2e7e3]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub Repository</span>
            </Button>
          </a>
        </div>

        {/* Interactive Live Telemetry Terminal Preview */}
        <div className="mt-14 sm:mt-16 relative mx-auto max-w-5xl rounded-2xl border border-[#e2e7e3]/15 bg-[#12110b]/95 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl text-left">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#e2e7e3]/10 px-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-[#889089]">
                pulselens-telemetry-stream • live
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <LiveDot size="sm" />
              <span>3s Live Ingestion</span>
            </div>
          </div>

          {/* Terminal Stream Rows */}
          <div className="space-y-2 font-mono text-xs sm:text-[13px] overflow-x-auto p-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#181711]/80 border border-[#e2e7e3]/8">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                INFO
              </span>
              <span className="text-[#a6aea7] px-2 py-0.5 rounded bg-[#0e0d08] border border-[#e2e7e3]/10">
                payment-service
              </span>
              <span className="text-[#e2e7e3] truncate flex-1">
                Processed webhook payload for order #ORD-9412 in 34ms
              </span>
              <span className="text-[#889089] text-[11px]">Just now</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#181711]/80 border border-[#e2e7e3]/8">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/25">
                WARN
              </span>
              <span className="text-[#a6aea7] px-2 py-0.5 rounded bg-[#0e0d08] border border-[#e2e7e3]/10">
                auth-service
              </span>
              <span className="text-[#e2e7e3] truncate flex-1">
                Rate limit approaching (85% quota consumed) on client socket
              </span>
              <span className="text-[#889089] text-[11px]">2s ago</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-[#181711]/80 border border-[#e2e7e3]/8">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/25">
                ERROR
              </span>
              <span className="text-[#a6aea7] px-2 py-0.5 rounded bg-[#0e0d08] border border-[#e2e7e3]/10">
                order-service
              </span>
              <span className="text-[#e2e7e3] truncate flex-1">
                Database connection pool timeout while acquiring client socket
              </span>
              <span className="text-[#889089] text-[11px]">4s ago</span>
            </div>
          </div>
        </div>
      </section>

      {/* High-Performance Telemetry Engine Metrics Grid */}
      <section className="relative z-10 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Ingestion Latency */}
          <div className="relative group rounded-2xl border border-[#e2e7e3]/15 bg-[#15140e]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-[#e2e7e3]/35 transition-all hover:scale-[1.02] overflow-hidden">
            {/* Top Accent Light */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e2e7e3]/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#1c1a12] border border-[#e2e7e3]/15 text-[#e2e7e3]">
                  <Zap className="h-4 w-4 text-[#e2e7e3]" />
                </div>
                <span className="text-xs font-bold text-[#a6aea7] tracking-wider uppercase">
                  Latency
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#e2e7e3]/10 text-[#e2e7e3] border border-[#e2e7e3]/20 px-2 py-0.5 rounded-full">
                Ultra Fast
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#e2e7e3] tracking-tight">
              &lt; 5<span className="text-lg sm:text-xl font-normal text-[#889089]">ms</span>
            </div>

            <p className="text-xs text-[#a6aea7] mt-2 font-normal leading-relaxed">
              Sub-millisecond ingestion pipeline with non-blocking async serialization.
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#e2e7e3]/10 flex items-center justify-between text-[11px] font-mono text-[#889089]">
              <span>Ingestion SLA</span>
              <span className="text-emerald-400 font-semibold">99.99%</span>
            </div>
          </div>

          {/* Card 2: Real-time Polling Stream */}
          <div className="relative group rounded-2xl border border-emerald-500/25 bg-[#15140e]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-emerald-500/40 transition-all hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#1c1a12] border border-emerald-500/25 text-emerald-400">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-[#a6aea7] tracking-wider uppercase">
                  Telemetry Stream
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <LiveDot size="sm" />
                Live
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 tracking-tight">
              3.0<span className="text-lg sm:text-xl font-normal text-emerald-400/70">s</span>
            </div>

            <p className="text-xs text-[#a6aea7] mt-2 font-normal leading-relaxed">
              Continuous live polling stream updating logs and graphs dynamically.
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#e2e7e3]/10 flex items-center justify-between text-[11px] font-mono text-[#889089]">
              <span>Auto-refresh</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>

          {/* Card 3: Type Safety & SDK */}
          <div className="relative group rounded-2xl border border-[#e2e7e3]/15 bg-[#15140e]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-[#e2e7e3]/35 transition-all hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e2e7e3]/40 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#1c1a12] border border-[#e2e7e3]/15 text-[#e2e7e3]">
                  <ShieldCheck className="h-4 w-4 text-[#e2e7e3]" />
                </div>
                <span className="text-xs font-bold text-[#a6aea7] tracking-wider uppercase">
                  TypeScript SDK
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#e2e7e3]/10 text-[#e2e7e3] border border-[#e2e7e3]/20 px-2 py-0.5 rounded-full">
                Type-Safe
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#e2e7e3] tracking-tight">
              100<span className="text-lg sm:text-xl font-normal text-[#889089]">%</span>
            </div>

            <p className="text-xs text-[#a6aea7] mt-2 font-normal leading-relaxed">
              Complete compile-time type validation, auto-retry, and lightweight payloads.
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#e2e7e3]/10 flex items-center justify-between text-[11px] font-mono text-[#889089]">
              <span>Runtime Safety</span>
              <span className="text-[#e2e7e3] font-semibold">Strict</span>
            </div>
          </div>

          {/* Card 4: Background Cron Engine */}
          <div className="relative group rounded-2xl border border-amber-500/25 bg-[#15140e]/90 p-5 sm:p-6 backdrop-blur-xl shadow-xl hover:border-amber-500/40 transition-all hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#1c1a12] border border-amber-500/25 text-amber-400">
                  <BellRing className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-[#a6aea7] tracking-wider uppercase">
                  Alert Daemon
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                node-cron
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-400 tracking-tight">
              60<span className="text-lg sm:text-xl font-normal text-amber-400/70">s</span>
            </div>

            <p className="text-xs text-[#a6aea7] mt-2 font-normal leading-relaxed">
              Autonomous background worker evaluating error rate and latency anomalies.
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#e2e7e3]/10 flex items-center justify-between text-[11px] font-mono text-[#889089]">
              <span>Schedule</span>
              <span className="text-amber-400 font-semibold">* * * * *</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#a6aea7] bg-[#15140e] border border-[#e2e7e3]/15 px-3.5 py-1 rounded-full shadow-sm">
            Platform Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#e2e7e3] mt-3">
            Engineered for High-Velocity Microservices
          </h2>
          <p className="text-sm sm:text-base text-[#a6aea7] max-w-2xl mx-auto mt-2.5 font-normal">
            Everything your engineering team needs to ingest, visualize, and monitor real-time distributed telemetry with zero bloat.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="space-y-6">
          {/* Row 1: 2 Cards (Wide Left + Live Graph Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Card 1: Wide Card (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-[#e2e7e3]/12 bg-[#15140e] p-7 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-[#e2e7e3]/30 transition-all group">
              <div>
                {/* Top Bar with Icon & Perfect Glowing Green LED Array */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-11 w-11 rounded-2xl bg-[#1c1a12] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] shadow-sm">
                    <Layers className="h-5 w-5" />
                  </div>

                  {/* Perfect Server Rack LED Dot Array */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0e0d08] border border-[#e2e7e3]/15 shadow-inner">
                    <LiveDot size="sm" ping={true} />
                    <LiveDot size="sm" ping={false} />
                    <LiveDot size="sm" ping={false} />
                    <LiveDot size="sm" ping={false} />
                    <LiveDot size="sm" ping={false} />
                  </div>
                </div>

                {/* Title & Description with Real Project Details */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#e2e7e3] tracking-tight">
                  PostgreSQL Log Indexing & Live Stream
                </h3>
                <p className="text-sm text-[#a6aea7] mt-2.5 leading-relaxed max-w-2xl font-normal">
                  Ingests high-throughput JSON telemetry into Neon Serverless PostgreSQL with indexed composite lookups on <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">service</code>, <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">level</code>, and <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">timestamp</code> for real-time querying.
                </p>
              </div>

              {/* 4 Bottom Real Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-6 border-t border-[#e2e7e3]/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#e2e7e3]">
                    3.0s
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#889089]">
                    POLL INTERVAL
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#e2e7e3]">
                    &lt; 5ms
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#889089]">
                    INGESTION LATENCY
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#e2e7e3]">
                    100%
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#889089]">
                    NEON POSTGRES
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#e2e7e3]">
                    Indexed
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#889089]">
                    COMPOSITE QUERIES
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Live Latency Telemetry Graph (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-[#e2e7e3]/12 bg-[#15140e] p-7 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-[#e2e7e3]/30 transition-all group">
              <div>
                {/* Icon */}
                <div className="h-11 w-11 rounded-2xl bg-[#1c1a12] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-6 shadow-sm">
                  <Zap className="h-5 w-5 text-[#e2e7e3]" />
                </div>

                {/* Title & Description */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#e2e7e3] tracking-tight">
                  Live Metrics & Graphs
                </h3>
                <p className="text-sm text-[#a6aea7] mt-2.5 leading-relaxed font-normal">
                  Tracks <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">response_time_ms</code>, <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">cpu_usage_pct</code>, and <code className="text-[#e2e7e3] bg-[#0e0d08] px-1.5 py-0.5 rounded border border-[#e2e7e3]/10 font-mono text-xs">memory_usage_mb</code> with Recharts area charts and statistical KPI calculations (P95, Avg, Min, Max).
                </p>
              </div>

              {/* Glowing SVG Waveform Chart in exact Theme Palette */}
              <div className="pt-6 mt-6 border-t border-[#e2e7e3]/10">
                <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                  <span className="text-[#a6aea7] font-medium">response_time_ms</span>
                  <span className="text-[#e2e7e3] font-bold bg-[#0e0d08] px-2 py-0.5 rounded border border-[#e2e7e3]/15">
                    42.5 ms P95
                  </span>
                </div>

                {/* SVG Graph Wave matching #e2e7e3 Theme Palette */}
                <div className="h-20 w-full relative overflow-hidden rounded-xl bg-[#0e0d08] border border-[#e2e7e3]/10 p-2 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="themeGraphGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2e7e3" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#e2e7e3" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Gradient Fill */}
                    <polygon
                      points="0,60 0,40 30,35 60,42 90,28 120,45 150,20 180,38 210,12 240,32 270,18 300,25 300,60"
                      fill="url(#themeGraphGradient)"
                    />
                    {/* Glowing Line */}
                    <polyline
                      points="0,40 30,35 60,42 90,28 120,45 150,20 180,38 210,12 240,32 270,18 300,25"
                      fill="none"
                      stroke="#e2e7e3"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 3: Multi-Service Catalog */}
            <div className="rounded-3xl border border-[#e2e7e3]/12 bg-[#15140e] p-7 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-[#e2e7e3]/30 transition-all group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-[#1c1a12] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-6 shadow-sm">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#e2e7e3] tracking-tight">
                  Registered Service Catalog
                </h3>
                <p className="text-sm text-[#a6aea7] mt-2 leading-relaxed font-normal">
                  Auto-registers active telemetry producers like <span className="text-[#e2e7e3] font-medium font-mono text-xs">payment-service</span> and <span className="text-[#e2e7e3] font-medium font-mono text-xs">auth-service</span> with dynamic heartbeat tracking.
                </p>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-[#e2e7e3]/10">
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0e0d08] border border-[#e2e7e3]/12 text-[#a6aea7]">
                  payment-service
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0e0d08] border border-[#e2e7e3]/12 text-[#a6aea7]">
                  auth-service
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0e0d08] border border-[#e2e7e3]/12 text-[#a6aea7]">
                  order-service
                </span>
              </div>
            </div>

            {/* Card 4: Traffic Simulator Engine */}
            <div className="rounded-3xl border border-[#e2e7e3]/12 bg-[#15140e] p-7 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-[#e2e7e3]/30 transition-all group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-[#1c1a12] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-6 shadow-sm">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#e2e7e3] tracking-tight">
                  Traffic Simulator Engine
                </h3>
                <p className="text-sm text-[#a6aea7] mt-2 leading-relaxed font-normal">
                  Built-in multi-service telemetry generator (<code className="text-[#e2e7e3] bg-[#0e0d08] px-1 py-0.5 rounded font-mono text-xs">scripts/simulate-traffic.ts</code>) emitting concurrent traffic spikes and webhook errors.
                </p>
              </div>

              {/* Live Pill with Perfect Glowing Green Light */}
              <div className="pt-6 mt-6 border-t border-[#e2e7e3]/10">
                <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#0e0d08] border border-[#e2e7e3]/15 text-[#e2e7e3] shadow-sm">
                  <LiveDot size="sm" />
                  <span>npm run simulate (500ms)</span>
                </span>
              </div>
            </div>

            {/* Card 5: Threshold Guard & Auth */}
            <div className="rounded-3xl border border-[#e2e7e3]/12 bg-[#15140e] p-7 sm:p-8 shadow-2xl flex flex-col justify-between hover:border-[#e2e7e3]/30 transition-all group">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-[#1c1a12] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-6 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#e2e7e3] tracking-tight">
                  Autonomous Alert Daemon
                </h3>
                <p className="text-sm text-[#a6aea7] mt-2 leading-relaxed font-normal">
                  Evaluates error count and latency thresholds every minute via <code className="text-[#e2e7e3] bg-[#0e0d08] px-1 py-0.5 rounded font-mono text-xs">node-cron</code>, recording violation events in the incident audit stream.
                </p>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-6 mt-6 border-t border-[#e2e7e3]/10">
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0e0d08] border border-[#e2e7e3]/12 text-[#a6aea7]">
                  node-cron (* * * * *)
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono bg-[#0e0d08] border border-[#e2e7e3]/12 text-[#a6aea7]">
                  Incident Timeline
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK & Interactive Code Showcase */}
      <section id="sdk" className="relative z-10 py-20 border-t border-[#e2e7e3]/10 bg-[#12110b]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#15140e] border border-[#e2e7e3]/15 text-xs font-bold uppercase tracking-wider text-[#a6aea7] shadow-sm">
                <Code2 className="h-3.5 w-3.5 text-[#e2e7e3]" />
                <span>Developer Experience</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e2e7e3] leading-tight">
                Start Ingesting Telemetry in Under 2 Minutes
              </h2>

              <p className="text-sm sm:text-base text-[#a6aea7] leading-relaxed font-normal">
                Integrate PulseLens into any Node.js, Next.js, Express, or microservice architecture with lightweight REST APIs or our strongly-typed TypeScript SDK.
              </p>

              {/* Quick Install Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#15140e] border border-[#e2e7e3]/15 shadow-md">
                <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-[#e2e7e3]">
                  <span className="text-[#889089] select-none">$</span>
                  <span>npm install @pulselens/sdk</span>
                </div>
                <button
                  onClick={() => handleCopyCode('npm install @pulselens/sdk')}
                  className="p-1.5 text-[#889089] hover:text-[#e2e7e3] hover:bg-[#1c1a12] rounded-lg transition-colors flex items-center gap-1 text-xs font-mono"
                  title="Copy install command"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Checklist */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-normal text-[#a6aea7]">Automatic schema validation on ingestion</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-normal text-[#a6aea7]">Non-blocking async telemetry dispatch</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-normal text-[#a6aea7]">Built-in multi-service traffic simulation tool</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/dashboard">
                  <Button className="h-11 px-6 text-sm font-bold gap-2 shadow-lg">
                    <span>Try In Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <a
                  href="https://github.com/sumit-75/PulseLens"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    className="h-11 px-5 text-sm font-semibold border-[#e2e7e3]/15 bg-[#15140e] hover:bg-[#1f1e16] text-[#e2e7e3]"
                  >
                    <span>View on GitHub</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Interactive Code Box */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[#e2e7e3]/15 bg-[#14130d] overflow-hidden shadow-2xl">
                {/* macOS Style Top Window Bar */}
                <div className="flex items-center justify-between border-b border-[#e2e7e3]/10 bg-[#12110b] px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Window Controls */}
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Code Tabs */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-[#e2e7e3]/10">
                      {(['sdk', 'curl', 'traffic'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveCodeTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                            activeCodeTab === tab
                              ? 'bg-[#1e1c14] text-[#e2e7e3] border border-[#e2e7e3]/20 font-bold shadow-sm'
                              : 'text-[#889089] hover:text-[#e2e7e3]'
                          }`}
                        >
                          {tab === 'sdk' ? 'TypeScript SDK' : tab === 'curl' ? 'REST API (cURL)' : 'Traffic Generator'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyCode(codeSnippets[activeCodeTab])}
                    className="p-1.5 px-2.5 text-[#889089] hover:text-[#e2e7e3] hover:bg-[#1c1a12] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono border border-transparent hover:border-[#e2e7e3]/10"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block with Rich Syntax Styling */}
                <div className="p-5 sm:p-6 text-xs sm:text-[13.5px] font-mono text-[#e2e7e3] overflow-x-auto leading-relaxed bg-[#0e0d08]">
                  {activeCodeTab === 'sdk' && (
                    <pre className="space-y-1">
                      <div><span className="text-[#e2e7e3] font-bold">import</span> &#123; <span className="text-sky-300">PulseLens</span> &#125; <span className="text-[#e2e7e3] font-bold">from</span> <span className="text-emerald-300">&apos;@pulselens/sdk&apos;</span>;</div>
                      <div className="text-[#889089] pt-2">// 1. Initialize PulseLens SDK client</div>
                      <div><span className="text-[#e2e7e3] font-bold">const</span> pulse = <span className="text-[#e2e7e3] font-bold">new</span> <span className="text-sky-300">PulseLens</span>(&#123;</div>
                      <div className="pl-4">endpoint: <span className="text-emerald-300">&apos;http://localhost:3000&apos;</span>,</div>
                      <div className="pl-4">service: <span className="text-emerald-300">&apos;payment-service&apos;</span>,</div>
                      <div>&#125;);</div>
                      <div className="text-[#889089] pt-2">// 2. Ingest structured telemetry logs</div>
                      <div><span className="text-[#e2e7e3] font-bold">await</span> pulse.<span className="text-sky-300">log</span>(&#123;</div>
                      <div className="pl-4">level: <span className="text-emerald-300">&apos;info&apos;</span>,</div>
                      <div className="pl-4">message: <span className="text-emerald-300">&apos;Processed stripe webhook for order #9821&apos;</span>,</div>
                      <div>&#125;);</div>
                      <div className="text-[#889089] pt-2">// 3. Emit real-time time-series metrics</div>
                      <div><span className="text-[#e2e7e3] font-bold">await</span> pulse.<span className="text-sky-300">metric</span>(&#123;</div>
                      <div className="pl-4">name: <span className="text-emerald-300">&apos;response_time_ms&apos;</span>,</div>
                      <div className="pl-4">value: <span className="text-amber-300">42.5</span>,</div>
                      <div>&#125;);</div>
                    </pre>
                  )}

                  {activeCodeTab === 'curl' && (
                    <pre className="space-y-1">
                      <div className="text-[#889089]"># Ingest a structured log event</div>
                      <div><span className="text-sky-300 font-bold">curl</span> -X POST http://localhost:3000/api/logs \</div>
                      <div className="pl-4">-H <span className="text-emerald-300">&quot;Content-Type: application/json&quot;</span> \</div>
                      <div className="pl-4">-d <span className="text-emerald-300">&apos;&#123;</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;service&quot;: &quot;auth-service&quot;,</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;level&quot;: &quot;error&quot;,</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;message&quot;: &quot;Token verification failed: expired session&quot;</span></div>
                      <div className="pl-4"><span className="text-emerald-300">&#125;&apos;</span></div>
                      <div className="text-[#889089] pt-3"># Emit time-series metric data point</div>
                      <div><span className="text-sky-300 font-bold">curl</span> -X POST http://localhost:3000/api/metrics \</div>
                      <div className="pl-4">-H <span className="text-emerald-300">&quot;Content-Type: application/json&quot;</span> \</div>
                      <div className="pl-4">-d <span className="text-emerald-300">&apos;&#123;</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;service&quot;: &quot;auth-service&quot;,</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;name&quot;: &quot;cpu_usage_pct&quot;,</span></div>
                      <div className="pl-8"><span className="text-emerald-300">&quot;value&quot;: 78.4</span></div>
                      <div className="pl-4"><span className="text-emerald-300">&#125;&apos;</span></div>
                    </pre>
                  )}

                  {activeCodeTab === 'traffic' && (
                    <pre className="space-y-1">
                      <div className="text-[#889089]"># Run autonomous multi-service traffic generator</div>
                      <div className="text-emerald-300 font-bold">npm run simulate</div>
                      <div className="text-[#889089] pt-3"># Starts concurrent telemetry emitters for:</div>
                      <div className="text-[#a6aea7] pl-2">• <span className="text-[#e2e7e3]">payment-service</span> (webhooks, latency, DB timeouts)</div>
                      <div className="text-[#a6aea7] pl-2">• <span className="text-[#e2e7e3]">auth-service</span> (token verifications, rate limits)</div>
                      <div className="text-[#a6aea7] pl-2">• <span className="text-[#e2e7e3]">order-service</span> (checkout transactions, memory spikes)</div>
                      <div className="text-[#a6aea7] pl-2">• <span className="text-[#e2e7e3]">notification-service</span> (email queue dispatches)</div>
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Flow Diagram Section */}
      <section id="architecture" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#889089] bg-[#181711] border border-[#e2e7e3]/15 px-3 py-1 rounded-full">
            System Design
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e2e7e3] mt-3">
            End-to-End Ingestion & Processing Pipeline
          </h2>
          <p className="text-sm sm:text-base text-[#a6aea7] max-w-2xl mx-auto mt-2 font-normal">
            How PulseLens coordinates high-throughput telemetry streams across database storage, real-time UI subscribers, and autonomous cron alerting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[#e2e7e3]/10 bg-[#15140e]/90 text-center relative group hover:border-[#e2e7e3]/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 mx-auto flex items-center justify-center text-[#e2e7e3] mb-3">
              <Server className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#889089] tracking-wider">
              Step 1
            </span>
            <h4 className="text-base font-bold text-[#e2e7e3] mt-1">
              Microservices
            </h4>
            <p className="text-xs text-[#a6aea7] mt-1.5">
              Services emit structured logs and latency metrics via TypeScript SDK.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2e7e3]/10 bg-[#15140e]/90 text-center relative group hover:border-[#e2e7e3]/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 mx-auto flex items-center justify-center text-[#e2e7e3] mb-3">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#889089] tracking-wider">
              Step 2
            </span>
            <h4 className="text-base font-bold text-[#e2e7e3] mt-1">
              Ingestion APIs
            </h4>
            <p className="text-xs text-[#a6aea7] mt-1.5">
              Next.js API routes validate payloads and enforce indexing requirements.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2e7e3]/10 bg-[#15140e]/90 text-center relative group hover:border-[#e2e7e3]/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 mx-auto flex items-center justify-center text-[#e2e7e3] mb-3">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#889089] tracking-wider">
              Step 3
            </span>
            <h4 className="text-base font-bold text-[#e2e7e3] mt-1">
              Neon Postgres
            </h4>
            <p className="text-xs text-[#a6aea7] mt-1.5">
              Persistent indexed relational storage with high-speed composite queries.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#e2e7e3]/10 bg-[#15140e]/90 text-center relative group hover:border-[#e2e7e3]/25 transition-all">
            <div className="h-10 w-10 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 mx-auto flex items-center justify-center text-[#e2e7e3] mb-3">
              <RefreshCw className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#889089] tracking-wider">
              Step 4
            </span>
            <h4 className="text-base font-bold text-[#e2e7e3] mt-1">
              UI & Cron Alerting
            </h4>
            <p className="text-xs text-[#a6aea7] mt-1.5">
              3s live polling stream in frontend and automated 60s rule evaluation daemon.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Card className="p-8 sm:p-12 border-[#e2e7e3]/20 bg-gradient-to-b from-[#15140e] to-[#0e0d08] text-center rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#e2e7e3]">
              Gain Instant Visibility Into Your Microservices
            </h2>
            <p className="mt-4 text-sm sm:text-lg text-[#a6aea7] font-normal leading-relaxed">
              Launch the live dashboard or clone the repository to run PulseLens on your local infrastructure in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold gap-2">
                  <span>Open Live Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-6 text-base font-semibold border-[#e2e7e3]/20 bg-[#181711] text-[#e2e7e3]"
                >
                  <span>Sign In with Google</span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e2e7e3]/10 py-12 bg-[#0e0d08] text-xs text-[#889089]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#e2e7e3] text-[#0e0d08] flex items-center justify-center font-bold">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[#e2e7e3]">PulseLens</span>
              <p className="text-[11px] text-[#889089]">Real-Time Observability Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-[#e2e7e3] transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[#e2e7e3] transition-colors">
              Login
            </Link>
            <a
              href="https://github.com/sumit-75/PulseLens"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#e2e7e3] transition-colors"
            >
              GitHub
            </a>
          </div>

          <p className="text-[11px]">
            © {new Date().getFullYear()} PulseLens. Built with Next.js, Prisma, Neon & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
