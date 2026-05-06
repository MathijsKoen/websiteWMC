import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const IDENTITY_URL = process.env.NETLIFY_IDENTITY_URL!

function normalizeIdentityUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, '')
}

function getIdentityCandidates(req: NextRequest) {
  const candidates = new Set<string>()

  if (process.env.NETLIFY_IDENTITY_URL) {
    candidates.add(normalizeIdentityUrl(process.env.NETLIFY_IDENTITY_URL))
  }

  candidates.add(normalizeIdentityUrl(`${req.nextUrl.origin}/.netlify/identity`))

  const forwardedHost = req.headers.get('x-forwarded-host')
  if (forwardedHost) {
    candidates.add(normalizeIdentityUrl(`https://${forwardedHost}/.netlify/identity`))
  }

  return Array.from(candidates)
}

export async function POST(req: NextRequest) {
  const { token: rawToken, password } = await req.json()
  const token = String(rawToken ?? '').trim().replace(/^#/, '')

  if (!token || !password) {
    return NextResponse.json({ error: 'Token en wachtwoord zijn verplicht.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Wachtwoord moet minimaal 8 tekens zijn.' }, { status: 400 })
  }

  const identityCandidates = getIdentityCandidates(req)
  const verifyTypes = ['invite', 'signup']

  let verifiedEmail = ''
  let usedIdentityUrl = IDENTITY_URL
  let verifyError = ''

  for (const identityUrl of identityCandidates) {
    for (const verifyType of verifyTypes) {
      const verifyRes = await fetch(`${identityUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, type: verifyType, password }),
      })

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json()
        verifiedEmail = verifyData.email
        usedIdentityUrl = identityUrl
        console.info('[accept-invite] verify success', {
          identityUrl,
          verifyType,
          email: verifiedEmail,
        })
        break
      }

      try {
        verifyError = await verifyRes.text()
      } catch {
        verifyError = 'Onbekende fout bij verificatie.'
      }

      console.warn('[accept-invite] verify failed', {
        identityUrl,
        verifyType,
        status: verifyRes.status,
        body: verifyError,
      })
    }

    if (verifiedEmail) break
  }

  if (!verifiedEmail) {
    console.error('[accept-invite] all verify attempts failed', {
      identityCandidates,
      verifyTypes,
      tokenLength: token.length,
      verifyError,
    })

    return NextResponse.json(
      {
        error: 'Uitnodiging is ongeldig of verlopen.',
        details: verifyError || 'Geen details beschikbaar.',
      },
      { status: 400 }
    )
  }

  // Automatisch inloggen na accepteren
  const tokenRes = await fetch(`${usedIdentityUrl}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', username: verifiedEmail, password }),
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
