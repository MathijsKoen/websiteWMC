import { cookies } from 'next/headers'

const SESSION_DURATION = 8 * 60 * 60 // 8 hours in seconds

async function getSecret(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET ?? 'dev-secret-change-me'
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  return key
}

export async function createSessionToken(): Promise<string> {
  const payload = btoa(JSON.stringify({ iat: Math.floor(Date.now() / 1000) }))
  const key = await getSecret()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${payload}.${sigB64}`
}

async function verifySessionToken(token: string): Promise<boolean> {
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return false

  const payload = token.slice(0, dotIndex)
  const sigB64 = token.slice(dotIndex + 1)

  try {
    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0))
    const key = await getSecret()
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payload))
    if (!valid) return false

    const { iat } = JSON.parse(atob(payload))
    const age = Math.floor(Date.now() / 1000) - iat
    return age < SESSION_DURATION
  } catch {
    return false
  }
}

export async function getSessionUser(): Promise<{ username: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('member_token')?.value
  if (!token) return null

  const valid = await verifySessionToken(token)
  if (!valid) return null

  return { username: process.env.MEMBER_USERNAME ?? 'leden' }
}

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('member_token')?.value ?? null
}
