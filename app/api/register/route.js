import { db } from '@/lib/redis';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const existing = await db.hgetall(`user:${username}`);
  if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
  const hash = await bcrypt.hash(password, 10);
  await db.hset(`user:${username}`, { password: hash });
  return NextResponse.json({ success: true });
}
