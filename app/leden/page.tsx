'use client'

import { useEffect, useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import type { MemberAnnouncement, MemberDocument } from '@/lib/contentful/types'
import MemberLoginForm from '../../components/sections/MemberLoginForm'
import MemberPortal from '../../components/sections/MemberPortal'

interface PortalData {
  announcements: MemberAnnouncement[]
  documents: MemberDocument[]
}

type AuthState = 'loading' | 'loggedOut' | 'loggedIn' | 'acceptInvite'

export default function LedenPage() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [inviteToken, setInviteToken] = useState('')
  const [portalData, setPortalData] = useState<PortalData>({ announcements: [], documents: [] })
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#/, '')

    const parseHashValue = (key: string) => {
      if (!rawHash) return ''
      for (const pair of rawHash.split('&')) {
        const [k, ...valueParts] = pair.split('=')
        if (k === key) {
          const value = valueParts.join('=')
          try {
            return decodeURIComponent(value)
          } catch {
            return value
          }
        }
      }
      return ''
    }

    const token =
      parseHashValue('invite_token') ||
      parseHashValue('confirmation_token') ||
      parseHashValue('token') ||
      parseHashValue('access_token') ||
      (rawHash && !rawHash.includes('=') ? decodeURIComponent(rawHash) : '')

    if (token) {
      setInviteToken(token)
      setAuthState('acceptInvite')
      return
    }

    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) {
          setAuthState('loggedIn')
          fetchPortalData()
        } else {
          setAuthState('loggedOut')
        }
      })
      .catch(() => setAuthState('loggedOut'))
  }, [])

  const fetchPortalData = async () => {
    setDataLoading(true)
    try {
      const [announcementsRes, documentsRes] = await Promise.all([
        fetch('/api/member/announcements'),
        fetch('/api/member/documents'),
      ])
      const announcements = announcementsRes.ok ? await announcementsRes.json() : []
      const documents = documentsRes.ok ? await documentsRes.json() : []
      setPortalData({ announcements, documents })
    } catch {
      setPortalData({ announcements: [], documents: [] })
    } finally {
      setDataLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setAuthState('loggedIn')
    fetchPortalData()
  }

  const handleLogout = () => {
    setAuthState('loggedOut')
    setPortalData({ announcements: [], documents: [] })
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="w-8 h-8 border-4 border-[#cc0000] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authState === 'acceptInvite') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#f0f0f0] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#cc0000] rounded mb-4">
              <Lock className="text-white" size={18} />
            </div>
            <h1
              className="font-black text-3xl tracking-tighter text-[#1a1c1c] mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Account instellen
            </h1>
            <p className="text-gray-600 text-sm">Kies een wachtwoord voor uw account</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <AcceptInviteForm
                token={inviteToken}
                onSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (authState === 'loggedOut') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#f0f0f0] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#cc0000] rounded mb-4">
              <Lock className="text-white" size={18} />
            </div>
            <h1
              className="font-black text-3xl tracking-tighter text-[#1a1c1c] mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Ledenportaal
            </h1>
            <p className="text-gray-600 text-sm">De WMC</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              <MemberLoginForm
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                isLoggedIn={false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <h1
            className="font-black text-3xl tracking-tighter text-[#1a1c1c]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ledenportaal
          </h1>
          <MemberLoginForm
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            isLoggedIn={true}
          />
        </div>

        {dataLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-[#cc0000] border-t-transparent rounded-full" />
            </div>
            <p className="text-gray-600 mt-4">Laden...</p>
          </div>
        ) : (
          <MemberPortal
            announcements={portalData.announcements}
            documents={portalData.documents}
          />
        )}
      </div>
    </section>
  )
}

function AcceptInviteForm({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens zijn.')
      return
    }
    if (password !== passwordConfirm) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        const detailText = data?.details ? ` (${data.details})` : ''
        setError(`${data.error ?? 'Er is iets misgegaan.'}${detailText}`)
      } else {
        // Na succesvolle activatie verwijderen we de token uit de URL
        window.history.replaceState(null, '', window.location.pathname)
        onSuccess()
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-5">
        <label htmlFor="password" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          Nieuw wachtwoord
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent pr-12 disabled:bg-gray-50 transition text-gray-900"
            placeholder="Minimaal 8 tekens"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          Wachtwoord bevestigen
        </label>
        <input
          id="passwordConfirm"
          type={showPassword ? 'text' : 'password'}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent disabled:bg-gray-50 transition text-gray-900"
          placeholder="Herhaal wachtwoord"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-[#cc0000] text-white font-semibold rounded-lg hover:bg-[#b30000] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Even geduld...' : 'Account activeren'}
      </button>
    </form>
  )
}
