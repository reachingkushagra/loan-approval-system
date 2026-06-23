'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { currency } from '@/lib/data'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const steps = ['Loan details', 'Personal info', 'Financials', 'Review']

const loanTypes = ['Personal', 'Auto', 'Home', 'Business', 'Education']
const purposes = [
  'Debt consolidation',
  'Home purchase',
  'Vehicle purchase',
  'Business expansion',
  'Education',
  'Other',
]

export function LoanApplicationForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState(25000)
  const [term, setTerm] = useState('60')
  const [type, setType] = useState('Personal')

  const rate = useMemo(() => {
    const base: Record<string, number> = {
      Personal: 11.5,
      Auto: 7.9,
      Home: 6.4,
      Business: 9.2,
      Education: 5.8,
    }
    return base[type] ?? 9
  }, [type])

  const monthly = useMemo(() => {
    const r = rate / 100 / 12
    const n = Number(term)
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, [amount, term, rate])

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1)
    else {
      toast.success('Application submitted successfully')
      router.push('/dashboard')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        {/* Stepper */}
        <ol className="mb-6 flex items-center gap-2">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    i < step && 'bg-primary text-primary-foreground',
                    i === step &&
                      'border-2 border-primary bg-card text-primary',
                    i > step && 'border border-border bg-muted text-muted-foreground',
                  )}
                >
                  {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    'hidden text-sm font-medium sm:inline',
                    i === step ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    'h-px flex-1',
                    i < step ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </li>
          ))}
        </ol>

        <Card>
          <CardHeader>
            <CardTitle>{steps[step]}</CardTitle>
            <CardDescription>
              {step === 0 && 'Tell us what you need and how long to repay.'}
              {step === 1 && 'We use this to verify your identity.'}
              {step === 2 && 'Helps us assess affordability and rate.'}
              {step === 3 && 'Confirm everything looks right before submitting.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {step === 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">Loan type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="amount">Amount</Label>
                    <span className="text-sm font-medium tabular-nums">
                      {currency(amount)}
                    </span>
                  </div>
                  <input
                    id="amount"
                    type="range"
                    min={5000}
                    max={500000}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{currency(5000)}</span>
                    <span>{currency(500000)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="term">Repayment term</Label>
                  <Select value={term} onValueChange={setTerm}>
                    <SelectTrigger id="term">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['12', '24', '36', '60', '84', '120', '360'].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t} months
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="first">First name</Label>
                    <Input id="first" defaultValue="Amara" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="last">Last name</Label>
                    <Input id="last" defaultValue="Okafor" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input
                    id="email2"
                    type="email"
                    defaultValue="amara.okafor@example.com"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="(512) 555-0148" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="dob">Date of birth</Label>
                    <Input id="dob" type="date" defaultValue="1990-06-14" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Home address</Label>
                  <Input id="address" defaultValue="1200 Cedar St, Austin, TX" />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="income">Annual income</Label>
                    <Input id="income" defaultValue="128000" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="employment">Employment status</Label>
                    <Select defaultValue="Full-time">
                      <SelectTrigger id="employment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Full-time', 'Part-time', 'Self-employed', 'Retired'].map(
                          (e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="purpose">Purpose of loan</Label>
                  <Select defaultValue="Debt consolidation">
                    <SelectTrigger id="purpose">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes">Additional details</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder="Anything else we should know about your request…"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <dl className="grid grid-cols-2 gap-4">
                <Summary label="Loan type" value={type} />
                <Summary label="Amount" value={currency(amount)} />
                <Summary label="Term" value={`${term} months`} />
                <Summary label="Est. rate" value={`${rate}% APR`} />
                <Summary
                  label="Est. monthly payment"
                  value={`${currency(Math.round(monthly))}/mo`}
                />
                <Summary
                  label="Total repayment"
                  value={currency(Math.round(monthly * Number(term)))}
                />
              </dl>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ChevronLeft data-icon="inline-start" />
                Back
              </Button>
              <Button onClick={next}>
                {step === steps.length - 1 ? 'Submit application' : 'Continue'}
                {step !== steps.length - 1 && (
                  <ChevronRight data-icon="inline-end" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live estimate sidebar */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Your estimate</CardTitle>
            <CardDescription>Updates as you fill in the form.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border bg-secondary/40 p-4">
              <p className="text-xs text-muted-foreground">
                Estimated monthly payment
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {currency(Math.round(monthly))}
              </p>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Loan amount" value={currency(amount)} />
              <Row label="Term" value={`${term} months`} />
              <Row label="Estimated APR" value={`${rate}%`} />
              <Row
                label="Total interest"
                value={currency(Math.round(monthly * Number(term) - amount))}
              />
            </dl>
            <p className="text-xs text-muted-foreground">
              This is an estimate only and not a commitment to lend. Final terms
              depend on credit review.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium tabular-nums">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}
