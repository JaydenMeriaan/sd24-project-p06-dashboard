import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body || {}

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Alle velden zijn verplicht' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'E-mail is al geregistreerd' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
      select: { id: true, name: true, email: true },
    })

    const res = NextResponse.json({ message: 'Account succesvol aangemaakt', user }, { status: 201 })
    return res
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}
