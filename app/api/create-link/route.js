import { db } from '@/lib/redis';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const res = new NextResponse();
  const session = await getSession(req, res);
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { destUrl } = await req.json();
  if (!destUrl || !destUrl.startsWith('http')) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  const linkId = uuidv4().slice(0, 8);
  const linkData = {
    userId: session.user.username,
    destUrl,
    createdAt: new Date().toISOString(),
    results: JSON.stringify([]), // Redis stores strings, array rakhna hai to JSON string
  };
  await db.hset(`link:${linkId}`, linkData);
  await db.lpush(`user:${session.user.username}:links`, linkId);
  return NextResponse.json({ linkId, url: `${process.env.BASE_URL}/c/${linkId}` });
}
