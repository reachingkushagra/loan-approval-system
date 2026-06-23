import Link from 'next/link'
import { FilePlus2, Wallet, Percent, CalendarClock, FileText } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { Timeline } from '@/components/timeline'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { currentApplicant, currency } from '@/lib/data'

export default function ApplicantDashboardPage() {
  const apps = currentApplicant.applications
  const active = apps[0]

  return (
    <DashboardShell
      title={`Welcome back, ${currentApplicant.name.split(' ')[0]}`}
      description="Here's a snapshot of your lending activity."
      actions={
        <Button render={<Link href="/apply" />}>
          <FilePlus2 data-icon="inline-start" />
          New application
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active balance"
          value={currency(340000)}
          icon={Wallet}
          delta="On track"
          hint="Across 1 active loan"
        />
        <StatCard
          label="Avg. interest rate"
          value="6.4%"
          icon={Percent}
          hint="Fixed APR"
        />
        <StatCard
          label="Next payment"
          value={currency(2128)}
          icon={CalendarClock}
          hint="Due Apr 01, 2025"
        />
        <StatCard
          label="Credit score"
          value="742"
          icon={FileText}
          delta="+8 pts"
          hint="Updated this month"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
            <CardDescription>
              Track the status of every loan you&apos;ve requested.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {apps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.type} Loan</p>
                      <span className="font-mono text-xs text-muted-foreground">
                        {app.id}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currency(app.amount)} · {app.termMonths} mo · {app.rate}%
                      APR
                    </p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}

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
            <CardDescription>
              {active.type} loan · {active.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline events={active.timeline} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
