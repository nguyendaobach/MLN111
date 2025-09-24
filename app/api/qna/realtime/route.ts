import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/qa-database';

export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Gửi initial connection message
      const data = `data: ${JSON.stringify({ type: 'CONNECTED', message: 'Real-time connection established' })}\n\n`;
      controller.enqueue(encoder.encode(data));

      // Subscribe to database changes
      const unsubscribe = addSubscriber((update) => {
        const data = `data: ${JSON.stringify(update)}\n\n`;
        controller.enqueue(encoder.encode(data));
      });

      // Cleanup function
      return () => {
        unsubscribe();
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}