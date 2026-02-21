import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div className={`${hover ? 'glass-hover' : 'glass'} p-6 ${className}`}>
      {children}
    </div>
  )
}
