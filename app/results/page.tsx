import { DashboardShell } from '@/components/dashboard-shell'
import { DecisionResults } from '@/components/borrower-journey'
import { getApplications, getScoreBreakdown } from '@/lib/api'

const applicantId = 1

export default async function ResultsPage() {
  let application = null
  let scoreBreakdown = null
  let error = ''

  try {
    const applications = await getApplications(applicantId)
    application = applications[0]
    if (application) {
      scoreBreakdown = await getScoreBreakdown(application.id)
    }
  } catch (err) {
    error = 'Unable to load decision results at this time.'
  }

  return (
    <DashboardShell title="Decision results" description="Understand the reasons behind your result and the next actions available.">
      {error ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      ) : !application ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found. Start your application to see the result.
        </div>
      ) : (
        <DecisionResults application={application} scoreBreakdown={scoreBreakdown} />
      )}
    </DashboardShell>
  )
}