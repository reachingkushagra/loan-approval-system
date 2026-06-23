import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { ReviewQueue } from '@/components/review-queue'
import { Button } from '@/components/ui/button'
import { applications, currency } from '@/lib/data'

export default function ReviewPage() {
  const pending = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under-review',
  ).length
  const pipeline = applications
    .filter((a) => a.status !== 'rejected')
    .reduce((sum, a) => sum + a.amount, 0)

  return (
    <DashboardShell
      title="Officer review"
      description="Assess, approve, and decision incoming loan applications."
      actions={
        <Button variant="outline">Export queue</Button>
      }
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
          value={currency(pipeline)}
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

      <ReviewQueue />
    </DashboardShell>
  )
}
