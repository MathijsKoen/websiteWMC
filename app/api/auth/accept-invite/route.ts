import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const IDENTITY_URL = process.env.NETLIFY_IDENTITY_URL!

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: 'Token en wachtwoord zijn verplicht.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Wachtwoord moet minimaal 8 tekens zijn.' }, { status: 400 })
  }

  const verifyRes = await fetch(`${IDENTITY_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, type: 'invite', password }),
  })

  if (!verifyRes.ok) {
    return NextResponse.json({ error: 'Uitnodiging is ongeldig of verlopen.' }, { status: 400 })
  }

  const { email } = await verifyRes.json()

  // Automatisch inloggen na accepteren
  const tokenRes = await fetch(`${IDENTITY_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', username: email, password }),
  })

  if (tokenRes.ok) {
    const { access_token, expires_in } = await tokenRes.json()
    const cookieStore = await cookies()
    cookieStore.set('member_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in,
      path: '/',
    })
  }

  return NextResponse.json({ success: true })
}
