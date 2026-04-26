import { NextResponse } from 'next/server';
import { validateEnvVars } from '@/lib/env';

export const runtime = 'edge';

export async function GET() {
  try {
    // Check environment variables
    validateEnvVars();

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime ? process.uptime() : 0,
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
