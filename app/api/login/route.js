import { db } from '@/lib/kv';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await db.hgetall(`user:${username}`);
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const session = await getSession(req, new Response());
  session.user = { username };
  await session.save();
  return NextResponse.json({ success: true });
}
