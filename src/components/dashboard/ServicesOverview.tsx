'use client';

import * as React from 'react';
import { Server, Activity, Clock, ShieldCheck, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { timeAgo, formatDate } from '@/lib/utils';

export function ServicesOverview() {
  const [services, setServices] = React.useState<Array<{ service: string; lastSeen: string }>>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setServices(json.data.services);
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Server className="h-6 w-6 text-indigo-400" />
          Registered Services Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog of all microservices actively dispatching logs and time-series telemetry to PulseLens.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="h-6 w-32 bg-slate-800 rounded mb-4" />
              <div className="h-4 w-48 bg-slate-800/60 rounded mb-2" />
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="p-8 text-center text-slate-400">
          <Database className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-200">No active services detected</p>
          <p className="text-xs text-slate-500 mt-1">
            Run &quot;npm run simulate&quot; or send telemetry to /api/logs or /api/metrics to register services.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card
              key={svc.service}
              className="border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    <ShieldCheck className="h-3 w-3" />
                    Healthy
                  </Badge>
                </div>
                <CardTitle className="text-base font-mono text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {svc.service}
                </CardTitle>
                <CardDescription className="text-xs">
                  Active Telemetry Producer
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    Last Heartbeat
                  </span>
                  <span title={formatDate(svc.lastSeen)} className="text-slate-300">
                    {timeAgo(svc.lastSeen)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
