import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-background-secondary border border-surface-glass-border rounded-2xl p-6 ${
        onClick ? 'cursor-pointer hover:border-primary-main/50 transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
