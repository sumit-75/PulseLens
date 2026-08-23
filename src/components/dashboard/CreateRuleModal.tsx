'use client';

import * as React from 'react';
import { X, BellRing, Terminal, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRuleCreated: () => void;
  services: string[];
}

export function CreateRuleModal({
  isOpen,
  onClose,
  onRuleCreated,
  services,
}: CreateRuleModalProps) {
  const [ruleType, setRuleType] = React.useState<'log' | 'metric'>('log');
  const [service, setService] = React.useState(services[0] || 'payment-service');
  const [logLevel, setLogLevel] = React.useState<'error' | 'warn'>('error');
  const [metricName, setMetricName] = React.useState('response_time_ms');
  const [threshold, setThreshold] = React.useState('5');
  const [windowMinutes, setWindowMinutes] = React.useState('5');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        service,
        threshold: parseFloat(threshold),
        windowMinutes: parseInt(windowMinutes, 10),
        ...(ruleType === 'log' ? { logLevel } : { metric: metricName }),
      };

      const res = await fetch('/api/alerts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Failed to create alert rule');
        return;
      }

      onRuleCreated();
      onClose();
    } catch (err) {
      console.error('Error creating rule:', err);
      setError('An unexpected error occurred while saving the rule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = services.map((s) => ({ value: s, label: s }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#e2e7e3]/15 bg-[#15140e] shadow-2xl p-6 overflow-hidden text-[#e2e7e3]">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e2e7e3]/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#181711] border border-[#e2e7e3]/10 text-[#e2e7e3]">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#e2e7e3]">Create Alert Rule</h2>
              <p className="text-xs sm:text-sm text-[#a6aea7] mt-0.5 font-normal">
                Define automated threshold conditions evaluated by background jobs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#889089] hover:text-[#e2e7e3] rounded-lg hover:bg-[#232018] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rule Type Selector */}
          <div>
            <label className="text-sm font-semibold text-[#e2e7e3] mb-2 block">
              Rule Trigger Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRuleType('log')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                  ruleType === 'log'
                    ? 'bg-[#e2e7e3] border-[#e2e7e3] text-[#0e0d08] shadow-sm'
                    : 'bg-[#181711] border-[#e2e7e3]/10 text-[#889089] hover:text-[#e2e7e3]'
                }`}
              >
                <Terminal className="h-4 w-4" />
                <span>Log Event Count</span>
              </button>

              <button
                type="button"
                onClick={() => setRuleType('metric')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all ${
                  ruleType === 'metric'
                    ? 'bg-[#e2e7e3] border-[#e2e7e3] text-[#0e0d08] shadow-sm'
                    : 'bg-[#181711] border-[#e2e7e3]/10 text-[#889089] hover:text-[#e2e7e3]'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Metric Threshold</span>
              </button>
            </div>
          </div>

          {/* Service Selector with shadcn Select */}
          <div>
            <label className="text-sm font-semibold text-[#e2e7e3] mb-1.5 block">
              Target Service
            </label>
            <Select
              value={service}
              onValueChange={setService}
              options={serviceOptions}
              className="w-full"
              triggerClassName="h-10 text-sm bg-[#0e0d08]"
            />
          </div>

          {/* Conditional Fields based on Rule Type */}
          {ruleType === 'log' ? (
            <div>
              <label className="text-sm font-semibold text-[#e2e7e3] mb-1.5 block">
                Target Log Level
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLogLevel('error')}
                  className={`p-2.5 rounded-lg border text-sm font-semibold capitalize transition-all ${
                    logLevel === 'error'
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                      : 'bg-[#181711] border-[#e2e7e3]/10 text-[#889089]'
                  }`}
                >
                  ERROR Level
                </button>
                <button
                  type="button"
                  onClick={() => setLogLevel('warn')}
                  className={`p-2.5 rounded-lg border text-sm font-semibold capitalize transition-all ${
                    logLevel === 'warn'
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                      : 'bg-[#181711] border-[#e2e7e3]/10 text-[#889089]'
                  }`}
                >
                  WARN Level
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-[#e2e7e3] mb-1.5 block">
                Metric Name
              </label>
              <Input
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                placeholder="e.g. response_time_ms, cpu_usage_pct"
                className="bg-[#0e0d08] border-[#e2e7e3]/15 text-sm font-mono text-[#e2e7e3] h-10"
                required
              />
            </div>
          )}

          {/* Threshold & Window */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-sm font-semibold text-[#e2e7e3] mb-1.5 block">
                Threshold {ruleType === 'log' ? '(Count)' : '(Value)'}
              </label>
              <Input
                type="number"
                step="any"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="e.g. 5"
                className="bg-[#0e0d08] border-[#e2e7e3]/15 text-sm font-mono text-[#e2e7e3] h-10"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#e2e7e3] mb-1.5 block">
                Time Window (Minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="60"
                value={windowMinutes}
                onChange={(e) => setWindowMinutes(e.target.value)}
                placeholder="e.g. 5"
                className="bg-[#0e0d08] border-[#e2e7e3]/15 text-sm font-mono text-[#e2e7e3] h-10"
                required
              />
            </div>
          </div>

          {/* Preview Box */}
          <div className="p-3.5 rounded-xl bg-[#0e0d08] border border-[#e2e7e3]/10 text-xs sm:text-[13px] text-[#a6aea7] font-mono leading-relaxed">
            <span className="text-[#e2e7e3] font-bold">Rule Evaluation:</span>{' '}
            {ruleType === 'log'
              ? `Alert if ${service} logs >= ${threshold} "${logLevel.toUpperCase()}" events in ${windowMinutes}m`
              : `Alert if ${service} "${metricName}" >= ${threshold} in ${windowMinutes}m`}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#e2e7e3]/10">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="h-10 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-10 px-4 text-sm gap-1.5 font-semibold"
            >
              <Plus className="h-4 w-4" />
              <span>Save Alert Rule</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
