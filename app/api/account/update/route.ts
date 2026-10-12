import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (!tokenCookie) {
      return NextResponse.json({ error: 'Niet geauthenticeerd' }, { status: 401 });
    }

    const token = tokenCookie.value;
    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Ongeldige token' }, { status: 401 });
    }

    if (!payload || typeof payload !== 'object' || !payload.id) {
      return NextResponse.json({ error: 'Ongeldige token-payload' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, currentPassword } = body || {};

    if (!name || !email) {
      return NextResponse.json({ error: 'Naam en e-mail zijn verplicht' }, { status: 400 });
    }

    // If email is changed, ensure not colliding with other user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== payload.id) {
      return NextResponse.json({ error: 'E-mail is al in gebruik' }, { status: 409 });
    }

    const dataToUpdate: any = { name, email };

    if (password) {
      // require currentPassword to change password
      if (!currentPassword) {
        return NextResponse.json({ error: 'Huidig wachtwoord is vereist om te wijzigen' }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!dbUser) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 });

      const ok = await bcrypt.compare(currentPassword, dbUser.password);
      if (!ok) {
        return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 401 });
      }

      const hashed = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashed;
    }

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: dataToUpdate,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ message: 'Account bijgewerkt', user });
  } catch (err) {
    console.error('Error in /api/account/update:', err);
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 });
  }
}
