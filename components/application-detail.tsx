'use client'

import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { currency, type LoanApplication } from '@/lib/data'
import { StatusBadge } from '@/components/status-badge'
import { Timeline } from '@/components/timeline'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">{value}</dd>
    </div>
  )
}

export function ApplicationDetail({
  application,
  open,
  onOpenChange,
}: {
  application: LoanApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!application) return null
  const monthly =
    (application.amount *
      (application.rate / 100 / 12) *
      Math.pow(1 + application.rate / 100 / 12, application.termMonths)) /
    (Math.pow(1 + application.rate / 100 / 12, application.termMonths) - 1)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {application.id}
            </span>
            <StatusBadge status={application.status} />
          </div>
          <SheetTitle className="text-xl">{application.applicant}</SheetTitle>
          <SheetDescription>
            {application.type} loan · Submitted {application.submittedAt}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="rounded-lg border bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Requested amount</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
              {currency(application.amount)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currency(Math.round(monthly))}/mo · {application.rate}% APR ·{' '}
              {application.termMonths} mo
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <Detail label="Credit score" value={String(application.creditScore)} />
            <Detail label="Annual income" value={currency(application.income)} />
            <Detail label="Risk score" value={`${application.riskScore}/100`} />
            <Detail label="Assigned officer" value={application.officer} />
          </dl>

          <div>
            <p className="text-xs text-muted-foreground">Purpose</p>
            <p className="mt-1 text-sm">{application.purpose}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">Application timeline</h3>
            <Timeline events={application.timeline} />
          </div>
        </div>

        <SheetFooter className="mt-auto flex-row gap-2 border-t p-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              toast.error(`${application.id} rejected`)
              onOpenChange(false)
            }}
          >
            <X data-icon="inline-start" />
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              toast.success(`${application.id} approved`)
              onOpenChange(false)
            }}
          >
            <Check data-icon="inline-start" />
            Approve
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
