import { cookies } from 'next/headers'
import { getIdentityCandidates } from '@/lib/identity'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('member_token')?.value
  if (!token) return null

  const identityCandidates = getIdentityCandidates()

  for (const identityUrl of identityCandidates) {
    try {
      const res = await fetch(`${identityUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })

      if (res.ok) {
        return res.json()
      }
    } catch {
      // Probeer de volgende identity-url kandidaat.
    }
  }

  return null
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('member_token')?.value ?? null
}
