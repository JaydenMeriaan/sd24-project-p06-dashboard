import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail en wachtwoord zijn verplicht' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Gebruiker niet gevonden' }, { status: 404 })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return NextResponse.json({ error: 'Onjuiste inloggegevens' }, { status: 401 })

    const isProduction = process.env.NODE_ENV === 'production'
    const cookieValue = Buffer.from(String(user.id)).toString('base64')
    const cookie = `token=${cookieValue}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${
      isProduction ? '; Secure' : ''
    }`

    const res = NextResponse.json({ message: 'Inloggen succesvol' }, { status: 200 })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}
