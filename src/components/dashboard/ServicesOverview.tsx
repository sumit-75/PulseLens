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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e7e3] flex items-center gap-2.5">
          <Server className="h-7 w-7 text-[#e2e7e3]" />
          Registered Services Overview
        </h1>
        <p className="text-sm sm:text-base text-[#a6aea7] mt-1 font-normal">
          Catalog of all microservices actively dispatching logs and time-series telemetry to PulseLens.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6 bg-[#15140e]/80 border-[#e2e7e3]/10 shadow-lg">
              <div className="h-7 w-36 bg-[#232018] rounded mb-4" />
              <div className="h-4 w-52 bg-[#232018]/60 rounded mb-2" />
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="p-10 text-center text-[#889089] bg-[#15140e]/80 border-[#e2e7e3]/10 shadow-lg">
          <Database className="h-12 w-12 text-[#889089]/50 mx-auto mb-3" />
          <p className="text-lg font-semibold text-[#e2e7e3]">No active services detected</p>
          <p className="text-sm text-[#a6aea7] mt-1 max-w-md mx-auto">
            Run &quot;npm run simulate&quot; in terminal or send telemetry to /api/logs or /api/metrics to register microservices.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card
              key={svc.service}
              className="border-[#e2e7e3]/10 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group shadow-xl"
            >
              <CardHeader className="pb-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-[#181711] border border-[#e2e7e3]/10 text-[#e2e7e3]">
                    <Activity className="h-5 w-5" />
                  </div>
                  <Badge variant="success" className="text-xs">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Healthy
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-mono font-bold text-[#e2e7e3] mt-2.5 group-hover:text-white transition-colors">
                  {svc.service}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-[#a6aea7]">
                  Active Telemetry Producer
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-t border-[#e2e7e3]/10 pt-3.5 flex items-center justify-between text-xs sm:text-sm text-[#889089] font-mono">
                  <span className="flex items-center gap-1.5 text-[#889089]">
                    <Clock className="h-4 w-4" />
                    Last Heartbeat
                  </span>
                  <span title={formatDate(svc.lastSeen)} className="text-[#e2e7e3] font-semibold">
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
