import { db } from '@/lib/kv';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(req) {
  const session = await getSession(req, new Response());
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const linkIds = await db.lrange(`user:${session.user.username}:links`, 0, -1);
  const links = [];
  for (const id of linkIds) {
    const link = await db.hgetall(`link:${id}`);
    links.push({ id, ...link, results: link.results ? JSON.parse(link.results) : [] });
  }
  return NextResponse.json(links);
}
