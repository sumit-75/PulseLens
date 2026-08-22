import { NextResponse } from 'next/server';
import { evaluateAllAlertRules } from '@/lib/alerts/checker';

export async function POST() {
  try {
    const results = await evaluateAllAlertRules();
    const triggeredCount = results.filter((r) => r.triggered).length;

    return NextResponse.json({
      success: true,
      evaluatedRulesCount: results.length,
      triggeredIncidentsCount: triggeredCount,
      results,
    });
  } catch (error) {
    console.error('Error running alert checks:', error);
    return NextResponse.json({ error: 'Failed to run alert checks' }, { status: 500 });
  }
}
