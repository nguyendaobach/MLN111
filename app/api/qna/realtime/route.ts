import { NextRequest, NextResponse } from 'next/server';

// Disable static generation for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  // Simple polling endpoint instead of SSE for better Vercel compatibility
  return NextResponse.json({ 
    success: true, 
    message: 'Real-time polling endpoint',
    timestamp: new Date().toISOString()
  });
}