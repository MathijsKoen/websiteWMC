import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#eeeeee] text-[#4d4c4c]',
  primary: 'bg-[#cc0000] text-white',
  secondary: 'bg-[#0058bb] text-white',
  outline: 'border border-[#926e69] text-[#5e3f3a] bg-transparent',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest',
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
