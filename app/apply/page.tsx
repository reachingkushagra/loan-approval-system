import { DashboardShell } from '@/components/dashboard-shell'
import { LoanApplicationForm } from '@/components/loan-application-form'

export default function ApplyPage() {
  return (
    <DashboardShell
      title="Apply for a loan"
      description="Complete the steps below to submit your application for review."
    >
      <LoanApplicationForm />
    </DashboardShell>
  )
}
