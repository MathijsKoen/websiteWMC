import { cookies } from 'next/headers'
import { createSessionToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Vul gebruikersnaam en wachtwoord in.' }, { status: 400 })
  }

  const validUsername = process.env.MEMBER_USERNAME
  const validPassword = process.env.MEMBER_PASSWORD

  if (!validUsername || !validPassword) {
    console.error('[login] MEMBER_USERNAME or MEMBER_PASSWORD env var not set')
    return NextResponse.json({ error: 'Inloggen is niet geconfigureerd.' }, { status: 500 })
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: 'Ongeldig gebruikersnaam of wachtwoord.' }, { status: 401 })
  }

  const token = await createSessionToken()

  const cookieStore = await cookies()
  cookieStore.set('member_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  })

  return NextResponse.json({ success: true })
}
