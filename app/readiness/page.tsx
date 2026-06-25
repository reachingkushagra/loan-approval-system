import { DashboardShell } from '@/components/dashboard-shell'
import { LoanReadinessScreen } from '@/components/borrower-journey'
import { getApplications, getScoreBreakdown } from '@/lib/api'

const applicantId = 1

export default async function ReadinessPage() {
  let application = null
  let breakdown = null
  let error = ''

  try {
    const applications = await getApplications(applicantId)
    application = applications[0]
    if (application) {
      breakdown = await getScoreBreakdown(application.id)
    }
  } catch (err) {
    error = 'Unable to load your readiness score at this time.'
  }

  return (
    <DashboardShell title="Loan readiness" description="See the scorecard behind your application and what improves it.">
      {error ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      ) : !application ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found. Start a new application to see your score.
        </div>
      ) : (
        <LoanReadinessScreen application={application} scoreBreakdown={breakdown} />
      )}
    </DashboardShell>
  )
}