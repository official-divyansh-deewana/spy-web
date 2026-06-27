import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req) {
  const session = await getSession(req, new Response());
  session.destroy();
  return NextResponse.json({ success: true });
}
