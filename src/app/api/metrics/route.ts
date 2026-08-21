import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const { service, name, value, timestamp } = body ?? {};

    // Validate service
    if (!service || typeof service !== 'string' || service.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: "service" (must be a non-empty string)' },
        { status: 400 }
      );
    }

    // Validate metric name
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: "name" (must be a non-empty string)' },
        { status: 400 }
      );
    }

    // Validate metric value
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return NextResponse.json(
        { error: 'Missing or invalid required field: "value" (must be a finite number)' },
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

    // Create metric record
    const metric = await prisma.metric.create({
      data: {
        service: service.trim(),
        name: name.trim(),
        value,
        ...(parsedTimestamp ? { timestamp: parsedTimestamp } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: metric,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error ingesting metric entry:', error);
    return NextResponse.json(
      { error: 'Failed to ingest metric entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get('service') || undefined;
    const name = searchParams.get('name') || undefined;
    const orderParam = searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 1000);

    const metrics = await prisma.metric.findMany({
      where: {
        ...(service ? { service } : {}),
        ...(name ? { name } : {}),
      },
      orderBy: {
        timestamp: orderParam,
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
