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
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
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

      {/* KPI Stats Showcase Banner */}
      <section className="relative z-10 py-12 border-y border-[#e2e7e3]/10 bg-[#12110b]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#e2e7e3]">
              &lt; 5ms
            </div>
            <p className="text-xs sm:text-sm text-[#a6aea7] mt-1 font-medium">
              API Ingestion Latency
            </p>
          </div>

          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">
              3s
            </div>
            <p className="text-xs sm:text-sm text-[#a6aea7] mt-1 font-medium">
              Real-time Polling Stream
            </p>
          </div>

          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#e2e7e3]">
              100%
            </div>
            <p className="text-xs sm:text-sm text-[#a6aea7] mt-1 font-medium">
              TypeScript SDK Type-Safe
            </p>
          </div>

          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-400">
              60s
            </div>
            <p className="text-xs sm:text-sm text-[#a6aea7] mt-1 font-medium">
              node-cron Alert Engine
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#889089] bg-[#181711] border border-[#e2e7e3]/15 px-3 py-1 rounded-full">
            Complete Telemetry Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e2e7e3] mt-3">
            Engineered for High-Velocity Microservices
          </h2>
          <p className="text-sm sm:text-base text-[#a6aea7] max-w-2xl mx-auto mt-2 font-normal">
            Everything your engineering team needs to observe, track, and alert across distributed backend architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <Terminal className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              Structured Log Stream
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Real-time ingestion with full-text search, service filtering, severity pill toggles, and instant JSON inspector drawer.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              Time-Series Graphs & KPIs
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Interactive Recharts area charts calculate P95 latency, average, min, and peak utilization trends across services.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <BellRing className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              Autonomous Alerting Daemon
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Background cron worker evaluates threshold conditions and writes incidents to an audit timeline with on-demand check triggers.
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              Zero-Config TypeScript SDK
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Plug-and-play client SDK with type safety, automatic error handling, and lightweight payload serialization.
            </p>
          </Card>

          {/* Card 5 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <Database className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              Neon Serverless Postgres
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Backed by Neon serverless PostgreSQL with indexed queries on service, timestamp, and severity levels for instant lookups.
            </p>
          </Card>

          {/* Card 6 */}
          <Card className="p-6 sm:p-7 border-[#e2e7e3]/12 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-[#181711] border border-[#e2e7e3]/15 flex items-center justify-center text-[#e2e7e3] mb-5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#e2e7e3] mb-2">
              OAuth & Instant Demo Mode
            </h3>
            <p className="text-sm text-[#a6aea7] leading-relaxed">
              Integrated Auth.js (NextAuth v5) with Google OAuth for team members and one-click instant demo mode for rapid reviewer access.
            </p>
          </Card>
        </div>
      </section>

      {/* SDK & Interactive Code Showcase */}
      <section id="sdk" className="relative z-10 py-20 border-t border-[#e2e7e3]/10 bg-[#12110b]/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#889089] bg-[#181711] border border-[#e2e7e3]/15 px-3 py-1 rounded-full">
                Developer Experience
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e2e7e3]">
                Start Ingesting Telemetry in Under 2 Minutes
              </h2>
              <p className="text-sm sm:text-base text-[#a6aea7] leading-relaxed font-normal">
                Integrate PulseLens into any Node.js, Next.js, Express, or microservice architecture with simple REST APIs or our strongly-typed TypeScript SDK.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Automatic schema validation on ingestion</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Non-blocking async telemetry dispatch</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#e2e7e3]">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Built-in multi-service traffic simulation tool</span>
                </div>
              </div>

              <div className="pt-3">
                <Link href="/dashboard">
                  <Button className="h-11 px-6 text-sm font-bold gap-2">
                    <span>Try In Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Interactive Code Box */}
            <div className="lg:col-span-7">
              <Card className="border-[#e2e7e3]/15 bg-[#15140e] overflow-hidden shadow-2xl">
                {/* Code Tabs Header */}
                <div className="flex items-center justify-between border-b border-[#e2e7e3]/10 bg-[#12110b] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {(['sdk', 'curl', 'traffic'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveCodeTab(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          activeCodeTab === tab
                            ? 'bg-[#e2e7e3] text-[#0e0d08] font-bold shadow-sm'
                            : 'text-[#889089] hover:text-[#e2e7e3]'
                        }`}
                      >
                        {tab === 'sdk' ? 'TypeScript SDK' : tab === 'curl' ? 'REST API (cURL)' : 'Traffic Generator'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCopyCode(codeSnippets[activeCodeTab])}
                    className="p-1.5 text-[#889089] hover:text-[#e2e7e3] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono"
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

                {/* Code Block */}
                <pre className="p-5 text-xs sm:text-[13px] font-mono text-[#e2e7e3] overflow-x-auto leading-relaxed bg-[#0e0d08]/80">
                  {codeSnippets[activeCodeTab]}
                </pre>
              </Card>
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
