import { DashboardShell } from '@/components/dashboard-shell'
import { FixAndResubmit } from '@/components/borrower-journey'
import { getApplications } from '@/lib/api'

const applicantId = 1

export default async function FixPage() {
  let application = null
  let error = ''

  try {
    const applications = await getApplications(applicantId)
    application = applications[0]
  } catch (err) {
    error = 'Unable to load your fix and resubmit journey.'
  }

  return (
    <DashboardShell title="Fix and resubmit" description="Review your most recent application and update the signal areas that matter most.">
      {error ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      ) : !application ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found. Submit an application first.
        </div>
      ) : (
        <FixAndResubmit application={application} />
      )}
    </DashboardShell>
  )
}