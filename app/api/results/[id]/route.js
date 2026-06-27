import { db } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(req, { params }) {
  const session = await getSession(req, new Response());
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  const link = await db.hgetall(`link:${id}`);
  if (!link || link.userId !== session.user.username) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const results = link.results ? JSON.parse(link.results) : [];
  return NextResponse.json({ ...link, results });
}
