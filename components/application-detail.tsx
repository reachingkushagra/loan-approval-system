'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { submitReviewDecision } from '@/lib/api'
import { currency, type LoanApplication } from '@/lib/data'
import { StatusBadge } from '@/components/status-badge'
import { Timeline } from '@/components/timeline'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ChecklistItem, ReasonChip } from '@/components/borrower-journey'
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
  onApplicationUpdated,
}: {
  application: LoanApplication | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplicationUpdated: (application: LoanApplication) => void
}) {
  const [currentApplication, setCurrentApplication] = useState(application)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setCurrentApplication(application)
  }, [application])

  if (!currentApplication) return null

  const monthly =
    (currentApplication.amount * (currentApplication.rate / 100 / 12) *
      Math.pow(1 + currentApplication.rate / 100 / 12, currentApplication.termMonths)) /
    (Math.pow(1 + currentApplication.rate / 100 / 12, currentApplication.termMonths) - 1)

  async function handleDecision(decision: 'APPROVED' | 'MORE_INFO_REQUIRED') {
    if (!currentApplication) return

    setIsUpdating(true)

    try {
      const updated = await submitReviewDecision(currentApplication.id, {
        officer_id: 1,
        decision,
        remarks:
          decision === 'APPROVED'
            ? 'Approved by officer'
            : 'Requested additional documentation',
      })

      setCurrentApplication(updated)
      onApplicationUpdated(updated)
      toast.success(
        decision === 'APPROVED'
          ? `${updated.id} approved`
          : `${updated.id} flagged for follow-up`,
      )
      onOpenChange(false)
    } catch (error) {
      toast.error('Unable to update application status.')
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">{currentApplication.id}</span>
            <StatusBadge status={currentApplication.status} />
          </div>
          <SheetTitle className="text-xl">{currentApplication.applicant}</SheetTitle>
          <SheetDescription>
            {currentApplication.type} loan · Submitted {currentApplication.submittedAt}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-6">
          <div className="rounded-2xl border bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Requested amount</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
              {currency(currentApplication.amount)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currency(Math.round(monthly))}/mo · {currentApplication.rate}% APR · {currentApplication.termMonths} mo
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Detail label="Readiness score" value={`${currentApplication.readinessScore}/100`} />
            <Detail label="Credit score" value={String(currentApplication.creditScore)} />
            <Detail label="Trust / fraud" value={String(currentApplication.trustScore)} />
            <Detail label="Approval probability" value={`${currentApplication.approvalProbability}%`} />
          </div>

          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                {currentApplication.approvalReasons.map((reason) => (
                  <ReasonChip key={reason} label={reason} tone="good" />
                ))}
              </div>
              {currentApplication.rejectionReasons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentApplication.rejectionReasons.map((reason) => (
                    <ReasonChip key={reason} label={reason} tone="warning" />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-3">
            <div className="rounded-xl border bg-card p-3">
              <p className="text-sm font-medium">Support signals</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentApplication.educationSignal} · {currentApplication.careerSignal}
              </p>
            </div>

            {currentApplication.coApplicant && (
              <div className="rounded-xl border bg-card p-3">
                <p className="text-sm font-medium">Guarantor / co-applicant</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentApplication.coApplicant.name} · {currentApplication.coApplicant.relationship}
                </p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">Document checklist</h3>
              {currentApplication.manualReview && <StatusBadge status="manual-review" />}
            </div>
            <div className="space-y-2">
              {currentApplication.documentChecklist.map((item) => (
                <ChecklistItem key={item.id} label={item.label} done={item.done} hint={item.hint} />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">Application timeline</h3>
            <Timeline events={currentApplication.timeline} />
          </div>
        </div>

        <SheetFooter className="mt-auto flex-row gap-2 border-t p-6">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isUpdating}
            onClick={() => handleDecision('MORE_INFO_REQUIRED')}
          >
            <X data-icon="inline-start" />
            Request info
          </Button>
          <Button disabled={isUpdating} onClick={() => handleDecision('APPROVED')}>
            <Check data-icon="inline-start" />
            Approve
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}