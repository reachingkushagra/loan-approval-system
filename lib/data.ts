export type LoanStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'manual-review'
  | 'more-info-required'
  | 'approved'
  | 'rejected'
  | 'disbursed'

export type LoanType = 'Personal' | 'Home' | 'Auto' | 'Business' | 'Education'

export interface TimelineEvent {
  id: string
  label: string
  description: string
  date: string
  status: 'complete' | 'current' | 'upcoming'
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  hint: string
}

export interface CoApplicant {
  name: string
  relationship: string
  income: number
  creditScore: number
}

export interface CashFlowSnapshot {
  monthlyIncome: number
  monthlyExpenses: number
  surplus: number
  stability: 'stable' | 'tight' | 'variable' | string
}

export interface LoanApplication {
  id: number
  applicant: string
  email: string
  type: LoanType
  amount: number
  termMonths: number
  rate: number
  status: LoanStatus
  creditScore: number
  trustScore: number
  readinessScore: number
  approvalProbability: number
  income: number
  submittedAt: string
  purpose: string
  officer: string
  riskScore: number
  timeline: TimelineEvent[]
  approvalReasons: string[]
  rejectionReasons: string[]
  improvementSuggestions: string[]
  manualReview: boolean
  profileType: 'first-time' | 'salaried' | 'freelancer' | 'borderline' | 'rejected' | string
  coApplicant?: CoApplicant | null
  cashFlow: CashFlowSnapshot
  educationSignal: string
  careerSignal: string
  documentChecklist: ChecklistItem[]
  consent: boolean
}

export interface AnalyticsData {
  total_applications: number
  pending: number
  under_review: number
  approved: number
  rejected: number
  more_info_required: number
  average_readiness_score: number
  average_credit_score: number
  average_trust_score: number
  monthly_volume: { month: string; approved: number; rejected: number; volume: number }[]
  approval_trend: { month: string; approval: number; firstTime: number }[]
  loan_mix: { type: string; value: number; fill: string }[]
}

export const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const statusLabels: Record<LoanStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'under-review': 'Under Review',
  'manual-review': 'Manual Review',
  'more-info-required': 'More Info Needed',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
}