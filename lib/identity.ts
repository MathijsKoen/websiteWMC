import type { NextRequest } from 'next/server'

function normalizeIdentityUrl(baseUrl: string) {
  const trimmed = baseUrl.trim().replace(/\/+$/, '')
  if (!trimmed) return ''

  if (trimmed.includes('/.netlify/identity')) {
    return trimmed.replace(/\/+$/, '')
  }

  return `${trimmed}/.netlify/identity`
}

function addIfValid(set: Set<string>, value?: string | null) {
  if (!value) return
  const normalized = normalizeIdentityUrl(value)
  if (normalized) set.add(normalized)
}

export function getIdentityCandidates(req?: NextRequest) {
  const candidates = new Set<string>()

  const configured = process.env.NETLIFY_IDENTITY_URL
  if (configured) {
    for (const part of configured.split(',')) {
      addIfValid(candidates, part)
    }
  }

  addIfValid(candidates, process.env.URL)
  addIfValid(candidates, process.env.DEPLOY_PRIME_URL)

  if (req) {
    addIfValid(candidates, req.nextUrl.origin)

    const forwardedProto = req.headers.get('x-forwarded-proto') || 'https'
    const forwardedHost = req.headers.get('x-forwarded-host')
    if (forwardedHost) {
      addIfValid(candidates, `${forwardedProto}://${forwardedHost}`)
    }
  }

  return Array.from(candidates)
}
