// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
      return NextResponse.json({ user: null });
    }

    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

    let userId: string | null = null;

    // Support two token formats: signed JWT or legacy base64(userId)
    if (token.includes('.')) {
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        if (payload && typeof payload === 'object' && payload.id) {
          userId = String(payload.id);
        }
      } catch (error) {
        console.log('Invalid JWT token in /api/auth/me:', error);
      }
    }

    if (!userId) {
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        if (decoded) userId = decoded;
      } catch (err) {
        // ignore
      }
    }

    if (!userId) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) return NextResponse.json({ user: null });

    const emailNorm = (user.email || '').trim().toLowerCase();
    const hash = crypto.createHash('md5').update(emailNorm).digest('hex');
    const avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=128`;

    return NextResponse.json({ user: { ...user, avatarUrl } });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
