import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  accent?: boolean
  hover?: boolean
}

export function Card({ children, className = '', accent = false, hover = false }: CardProps) {
  return (
    <div
      className={[
        'bg-white',
        accent ? 'border-l-4 border-[#cc0000]' : '',
        hover ? 'group transition-shadow duration-200 hover:shadow-md' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>
}

interface CardBodyProps {
  children: ReactNode
  className?: string
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}
