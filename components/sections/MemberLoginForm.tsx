'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogOut, Lock } from 'lucide-react'
import type { MemberAnnouncement, MemberDocument } from '@/lib/contentful/types'

interface MemberLoginFormProps {
  onLoginSuccess: (data: { announcements: MemberAnnouncement[]; documents: MemberDocument[] }) => void
  onLogout: () => void
  isLoggedIn: boolean
  announcements?: MemberAnnouncement[]
  documents?: MemberDocument[]
}

// CONFIGURATIE - Pas deze waarden aan voor je klant
const MEMBER_CONFIG = {
  username: 'WMC', // Gemeenschappelijke gebruikersnaam
  password: '1723HX', // Postcode als wachtwoord
}

export default function MemberLoginForm({
  onLoginSuccess,
  onLogout,
  isLoggedIn,
  announcements = [],
  documents = [],
}: MemberLoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    setError('')
    setIsLoading(true)

    // Valideer inloggegevens
    if (!username.trim() || !password.trim()) {
      setError('Vul alstublieft uw naam en postcode in.')
      setIsLoading(false)
      return
    }

    // Simuleer login delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Check gegevens
    if (username === MEMBER_CONFIG.username && password === MEMBER_CONFIG.password) {
      // Login succesvol
      localStorage.setItem('memberLoggedIn', 'true')
      localStorage.setItem('memberUsername', username)
      onLoginSuccess({ announcements, documents })
    } else if (username !== MEMBER_CONFIG.username) {
      setError('De ingevoerde gebruikersnaam is onjuist.')
    } else {
      setError('De ingevoerde postcode is onjuist.')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setUsername('')
    setPassword('')
    setError('')
    localStorage.removeItem('memberLoggedIn')
    localStorage.removeItem('memberUsername')
    onLogout()
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
        >
          <LogOut size={16} />
          Uitloggen
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Username */}
      <div className="mb-5">
        <label htmlFor="username" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          Gebruikersnaam
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent disabled:bg-gray-50 transition text-gray-900"
          placeholder="wmc"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          Postcode
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent pr-12 disabled:bg-gray-50 transition text-gray-900"
            placeholder="Bijv. 1723 HX"
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

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        onClick={handleLogin}
        className="w-full px-4 py-3 bg-[#cc0000] text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Even geduld...' : 'Inloggen'}
      </button>
    </div>
  )
}
