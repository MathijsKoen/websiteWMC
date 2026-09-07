import type { ReactNode } from 'react'

interface EyebrowProps {
  children: ReactNode
  /** Extra classes, bedoeld voor de marge onder het label (bijv. "mb-6"). */
  className?: string
  /** Gedempte variant voor gebruik op een rode ondergrond. */
  tone?: 'primary' | 'onPrimary'
}

/**
 * Het terugkerende "streepje + label" motief boven een kop.
 * Stond eerder als losse markup in elke sectie; hier één keer vastgelegd
 * zodat de streeplengte, letterafstand en kleur overal gelijk zijn.
 */
export function Eyebrow({ children, className = '', tone = 'primary' }: EyebrowProps) {
  const ruleColor = tone === 'onPrimary' ? 'bg-white/60' : 'bg-[#cc0000]'
  const textColor = tone === 'onPrimary' ? 'text-white/70' : 'text-[#cc0000]'

  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <span aria-hidden="true" className={`w-8 h-0.5 shrink-0 ${ruleColor}`} />
      <span className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>
        {children}
      </span>
    </div>
  )
}
