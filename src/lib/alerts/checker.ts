import { prisma } from '@/lib/prisma';

export interface EvaluationResult {
  ruleId: string;
  service: string;
  condition: string;
  triggered: boolean;
  details?: string;
  eventId?: string;
}

/**
 * Evaluates all enabled AlertRules against recent logs and metrics data.
 * If a rule threshold is violated, creates an AlertEvent record.
 */
export async function evaluateAllAlertRules(): Promise<EvaluationResult[]> {
  const activeRules = await prisma.alertRule.findMany({
    where: { enabled: true },
  });

  const results: EvaluationResult[] = [];

  for (const rule of activeRules) {
    try {
      const windowStart = new Date(Date.now() - rule.windowMinutes * 60 * 1000);

      // Case 1: Log-based alert (e.g. error or warn count > threshold)
      if (rule.logLevel) {
        const matchingLogCount = await prisma.log.count({
          where: {
            service: rule.service,
            level: rule.logLevel.toLowerCase(),
            timestamp: { gte: windowStart },
          },
        });

        if (matchingLogCount >= rule.threshold) {
          const details = `Alert Triggered: ${rule.service} logged ${matchingLogCount} "${rule.logLevel}" events in the last ${rule.windowMinutes}m (Threshold: >= ${rule.threshold})`;

          // Avoid duplicate spam: check if an event for this rule was already logged in the last 2 minutes
          const recentEvent = await prisma.alertEvent.findFirst({
            where: {
              ruleId: rule.id,
              triggeredAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
            },
          });

          let eventId: string | undefined = recentEvent?.id;

          if (!recentEvent) {
            const newEvent = await prisma.alertEvent.create({
              data: {
                ruleId: rule.id,
                details,
              },
            });
            eventId = newEvent.id;
          }

          results.push({
            ruleId: rule.id,
            service: rule.service,
            condition: rule.condition,
            triggered: true,
            details,
            eventId,
          });
        } else {
          results.push({
            ruleId: rule.id,
            service: rule.service,
            condition: rule.condition,
            triggered: false,
          });
        }
      }
      // Case 2: Metric-based alert (e.g. response_time_ms > threshold)
      else if (rule.metric) {
        const recentMetrics = await prisma.metric.findMany({
          where: {
            service: rule.service,
            name: rule.metric,
            timestamp: { gte: windowStart },
          },
        });

        if (recentMetrics.length > 0) {
          const avgValue =
            recentMetrics.reduce((acc, m) => acc + m.value, 0) / recentMetrics.length;
          const maxVal = Math.max(...recentMetrics.map((m) => m.value));

          // If average or peak exceeded threshold
          if (avgValue >= rule.threshold || maxVal >= rule.threshold) {
            const details = `Alert Triggered: ${rule.service} metric "${rule.metric}" average reached ${avgValue.toFixed(
              1
            )} (peak: ${maxVal.toFixed(1)}) in the last ${rule.windowMinutes}m (Threshold: >= ${rule.threshold})`;

            const recentEvent = await prisma.alertEvent.findFirst({
              where: {
                ruleId: rule.id,
                triggeredAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
              },
            });

            let eventId: string | undefined = recentEvent?.id;

            if (!recentEvent) {
              const newEvent = await prisma.alertEvent.create({
                data: {
                  ruleId: rule.id,
                  details,
                },
              });
              eventId = newEvent.id;
            }

            results.push({
              ruleId: rule.id,
              service: rule.service,
              condition: rule.condition,
              triggered: true,
              details,
              eventId,
            });
          } else {
            results.push({
              ruleId: rule.id,
              service: rule.service,
              condition: rule.condition,
              triggered: false,
            });
          }
        } else {
          results.push({
            ruleId: rule.id,
            service: rule.service,
            condition: rule.condition,
            triggered: false,
          });
        }
      }
    } catch (err) {
      console.error(`Error evaluating rule ${rule.id}:`, err);
    }
  }

  return results;
}
