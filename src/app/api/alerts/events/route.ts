import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get('ruleId') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const events = await prisma.alertEvent.findMany({
      where: {
        ...(ruleId ? { ruleId } : {}),
      },
      include: {
        rule: {
          select: {
            service: true,
            condition: true,
            logLevel: true,
            metric: true,
            threshold: true,
            windowMinutes: true,
          },
        },
      },
      orderBy: { triggeredAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching alert events:', error);
    return NextResponse.json({ error: 'Failed to fetch alert events' }, { status: 500 });
  }
}
