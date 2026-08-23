'use client';

import * as React from 'react';
import { X, Copy, Check, Terminal, Clock, Server, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export interface LogEntry {
  id: string;
  service: string;
  level: 'info' | 'warn' | 'error' | string;
  message: string;
  timestamp: string;
}

interface LogDetailModalProps {
  log: LogEntry | null;
  onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!log) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelVariant = (level: string) => {
    if (level === 'error') return 'error';
    if (level === 'warn') return 'warn';
    return 'info';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#e2e7e3]/15 bg-[#15140e] shadow-2xl p-6 overflow-hidden text-[#e2e7e3]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e2e7e3]/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#181711] border border-[#e2e7e3]/10">
              <Terminal className="h-5 w-5 text-[#e2e7e3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#e2e7e3]">Log Inspector</h2>
                <Badge variant={getLevelVariant(log.level)}>{log.level}</Badge>
              </div>
              <p className="text-xs text-[#889089] font-mono mt-0.5">ID: {log.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#889089] hover:text-[#e2e7e3] rounded-lg hover:bg-[#232018] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-lg bg-[#181711]/70 border border-[#e2e7e3]/10">
            <div className="flex items-center gap-1.5 text-xs text-[#889089] mb-1">
              <Server className="h-3.5 w-3.5 text-[#e2e7e3]" />
              Service Name
            </div>
            <div className="text-sm font-medium text-[#e2e7e3] font-mono">{log.service}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#181711]/70 border border-[#e2e7e3]/10">
            <div className="flex items-center gap-1.5 text-xs text-[#889089] mb-1">
              <Clock className="h-3.5 w-3.5 text-[#e2e7e3]" />
              Timestamp
            </div>
            <div className="text-xs font-medium text-[#e2e7e3] font-mono">{formatDate(log.timestamp)}</div>
          </div>
        </div>

        {/* Message Box */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-[#889089] mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-[#889089]" />
            Message
          </div>
          <div className="p-3.5 rounded-lg bg-[#0e0d08] border border-[#e2e7e3]/10 text-sm text-[#e2e7e3] font-mono break-all whitespace-pre-wrap leading-relaxed">
            {log.message}
          </div>
        </div>

        {/* Raw JSON View */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-[#889089] mb-2">
            <span>Raw JSON Record</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyJson}
              className="h-7 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
          </div>
          <pre className="p-3.5 rounded-lg bg-[#0e0d08] border border-[#e2e7e3]/10 text-[11px] text-[#e2e7e3] font-mono overflow-x-auto max-h-40">
            {JSON.stringify(log, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#e2e7e3]/10">
          <Button variant="secondary" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
