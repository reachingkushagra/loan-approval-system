import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Timeline } from '@/components/timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ApplicationsTable } from '@/components/applications-table'
import { currency } from '@/lib/data'
import { API_BASE_URL } from '@/src/config/api'

type Application = {
  id: number
  applicant: string
  email: string
  type: string
  amount: number
  termMonths: number
  rate: number
  status: string
  creditScore: number
  trustScore: number
  readinessScore: number
  approvalProbability: number
  income: number
  submittedAt: string
  purpose: string
  officer: string
  riskScore: number
  timeline: { id: string; label: string; description: string; date: string; status: string }[]
}

const API_URL = API_BASE_URL

async function fetchApplications(applicantId: number) {
  const res = await fetch(`${API_URL}/applications?applicant_id=${applicantId}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(body || 'Unable to fetch applications')
  }

  return res.json() as Promise<Application[]>
}

export default async function ApplicantDashboardPage({
  searchParams,
}: {
  searchParams: { applicantId?: string | string[] }
}) {
  const applicantId = Array.isArray(searchParams.applicantId)
    ? Number(searchParams.applicantId[0])
    : Number(searchParams.applicantId ?? '1')

  let applications: Application[] = []
  let error = ''

  try {
    applications = await fetchApplications(applicantId)
  } catch (err) {
    error = 'Unable to load your applications right now.'
  }

  if (error) {
    return (
      <DashboardShell title="Welcome back" description="Your loan dashboard is loading.">
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">
          {error}
        </div>
      </DashboardShell>
    )
  }

  if (applications.length === 0) {
    return (
      <DashboardShell title="Welcome back" description="Here’s a snapshot of your lending activity.">
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No applications found. Start a new application to see your loan journey.
        </div>
      </DashboardShell>
    )
  }

  const active = applications[0]
  const totalBalance = applications.reduce((sum, app) => sum + app.amount, 0)
  const averageRate = applications.length
    ? `${(applications.reduce((sum, app) => sum + app.rate, 0) / applications.length).toFixed(1)}%`
    : '0.0%'
  const nextPayment = currency(Math.round(totalBalance / Math.max(applications.length, 1) / 12))
  const applicantName = active.applicant.split(' ')[0]

  return (
    <DashboardShell
      title={`Welcome back, ${applicantName}`}
      description="Here's a snapshot of your lending activity."
      userName={active.applicant}
      actions={
        <Link href="/apply">
          <Button>New application</Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active balance" value={currency(totalBalance)} delta="On track" hint="Across current loans" />
        <StatCard label="Avg. interest rate" value={averageRate} hint="Weighted across loans" />
        <StatCard label="Next payment" value={nextPayment} hint="Estimate" />
        <StatCard label="Credit score" value={String(active.creditScore)} delta="+8 pts" hint="Most recent" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
            <CardDescription>Track the status of every loan you’ve requested.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ApplicationsTable data={applications} />
            <div className="rounded-lg border bg-secondary/40 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Application progress</span>
                <span className="text-muted-foreground">3 of 5 steps</span>
              </div>
              <Progress value={60} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
            <CardDescription>{active.type} loan · {active.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline events={active.timeline} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}