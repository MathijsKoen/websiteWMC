import type { Metadata } from 'next'
import { Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ledenportaal',
  description: 'Exclusief ledenportaal van De Westfriese Modelspoor Club.',
}

export default function LedenPage() {
  return (
    <>
      <section className="bg-[#f9f9f9] py-32 flex items-center justify-center">
        <div className="max-w-sm w-full mx-auto px-6">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#cc0000] flex items-center justify-center">
              <Lock size={28} className="text-white" />
            </div>
          </div>

          <h1
            className="font-black text-3xl tracking-tighter text-center text-[#1a1c1c] mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ledenportaal
          </h1>
          <p className="text-center text-[#926e69] text-sm mb-8">
            Exclusief voor leden van De WMC
          </p>

          {/* Note: Login form to be implemented with auth solution */}
          <div className="bg-white border border-[#e2e2e2] p-6 text-center">
            <p className="text-sm text-[#4d4c4c] leading-relaxed">
              Het ledenportaal is momenteel in ontwikkeling.
              Neem contact op via{' '}
              <a href="mailto:info@dewmc.nl" className="text-[#cc0000] font-bold hover:underline">
                info@dewmc.nl
              </a>{' '}
              voor toegang tot ledeninformatie.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
