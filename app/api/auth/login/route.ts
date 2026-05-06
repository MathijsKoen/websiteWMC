import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const IDENTITY_URL = process.env.NETLIFY_IDENTITY_URL!

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Vul e-mailadres en wachtwoord in.' }, { status: 400 })
  }

  const identityRes = await fetch(`${IDENTITY_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', username: email, password }),
  })

  if (!identityRes.ok) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres of wachtwoord.' }, { status: 401 })
  }

  const { access_token, expires_in } = await identityRes.json()

  const cookieStore = await cookies()
  cookieStore.set('member_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expires_in,
    path: '/',
  })

  return NextResponse.json({ success: true })
}
