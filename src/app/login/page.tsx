'use client';

import * as React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Activity, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = React.useState(false);

  React.useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [status, session, router]);

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error('Google Sign In error:', err);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoadingDemo(true);
    try {
      await signIn('demo-login', { callbackUrl: '/' });
    } catch (err) {
      console.error('Demo Sign In error:', err);
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090a0f] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.15),rgba(0,0,0,0))] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white mb-4">
            <Activity className="h-7 w-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            PulseLens
            <span className="text-xs uppercase font-semibold tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Sign in to access your logs stream, time-series graphs, and automated alert rules.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 border-slate-800/80 bg-[#0e101a]/90 backdrop-blur-xl shadow-2xl space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">
              Authenticate to Workspace
            </h2>
            <p className="text-xs text-slate-400">
              Select your preferred authentication method below.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {/* Google Sign-in Button */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle || isLoadingDemo}
              className="w-full bg-slate-900/90 border-slate-700/80 hover:bg-slate-800 text-xs font-medium justify-center gap-3 py-5"
            >
              {/* Google G Logo SVG */}
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0e101a] px-2 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                or
              </span>
            </div>

            {/* Quick Demo Sign In */}
            <Button
              variant="default"
              size="lg"
              onClick={handleDemoSignIn}
              disabled={isLoadingGoogle || isLoadingDemo}
              className="w-full text-xs font-semibold justify-center gap-2 py-5 shadow-lg shadow-indigo-600/25"
            >
              <Zap className="h-4 w-4" />
              <span>Instant Demo Access (Engineer Role)</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          {/* Security footnote */}
          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ingestion APIs remain open for microservices</span>
          </div>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-300 font-medium">Log Viewer</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-300 font-medium">Recharts</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 mx-auto mb-1" />
            <p className="text-[10px] text-slate-300 font-medium">Alert Cron</p>
          </div>
        </div>
      </div>
    </div>
  );
}
