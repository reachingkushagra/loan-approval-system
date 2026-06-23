import { Banknote, TrendingUp, Users, Timer } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import {
  ApprovalTrendChart,
  LoanMixChart,
  VolumeChart,
} from '@/components/analytics-charts'
import { ApplicationsTable } from '@/components/applications-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { applications } from '@/lib/data'

export default function AdminPage() {
  return (
    <DashboardShell
      title="Analytics overview"
      description="Portfolio performance and lending operations at a glance."
      actions={<Button variant="outline">Last 30 days</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total disbursed"
          value="$48.2M"
          icon={Banknote}
          delta="+12.4%"
          hint="This quarter"
        />
        <StatCard
          label="Approval rate"
          value="83%"
          icon={TrendingUp}
          delta="+4.1%"
          hint="vs. last month"
        />
        <StatCard
          label="Active borrowers"
          value="2,841"
          icon={Users}
          delta="+186"
          hint="Net new this month"
        />
        <StatCard
          label="Avg. decision time"
          value="4.2h"
          icon={Timer}
          trend="down"
          delta="-31%"
          hint="Faster than target"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <VolumeChart />
        <ApprovalTrendChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <LoanMixChart />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Latest applications across all products.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-2">
            <ApplicationsTable data={applications.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
