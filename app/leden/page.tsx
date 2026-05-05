'use client'

import { useEffect, useState } from 'react'
import type { MemberAnnouncement, MemberDocument } from '@/lib/contentful/types'
import MemberLoginForm from '@/components/sections/MemberLoginForm'
import MemberPortal from '@/components/sections/MemberPortal'

interface PortalData {
  announcements: MemberAnnouncement[]
  documents: MemberDocument[]
}

export default function LedenPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [portalData, setPortalData] = useState<PortalData>({ announcements: [], documents: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('memberLoggedIn') === 'true'
    const storedUsername = localStorage.getItem('memberUsername')
    setIsLoggedIn(loggedIn)
    if (loggedIn && storedUsername) {
      setUsername(storedUsername)
      fetchPortalData()
    }
    setIsLoading(false)
  }, [])

  const fetchPortalData = async () => {
    try {
      setIsLoading(true)
      const [announcementsRes, documentsRes] = await Promise.all([
        fetch('/api/member/announcements'),
        fetch('/api/member/documents'),
      ])

      if (!announcementsRes.ok || !documentsRes.ok) {
        throw new Error('Failed to fetch portal data')
      }

      const announcements = await announcementsRes.json()
      const documents = await documentsRes.json()

      setPortalData({ announcements, documents })
    } catch (error) {
      console.error('Error fetching portal data:', error)
      setPortalData({ announcements: [], documents: [] })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = async (data: PortalData) => {
    setIsLoggedIn(true)
    setPortalData(data)
    // Fetch fresh data
    await fetchPortalData()
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setPortalData({ announcements: [], documents: [] })
    setUsername('')
  }

  return (
    <>
      {!isLoggedIn ? (
        // LOGIN PAGE - Full screen, non-scrollable
        <div className="min-h-screen bg-gradient-to-br from-[#f9f9f9] to-[#f0f0f0] flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#cc0000] rounded mb-4">
                <span className="text-white text-lg">▪</span>
              </div>
              <h1
                className="font-black text-3xl tracking-tighter text-[#1a1c1c] mb-2"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Ledenportaal
              </h1>
              <p className="text-gray-600 text-sm">De WMC</p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-8">
                <MemberLoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onLogout={handleLogout}
                  isLoggedIn={isLoggedIn}
                  announcements={portalData.announcements}
                  documents={portalData.documents}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // PORTAL CONTENT
        <section className="bg-white min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Welcome header with logout button */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h1
                  className="font-black text-3xl tracking-tighter text-[#1a1c1c]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Ledenportaal
                </h1>
              </div>
              <MemberLoginForm
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                announcements={portalData.announcements}
                documents={portalData.documents}
              />
            </div>

            {/* Portal Content */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin">
                  <div className="w-8 h-8 border-4 border-[#cc0000] border-t-transparent rounded-full"></div>
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
      )}
    </>
  )
}
