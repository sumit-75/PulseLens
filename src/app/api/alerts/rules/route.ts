import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service') || undefined;

    const rules = await prisma.alertRule.findMany({
      where: {
        ...(service ? { service } : {}),
      },
      include: {
        events: {
          orderBy: { triggeredAt: 'desc' },
          take: 3,
        },
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    console.error('Error fetching alert rules:', error);
    return NextResponse.json({ error: 'Failed to fetch alert rules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, metric, logLevel, threshold, windowMinutes } = body ?? {};

    if (!service || typeof service !== 'string' || service.trim() === '') {
      return NextResponse.json(
        { error: 'Missing required field: "service"' },
        { status: 400 }
      );
    }

    if (!metric && !logLevel) {
      return NextResponse.json(
        { error: 'Must specify either "metric" name or "logLevel" (error | warn)' },
        { status: 400 }
      );
    }

    const numThreshold = Number(threshold);
    if (isNaN(numThreshold) || numThreshold <= 0) {
      return NextResponse.json(
        { error: 'Threshold must be a positive number' },
        { status: 400 }
      );
    }

    const numWindow = Number(windowMinutes);
    if (isNaN(numWindow) || numWindow <= 0) {
      return NextResponse.json(
        { error: 'WindowMinutes must be a positive integer (e.g. 5, 10, 15)' },
        { status: 400 }
      );
    }

    // Auto-generate human-readable condition description
    const condition = logLevel
      ? `${service} ${logLevel.toUpperCase()} logs >= ${numThreshold} in ${numWindow}m`
      : `${service} "${metric}" value >= ${numThreshold} in ${numWindow}m`;

    const rule = await prisma.alertRule.create({
      data: {
        service: service.trim(),
        metric: metric ? metric.trim() : null,
        logLevel: logLevel ? logLevel.toLowerCase().trim() : null,
        condition,
        threshold: numThreshold,
        windowMinutes: Math.round(numWindow),
        enabled: true,
      },
    });

    return NextResponse.json({ success: true, data: rule }, { status: 201 });
  } catch (error) {
    console.error('Error creating alert rule:', error);
    return NextResponse.json({ error: 'Failed to create alert rule' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, enabled } = body ?? {};

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Missing required field: "id"' }, { status: 400 });
    }

    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Field "enabled" must be boolean' }, { status: 400 });
    }

    const updated = await prisma.alertRule.update({
      where: { id },
      data: { enabled },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating alert rule status:', error);
    return NextResponse.json({ error: 'Failed to update alert rule' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing query parameter: "id"' }, { status: 400 });
    }

    await prisma.alertRule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Alert rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert rule:', error);
    return NextResponse.json({ error: 'Failed to delete alert rule' }, { status: 500 });
  }
}
