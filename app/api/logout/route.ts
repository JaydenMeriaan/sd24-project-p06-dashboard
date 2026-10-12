import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const cookie = `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProduction ? '; Secure' : ''}`
    const res = NextResponse.json({ message: 'Uitgelogd' }, { status: 200 })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}
