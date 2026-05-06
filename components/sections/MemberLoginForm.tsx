'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogOut } from 'lucide-react'

interface MemberLoginFormProps {
  onLoginSuccess: () => void
  onLogout: () => void
  isLoggedIn: boolean
}

export default function MemberLoginForm({ onLoginSuccess, onLogout, isLoggedIn }: MemberLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    setError('')
    setIsLoading(true)

    if (!email.trim() || !password.trim()) {
      setError('Vul alstublieft uw e-mailadres en wachtwoord in.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Inloggen mislukt.')
      } else {
        onLoginSuccess()
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setEmail('')
    setPassword('')
    setError('')
    onLogout()
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-[#cc0000] text-white rounded-md hover:bg-[#b30000] transition font-medium"
        >
          <LogOut size={16} />
          Uitloggen
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="w-full">
      <div className="mb-5">
        <label htmlFor="email" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent disabled:bg-gray-50 transition text-gray-900"
          placeholder="naam@voorbeeld.nl"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-semibold text-[#1a1c1c] mb-2">
          Wachtwoord
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent pr-12 disabled:bg-gray-50 transition text-gray-900"
            placeholder="••••••••"
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
        {isLoading ? 'Even geduld...' : 'Inloggen'}
      </button>
    </form>
  )
}
