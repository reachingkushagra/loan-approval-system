import { DashboardShell } from '@/components/dashboard-shell'
import { DocumentChecklist } from '@/components/borrower-journey'
import { getApplications } from '@/lib/api'

const applicantId = 1

export default async function ChecklistPage() {
  let application = null
  let error = ''

  try {
    const applications = await getApplications(applicantId)
    application = applications[0]
  } catch (err) {
    error = 'Unable to load your document checklist.'
  }

  return (
    <DashboardShell title="Document checklist" description="Track what is complete and what still needs attention before review.">
      {error ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-red-600">{error}</div>
      ) : !application ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found. Complete an application first.
        </div>
      ) : (
        <DocumentChecklist application={application} />
      )}
    </DashboardShell>
  )
}