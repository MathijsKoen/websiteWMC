import Link from 'next/link'
import { ArrowLeft, Train } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="bg-[#f9f9f9] min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 text-center">
        <div
          className="font-black text-[120px] leading-none tracking-tighter text-[#e2e2e2] mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          404
        </div>
        <div className="flex justify-center mb-6">
          <Train size={40} className="text-[#cc0000]" />
        </div>
        <h1
          className="font-black text-3xl tracking-tighter text-[#1a1c1c] mb-4"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Pagina niet gevonden
        </h1>
        <p className="text-[#4d4c4c] mb-8 leading-relaxed">
          De pagina die je zoekt bestaat niet of is verplaatst. Ga terug naar de homepagina.
        </p>
        <Button href="/" size="lg">
          <ArrowLeft size={18} />
          Terug naar home
        </Button>
      </div>
    </section>
  )
}
