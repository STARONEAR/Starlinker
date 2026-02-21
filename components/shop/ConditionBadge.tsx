import { Badge } from '@/components/ui/Badge'

type Condition = 'new' | 'like_new' | 'good' | 'fair' | 'refurbished'

interface ConditionBadgeProps {
  condition: Condition
  size?: 'sm' | 'md'
}

const conditionConfig = {
  new: { label: 'New', variant: 'success' as const },
  like_new: { label: 'Like New', variant: 'info' as const },
  good: { label: 'Good', variant: 'default' as const },
  fair: { label: 'Fair', variant: 'warning' as const },
  refurbished: { label: 'Refurbished', variant: 'info' as const },
}

export function ConditionBadge({ condition, size = 'md' }: ConditionBadgeProps) {
  const config = conditionConfig[condition]
  
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  )
}
