import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { ReviewQueue } from '@/components/review-queue'
import { Button } from '@/components/ui/button'
import { getApplications } from '@/lib/api'

export default async function ReviewPage() {
  let applications = []
  let error = ''

  try {
    applications = await getApplications()
  } catch (err) {
    error = 'Unable to load review applications.'
  }

  if (error) {
    return (
      <DashboardShell
        title="Officer review"
        description="Assess, approve, and decision incoming loan applications."
      >
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      </DashboardShell>
    )
  }

  const pending = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under-review',
  ).length
  const pipeline = applications
    .filter((a) => a.status !== 'rejected')
    .reduce((sum, app) => sum + app.amount, 0)

  return (
    <DashboardShell
      title="Officer review"
      description="Assess, approve, and decision incoming loan applications."
      actions={<Button variant="outline">Export queue</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending review"
          value={String(pending)}
          icon={Clock}
          hint="Awaiting decision"
        />
        <StatCard
          label="Approved today"
          value="12"
          icon={CheckCircle2}
          delta="+3"
          hint="vs. yesterday"
        />
        <StatCard
          label="Pipeline value"
          value={`$${pipeline.toLocaleString()}`}
          icon={ClipboardList}
          hint="Active applications"
        />
        <StatCard
          label="High-risk flags"
          value="2"
          icon={AlertTriangle}
          trend="down"
          delta="-1"
          hint="Risk score > 60"
        />
      </div>

      <ReviewQueue applications={applications} />
    </DashboardShell>
  )
}