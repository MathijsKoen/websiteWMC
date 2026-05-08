'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { CheckCircle, XCircle } from 'lucide-react'

const RECAPTCHA_SITE_KEY = '6LdRsN0sAAAAAGFkvqPfrrkDKke2tRPLNvWZbLNE'

const KOSTENPLAATSEN = [
  { code: '15', naam: 'Algemeen' },
  { code: '21', naam: 'Nul-groep' },
  { code: '22', naam: 'Ellendam-groep' },
  { code: '23', naam: 'Kinderbaan-groep' },
  { code: '24', naam: 'Marklin-groep' },
  { code: '25', naam: 'N-groep' },
  { code: '27', naam: 'C-Track-groep' },
  { code: '31', naam: 'Gereedschap' },
  { code: '32', naam: 'Drukwerk' },
  { code: '33', naam: 'Lief en Leed' },
  { code: '34', naam: 'BBQ/recepties' },
  { code: '35', naam: 'Website/Multimedia' },
  { code: '41', naam: 'WMCbeurs' },
  { code: '42', naam: 'Modelspoordagen-Alkmaar' },
  { code: '99', naam: 'Overig' },
]

interface FormState {
  naam: string
  email: string
  bedrag: string
  kostenplaats: string
  omschrijving: string
  rekeningnummer: string
}

const initialState: FormState = {
  naam: '',
  email: '',
  bedrag: '',
  kostenplaats: '',
  omschrijving: '',
  rekeningnummer: '',
}

export default function DeclarationForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState & { recaptcha: string; privacy: string }>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const validate = (): boolean => {
    const newErrors: Partial<FormState & { recaptcha: string; privacy: string }> = {}

    if (!form.naam.trim()) newErrors.naam = 'Naam is verplicht'
    if (!form.email.trim()) {
      newErrors.email = 'E-mail is verplicht'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Voer een geldig e-mailadres in'
    }
    if (!form.bedrag.trim()) {
      newErrors.bedrag = 'Bedrag is verplicht'
    } else if (isNaN(parseFloat(form.bedrag.replace(',', '.'))) || parseFloat(form.bedrag.replace(',', '.')) <= 0) {
      newErrors.bedrag = 'Voer een geldig bedrag in (bijv. 12,50)'
    }
    if (!form.kostenplaats) newErrors.kostenplaats = 'Kies een kostenplaats'
    if (!form.omschrijving.trim()) newErrors.omschrijving = 'Omschrijving is verplicht'

    const recaptchaToken = recaptchaRef.current?.getValue() ?? ''
    if (!recaptchaToken) newErrors.recaptcha = 'Bevestig dat u geen robot bent.'

    if (!privacyAccepted) newErrors.privacy = 'Ga akkoord met de privacyverklaring en het regelement.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    setErrorMessage(null)

    try {
      const recaptchaToken = recaptchaRef.current?.getValue() ?? ''

      const response = await fetch('/api/declaratie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naam: form.naam,
          email: form.email,
          bedrag: form.bedrag,
          kostenplaats: form.kostenplaats,
          omschrijving: form.omschrijving,
          rekeningnummer: form.rekeningnummer,
          recaptchaToken,
          privacyAccepted,
        }),
      })

      if (!response.ok) {
        let serverMessage = 'Verzenden mislukt'
        try {
          const data = await response.json()
          if (typeof data?.error === 'string' && data.error.trim()) {
            serverMessage = data.error
          }
        } catch {
          // Use fallback if response body is not JSON.
        }

        throw new Error(serverMessage)
      }

      setStatus('success')
      setForm(initialState)
      setPrivacyAccepted(false)
      recaptchaRef.current?.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Verzenden mislukt')
      recaptchaRef.current?.reset()
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#1a1c1c] mb-2">Declaratie ingediend!</h3>
        <p className="text-gray-600 mb-6">
          Je declaratie is ontvangen en wordt zo snel mogelijk verwerkt door de penningmeester.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 bg-[#cc0000] text-white rounded-lg font-medium hover:bg-red-800 transition"
        >
          Nieuwe declaratie indienen
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-center py-16 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-5">
          <XCircle size={32} className="text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-[#1a1c1c] mb-2">Declaratie niet verzonden</h3>
        <p className="text-gray-600 mb-6">
          {errorMessage ?? 'Er is iets misgegaan. Probeer het opnieuw of neem contact op via e-mail.'}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 bg-[#cc0000] text-white rounded-lg font-medium hover:bg-red-800 transition"
        >
          Opnieuw proberen
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-gray-600 mb-6">
        Vul het formulier volledig in. De penningmeester ontvangt je declaratie per e-mail en neemt
        contact met je op bij vragen. Ook krijg je een bevestiging per mail zodra je declaratie goed is ontvangen en verwerkt.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Naam */}
        <div>
          <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1">
            Naam declarant <span className="text-[#cc0000]">*</span>
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            value={form.naam}
            onChange={handleChange}
            autoComplete="name"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition ${
              errors.naam ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Jan Jansen"
          />
          {errors.naam && <p className="mt-1 text-xs text-red-600">{errors.naam}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-mailadres <span className="text-[#cc0000]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition ${
              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="jan@voorbeeld.nl"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Bedrag */}
        <div>
          <label htmlFor="bedrag" className="block text-sm font-medium text-gray-700 mb-1">
            Bedrag (€) <span className="text-[#cc0000]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
            <input
              id="bedrag"
              name="bedrag"
              type="text"
              inputMode="decimal"
              value={form.bedrag}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition ${
                errors.bedrag ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="12,50"
            />
          </div>
          {errors.bedrag && <p className="mt-1 text-xs text-red-600">{errors.bedrag}</p>}
        </div>

        {/* Te belasten op */}
        <div>
          <label htmlFor="kostenplaats" className="block text-sm font-medium text-gray-700 mb-1">
            Te belasten op <span className="text-[#cc0000]">*</span>
          </label>
          <select
            id="kostenplaats"
            name="kostenplaats"
            value={form.kostenplaats}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition bg-white ${
              errors.kostenplaats ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">— Maak een keuze —</option>
            {KOSTENPLAATSEN.map(({ code, naam }) => (
              <option key={code} value={`${code} - ${naam}`}>
                {code} — {naam}
              </option>
            ))}
          </select>
          {errors.kostenplaats && <p className="mt-1 text-xs text-red-600">{errors.kostenplaats}</p>}
        </div>

        {/* Omschrijving */}
        <div>
          <label htmlFor="omschrijving" className="block text-sm font-medium text-gray-700 mb-1">
            Omschrijving <span className="text-[#cc0000]">*</span>
          </label>
          <textarea
            id="omschrijving"
            name="omschrijving"
            rows={3}
            value={form.omschrijving}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition resize-none ${
              errors.omschrijving ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Beschrijf kort waarvoor de declaratie is..."
          />
          {errors.omschrijving && <p className="mt-1 text-xs text-red-600">{errors.omschrijving}</p>}
        </div>

        {/* Rekeningnummer */}
        <div>
          <label htmlFor="rekeningnummer" className="block text-sm font-medium text-gray-700 mb-1">
            Rekeningnummer (IBAN){' '}
            <span className="text-gray-400 font-normal text-xs">
              — niet verplicht bij eerdere declaraties
            </span>
          </label>
          <input
            id="rekeningnummer"
            name="rekeningnummer"
            type="text"
            value={form.rekeningnummer}
            onChange={handleChange}
            autoComplete="off"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent transition uppercase"
            placeholder="NL00 BANK 0000 0000 00"
          />
        </div>

        {/* reCAPTCHA */}
        <div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            hl="nl"
          />
          {errors.recaptcha && (
            <p className="mt-1 text-xs text-red-600">{errors.recaptcha}</p>
          )}
        </div>

        {/* Juridische akkoordverklaring */}
        <div className={`rounded-lg border p-3 ${errors.privacy ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked)
                if (errors.privacy) {
                  setErrors((prev) => ({ ...prev, privacy: undefined }))
                }
              }}
              className="mt-1"
            />
            <span className="text-sm text-gray-700 leading-6">
              Ik ga akkoord met de{' '}
              <Link href="/privacy" className="text-[#cc0000] hover:underline font-medium" target="_blank">
                privacyverklaring
              </Link>{' '}
              en het{' '}
              <Link href="/regelement" className="text-[#cc0000] hover:underline font-medium" target="_blank">
                huishoudelijk regelement
              </Link>{' '}
              van De WMC.
            </span>
          </label>
          {errors.privacy && <p className="mt-2 text-xs text-red-600">{errors.privacy}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full sm:w-auto px-8 py-3 bg-[#cc0000] text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Verzenden...' : 'Declaratie indienen'}
          </button>
        </div>
      </form>
    </div>
  )
}
