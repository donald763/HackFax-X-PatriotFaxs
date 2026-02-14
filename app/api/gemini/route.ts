import { NextResponse } from 'next/server';
import { forwardToGemini } from '../../../lib/gemini';

// Server-side API route that proxies requests to the external Gemini API.
// This route requires an Authorization header with the internal token:
//   Authorization: Bearer <INTERNAL_API_TOKEN>

export async function POST(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const expected = `Bearer ${process.env.INTERNAL_API_TOKEN}`;

  if (!process.env.INTERNAL_API_TOKEN) {
    return new NextResponse('Server not configured: missing INTERNAL_API_TOKEN', { status: 500 });
  }

  if (auth !== expected) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch (e) {
    return new NextResponse('Invalid JSON body', { status: 400 });
  }

  try {
    const result = await forwardToGemini(body);
    return NextResponse.json(result);
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    const status = err?.status ?? 500;
    return new NextResponse(message, { status });
  }
}
