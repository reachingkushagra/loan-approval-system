import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TimelineEvent } from '@/lib/data'

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative">
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        return (
          <li key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute left-3.5 top-8 h-[calc(100%-1rem)] w-px',
                  event.status === 'complete' ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-4 ring-card',
                event.status === 'complete' && 'bg-primary text-primary-foreground',
                event.status === 'current' &&
                  'border-2 border-primary bg-card text-primary',
                event.status === 'upcoming' &&
                  'border border-border bg-muted text-muted-foreground',
              )}
            >
              {event.status === 'complete' ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : (
                <span
                  className={cn(
                    'size-2 rounded-full',
                    event.status === 'current' ? 'bg-primary' : 'bg-muted-foreground/50',
                  )}
                />
              )}
            </span>
            <div className="-mt-0.5 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3">
                <p
                  className={cn(
                    'text-sm font-medium',
                    event.status === 'upcoming'
                      ? 'text-muted-foreground'
                      : 'text-foreground',
                  )}
                >
                  {event.label}
                </p>
                <time className="text-xs text-muted-foreground">{event.date}</time>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
