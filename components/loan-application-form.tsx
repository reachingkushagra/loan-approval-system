'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createApplication } from '@/lib/api'
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

const steps = ['Consent', 'Borrower profile', 'Cash flow', 'Guarantor', 'Review']
const loanTypes = ['Personal', 'Auto', 'Home', 'Business', 'Education']
const purposes = [
  'Career transition',
  'Education',
  'Relocation',
  'Freelancer equipment',
  'Emergency buffer',
  'Other',
]

export function LoanApplicationForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState(6500)
  const [term, setTerm] = useState('24')
  const [type, setType] = useState('Personal')
  const [income, setIncome] = useState('3200')
  const [employment, setEmployment] = useState('Full-time')
  const [purpose, setPurpose] = useState('Career transition')
  const [educationSignal, setEducationSignal] = useState('Coding bootcamp graduate')
  const [careerSignal, setCareerSignal] = useState('Operations analyst role starting next month')
  const [guarantor, setGuarantor] = useState('Mina Okafor')
  const [relationship, setRelationship] = useState('Sister')
  const [supportNote, setSupportNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [coApplicantName, setCoApplicantName] = useState('')
  const [coApplicantRelationship, setCoApplicantRelationship] = useState('')

  const rate = useMemo(() => {
    const base: Record<string, number> = {
      Personal: 9.2,
      Auto: 8.4,
      Home: 7.1,
      Business: 10.1,
      Education: 8.4,
    }
    return base[type] ?? 9
  }, [type])

  const monthly = useMemo(() => {
    const r = rate / 100 / 12
    const n = Number(term)
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, [amount, term, rate])

  const applicantId = 1

  async function handleSubmit() {
    if (step < steps.length - 1) {
      setStep((current) => current + 1)
      return
    }

    setIsSubmitting(true)

    try {
      await createApplication({
        applicant_id: applicantId,
        type,
        termMonths: Number(term),
        rate,
        amount,
        annualIncome: Number(income) * 12,
        employmentType: employment,
        purpose,
        educationSignal,
        careerSignal,
        monthlyIncome: Number(income),
        monthlyExpenses: Number(income) * 0.6,
        cashFlowStability: Number(income) - Number(income) * 0.6 > 600 ? 'stable' : 'tight',
        profileType: 'first-time',
        coApplicantName: coApplicantName,
        coApplicantRelationship: coApplicantRelationship,
        coApplicantIncome: 3600,
        coApplicantCreditScore: 748,
      })

      toast.success('Application submitted for transparent review')
      router.push('/results')
    } catch (error) {
      toast.error('Unable to submit application. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <ol className="mb-6 flex items-center gap-2">
          {steps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                    i < step && 'bg-primary text-primary-foreground',
                    i === step && 'border-2 border-primary bg-card text-primary',
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
                <span className={cn('h-px flex-1', i < step ? 'bg-primary' : 'bg-border')} />
              )}
            </li>
          ))}
        </ol>

        <Card>
          <CardHeader>
            <CardTitle>{steps[step]}</CardTitle>
            <CardDescription>
              {step === 0 && 'Confirm consent and understand the explainable underwriting experience.'}
              {step === 1 && 'These details help the system build a fair first-loan profile.'}
              {step === 2 && 'Cash-flow signals are central to youth-friendly underwriting.'}
              {step === 3 && 'Optional support from a guarantor can strengthen your case.'}
              {step === 4 && 'Review the summary and submit.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {step === 0 && (
              <div className="space-y-4 rounded-2xl border bg-secondary/40 p-4">
                <p className="text-sm font-medium">Borrower consent</p>
                <p className="text-sm text-muted-foreground">
                  I agree that my application can be assessed with transparent scoring based on income, education, career, and trust signals. I understand I can receive explainable reasons, fix-and-resubmit guidance, and a clear next step if more information is needed.
                </p>
                <div className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                  We surface credit score and trust score separately so you can see what matters most.
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="first">First name</Label>
                  <Input id="first" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input id="dob" type="date" defaultValue="1998-06-14" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" defaultValue="(512) 555-0148" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="school">Education or training</Label>
                  <Input id="school" value={educationSignal} onChange={(event) => setEducationSignal(event.target.value)} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">Loan type</Label>
                  <Select value={type} onValueChange={(value) => setType(value ?? 'Personal')}>
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
                    <span className="text-sm font-medium tabular-nums">{currency(amount)}</span>
                  </div>
                  <input
                    id="amount"
                    type="range"
                    min={2000}
                    max={20000}
                    step={500}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="income">Monthly income</Label>
                    <Input id="income" value={income} onChange={(e) => setIncome(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="employment">Employment type</Label>
                    <Select value={employment} onValueChange={(value) => setEmployment(value ?? 'Full-time')}>
                      <SelectTrigger id="employment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Full-time', 'Part-time', 'Freelance', 'Internship'].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="purpose">Purpose of loan</Label>
                  <Select value={purpose} onValueChange={(value) => setPurpose(value ?? 'Career transition')}>
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
                  <Label htmlFor="notes">How this loan helps your goals</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={careerSignal}
                    onChange={(e) => setCareerSignal(e.target.value)}
                    placeholder="Share your career, education, or cash-flow story here."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="guarantor">Guarantor / co-applicant name</Label>
                  <Input id="guarantor" value={guarantor} onChange={(e) => setGuarantor(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input id="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="support">Support note</Label>
                  <Textarea
                    id="support"
                    rows={3}
                    value={supportNote}
                    onChange={(e) => setSupportNote(e.target.value)}
                    placeholder="Explain how the guarantor supports this application."
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <dl className="grid gap-4 sm:grid-cols-2">
                <Summary label="Loan type" value={type} />
                <Summary label="Amount" value={currency(amount)} />
                <Summary label="Term" value={`${term} months`} />
                <Summary label="Est. rate" value={`${rate}% APR`} />
                <Summary label="Est. monthly payment" value={`${currency(Math.round(monthly))}/mo`} />
                <Summary label="Employment" value={employment} />
              </dl>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || isSubmitting}
              >
                <ChevronLeft data-icon="inline-start" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {step === steps.length - 1 ? 'Submit application' : 'Continue'}
                {step !== steps.length - 1 && <ChevronRight data-icon="inline-end" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Why this feels different</CardTitle>
            <CardDescription>Transparent signals for first-time borrowers.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-2xl border bg-primary/5 p-4">
              <p className="text-xs text-muted-foreground">Estimated monthly payment</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {currency(Math.round(monthly))}
              </p>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Loan amount" value={currency(amount)} />
              <Row label="Income signal" value={currency(Number(income))} />
              <Row label="Employment" value={employment} />
              <Row label="Support" value="Guarantor optional" />
            </dl>
            <p className="text-xs text-muted-foreground">
              This is a transparent MVP preview. We surface the reasons, suggest improvements, and keep the process mobile-first.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-background/70 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}