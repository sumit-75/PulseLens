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
        <h1 className="text-2xl font-bold tracking-tight text-[#e2e7e3] flex items-center gap-2">
          <Server className="h-6 w-6 text-[#e2e7e3]" />
          Registered Services Overview
        </h1>
        <p className="text-xs text-[#889089] mt-1">
          Catalog of all microservices actively dispatching logs and time-series telemetry to PulseLens.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6 bg-[#15140e]/80 border-[#e2e7e3]/10">
              <div className="h-6 w-32 bg-[#232018] rounded mb-4" />
              <div className="h-4 w-48 bg-[#232018]/60 rounded mb-2" />
            </Card>
          ))}
        </div>
      ) : services.length === 0 ? (
        <Card className="p-8 text-center text-[#889089] bg-[#15140e]/80 border-[#e2e7e3]/10">
          <Database className="h-10 w-10 text-[#889089]/60 mx-auto mb-3" />
          <p className="font-medium text-[#e2e7e3]">No active services detected</p>
          <p className="text-xs text-[#889089] mt-1">
            Run &quot;npm run simulate&quot; or send telemetry to /api/logs or /api/metrics to register services.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc) => (
            <Card
              key={svc.service}
              className="border-[#e2e7e3]/10 bg-[#15140e]/80 hover:border-[#e2e7e3]/30 transition-all group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-[#181711] border border-[#e2e7e3]/10 text-[#e2e7e3]">
                    <Activity className="h-4 w-4" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    <ShieldCheck className="h-3 w-3" />
                    Healthy
                  </Badge>
                </div>
                <CardTitle className="text-base font-mono text-[#e2e7e3] mt-2 group-hover:text-white transition-colors">
                  {svc.service}
                </CardTitle>
                <CardDescription className="text-xs text-[#889089]">
                  Active Telemetry Producer
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border-t border-[#e2e7e3]/10 pt-3 flex items-center justify-between text-xs text-[#889089] font-mono">
                  <span className="flex items-center gap-1.5 text-[#889089]">
                    <Clock className="h-3.5 w-3.5" />
                    Last Heartbeat
                  </span>
                  <span title={formatDate(svc.lastSeen)} className="text-[#a6aea7]">
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
