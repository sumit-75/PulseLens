import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Get distinct service names from logs and metrics
    const logServices = await prisma.log.findMany({
      select: { service: true, timestamp: true },
      distinct: ['service'],
      orderBy: { timestamp: 'desc' },
    });

    const metricServices = await prisma.metric.findMany({
      select: { service: true, timestamp: true },
      distinct: ['service'],
      orderBy: { timestamp: 'desc' },
    });

    // Merge unique service names
    const serviceMap = new Map<string, { service: string; lastSeen: Date; logCount?: number }>();

    for (const item of logServices) {
      serviceMap.set(item.service, {
        service: item.service,
        lastSeen: item.timestamp,
      });
    }

    for (const item of metricServices) {
      const existing = serviceMap.get(item.service);
      if (!existing || item.timestamp > existing.lastSeen) {
        serviceMap.set(item.service, {
          service: item.service,
          lastSeen: item.timestamp,
        });
      }
    }

    const services = Array.from(serviceMap.values()).sort(
      (a, b) => b.lastSeen.getTime() - a.lastSeen.getTime()
    );

    // 2. Aggregate stats: Total logs, errors in last 1 hour, warnings in last 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [totalLogs, errorCount1h, warnCount1h, totalMetrics] = await Promise.all([
      prisma.log.count(),
      prisma.log.count({
        where: {
          level: 'error',
          timestamp: { gte: oneHourAgo },
        },
      }),
      prisma.log.count({
        where: {
          level: 'warn',
          timestamp: { gte: oneHourAgo },
        },
      }),
      prisma.metric.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        services,
        stats: {
          totalLogs,
          totalMetrics,
          errorCount1h,
          warnCount1h,
          activeServicesCount: services.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching services summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services summary' },
      { status: 500 }
    );
  }
}
