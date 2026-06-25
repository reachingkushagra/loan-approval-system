import { Banknote, TrendingUp, Users, Timer } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { ApprovalTrendChart, LoanMixChart, VolumeChart } from '@/components/analytics-charts'
import { ApplicationsTable } from '@/components/applications-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApplications, getAnalytics } from '@/lib/api'

export default async function AdminPage() {
  let applications = []
  let analytics = null
  let error = ''

  try {
    applications = await getApplications()
    analytics = await getAnalytics()
  } catch (err) {
    error = 'Unable to load analytics data.'
  }

  if (error) {
    return (
      <DashboardShell
        title="Analytics overview"
        description="Portfolio performance and lending operations at a glance."
      >
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="Analytics overview"
      description="Portfolio performance and lending operations at a glance."
      actions={<Button variant="outline">Last 30 days</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total applications"
          value={String(analytics.total_applications)}
          icon={Banknote}
          delta="+12.4%"
          hint="Since launch"
        />
        <StatCard
          label="Approval rate"
          value={`${Math.round((analytics.approved / Math.max(analytics.total_applications, 1)) * 100)}%`}
          icon={TrendingUp}
          delta="+4.1%"
          hint="Across reviewed loans"
        />
        <StatCard
          label="Pending review"
          value={String(analytics.pending)}
          icon={Users}
          delta="+186"
          hint="Awaiting decision"
        />
        <StatCard
          label="Rejected"
          value={String(analytics.rejected)}
          icon={Timer}
          trend="down"
          delta={analytics.rejected > analytics.more_info_required ? `-${analytics.rejected - analytics.more_info_required}` : '0'}
          hint="Review pipeline"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <VolumeChart data={analytics.monthly_volume} />
        <ApprovalTrendChart data={analytics.approval_trend} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <LoanMixChart data={analytics.loan_mix} />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest applications across all products.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-2">
            <ApplicationsTable data={applications.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}