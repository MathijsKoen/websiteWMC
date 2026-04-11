import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  skewed?: boolean
}

interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined
}

interface LinkProps extends BaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

type Props = ButtonProps | LinkProps

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#cc0000] text-white font-bold hover:bg-[#9e0000] active:bg-[#7a0000] transition-colors duration-200',
  secondary:
    'bg-[#f3f3f3] text-[#1a1c1c] font-bold hover:bg-[#e8e8e8] active:bg-[#e2e2e2] transition-colors duration-200',
  ghost:
    'bg-transparent text-[#cc0000] font-bold hover:bg-[#cc0000]/10 active:bg-[#cc0000]/20 transition-colors duration-200',
  outline:
    'bg-transparent border-2 border-[#cc0000] text-[#cc0000] font-bold hover:bg-[#cc0000] hover:text-white transition-colors duration-200',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({ variant = 'primary', size = 'md', skewed = false, className = '', ...props }: Props) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-headline tracking-tight
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cc0000] focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
    overflow-hidden relative
  `

  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    skewed ? 'skew-15' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = skewed ? (
    <span className="skew-15-reverse inline-flex items-center gap-2">{(props as ButtonProps).children ?? (props as LinkProps).children}</span>
  ) : (
    (props as ButtonProps).children ?? (props as LinkProps).children
  )

  if ('href' in props && props.href !== undefined) {
    const { href, variant: _v, size: _s, skewed: _sk, children: _c, ...rest } = props as LinkProps
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    )
  }

  const { variant: _v, size: _s, skewed: _sk, children: _c, ...rest } = props as ButtonProps
  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  )
}
