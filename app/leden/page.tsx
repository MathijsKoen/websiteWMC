'use client'

import { useEffect, useState } from 'react'
import { Lock } from 'lucide-react'
import type { MemberAnnouncement, MemberDocument } from '@/lib/contentful/types'
import MemberLoginForm from '../../components/sections/MemberLoginForm'
import MemberPortal from '../../components/sections/MemberPortal'

interface PortalData {
  announcements: MemberAnnouncement[]
  documents: MemberDocument[]
}

type AuthState = 'loading' | 'loggedOut' | 'loggedIn'

export default function LedenPage() {
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [portalData, setPortalData] = useState<PortalData>({ announcements: [], documents: [] })
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
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
