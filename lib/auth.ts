import { cookies } from 'next/headers'

const IDENTITY_URL = process.env.NETLIFY_IDENTITY_URL!

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('member_token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${IDENTITY_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('member_token')?.value ?? null
}
