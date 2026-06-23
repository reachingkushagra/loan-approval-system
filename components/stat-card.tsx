import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  delta,
  trend = 'up',
  icon: Icon,
  hint,
}: {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down'
  icon: LucideIcon
  hint?: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <Icon className="size-4.5" />
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {value}
          </span>
          {delta && (
            <span
              className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600',
              )}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {delta}
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
