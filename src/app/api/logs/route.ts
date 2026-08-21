import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_LEVELS = ['info', 'warn', 'error'] as const;
type ValidLevel = (typeof VALID_LEVELS)[number];

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload in request body' },
        { status: 400 }
      );
    }

    const { service, level, message, timestamp } = body ?? {};

    // Validate service
    if (!service || typeof service !== 'string' || service.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: "service" (must be a non-empty string)' },
        { status: 400 }
      );
    }

    // Validate level
    if (!level || typeof level !== 'string' || !VALID_LEVELS.includes(level.toLowerCase() as ValidLevel)) {
      return NextResponse.json(
        {
          error: `Invalid "level": expected one of [${VALID_LEVELS.join(', ')}], received "${level}"`,
        },
        { status: 400 }
      );
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: "message" (must be a non-empty string)' },
        { status: 400 }
      );
    }

    // Optional timestamp parsing
    let parsedTimestamp: Date | undefined;
    if (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return NextResponse.json(
          { error: 'Invalid "timestamp" format, must be a valid ISO date string or timestamp' },
          { status: 400 }
        );
      }
      parsedTimestamp = date;
    }

    // Create log record
    const log = await prisma.log.create({
      data: {
        service: service.trim(),
        level: level.toLowerCase().trim(),
        message: message.trim(),
        ...(parsedTimestamp ? { timestamp: parsedTimestamp } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: log,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating log entry:', error);
    return NextResponse.json(
      { error: 'Failed to ingest log entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service') || undefined;
    const level = searchParams.get('level') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const logs = await prisma.log.findMany({
      where: {
        ...(service ? { service } : {}),
        ...(level ? { level } : {}),
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
