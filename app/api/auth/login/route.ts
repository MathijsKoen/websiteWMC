import { cookies } from 'next/headers'
import { getIdentityCandidates } from '@/lib/identity'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Vul e-mailadres en wachtwoord in.' }, { status: 400 })
  }

  const identityCandidates = getIdentityCandidates(req)
  let identityRes: Response | null = null

  for (const identityUrl of identityCandidates) {
    const res = await fetch(`${identityUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'password', username: email, password }),
    })

    if (res.ok) {
      identityRes = res
      break
    }

    // Alleen doorproberen bij endpoint/config issues; bij echte auth-fouten stoppen.
    if (res.status !== 404 && res.status !== 502 && res.status !== 503) {
      identityRes = res
      break
    }
  }

  if (!identityRes || !identityRes.ok) {
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
