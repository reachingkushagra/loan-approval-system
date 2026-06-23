export type LoanStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'disbursed'

export type LoanType =
  | 'Personal'
  | 'Home'
  | 'Auto'
  | 'Business'
  | 'Education'

export interface TimelineEvent {
  id: string
  label: string
  description: string
  date: string
  status: 'complete' | 'current' | 'upcoming'
}

export interface LoanApplication {
  id: string
  applicant: string
  email: string
  type: LoanType
  amount: number
  termMonths: number
  rate: number
  status: LoanStatus
  creditScore: number
  income: number
  submittedAt: string
  purpose: string
  officer: string
  riskScore: number
  timeline: TimelineEvent[]
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
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
}

function makeTimeline(stage: number): TimelineEvent[] {
  const base: Omit<TimelineEvent, 'status'>[] = [
    {
      id: 't1',
      label: 'Application Submitted',
      description: 'Your application was received and queued for review.',
      date: 'Mar 02, 2025',
    },
    {
      id: 't2',
      label: 'Documents Verified',
      description: 'Income and identity documents validated.',
      date: 'Mar 04, 2025',
    },
    {
      id: 't3',
      label: 'Credit Assessment',
      description: 'Automated underwriting and risk scoring completed.',
      date: 'Mar 06, 2025',
    },
    {
      id: 't4',
      label: 'Officer Review',
      description: 'A loan officer is reviewing your file.',
      date: 'Mar 08, 2025',
    },
    {
      id: 't5',
      label: 'Final Decision',
      description: 'Approval decision and disbursement scheduling.',
      date: 'Pending',
    },
  ]
  return base.map((e, i) => ({
    ...e,
    status:
      i < stage ? 'complete' : i === stage ? 'current' : 'upcoming',
  }))
}

export const applications: LoanApplication[] = [
  {
    id: 'LN-48213',
    applicant: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    type: 'Home',
    amount: 340000,
    termMonths: 360,
    rate: 6.4,
    status: 'under-review',
    creditScore: 742,
    income: 128000,
    submittedAt: 'Mar 02, 2025',
    purpose: 'Purchase of primary residence in Austin, TX.',
    officer: 'J. Mensah',
    riskScore: 28,
    timeline: makeTimeline(3),
  },
  {
    id: 'LN-48190',
    applicant: 'Daniel Reyes',
    email: 'daniel.reyes@example.com',
    type: 'Auto',
    amount: 38500,
    termMonths: 60,
    rate: 7.9,
    status: 'approved',
    creditScore: 781,
    income: 96000,
    submittedAt: 'Feb 27, 2025',
    purpose: 'Financing for a new electric vehicle.',
    officer: 'L. Chen',
    riskScore: 14,
    timeline: makeTimeline(4),
  },
  {
    id: 'LN-48155',
    applicant: 'Priya Nair',
    email: 'priya.nair@example.com',
    type: 'Business',
    amount: 125000,
    termMonths: 84,
    rate: 9.2,
    status: 'submitted',
    creditScore: 705,
    income: 210000,
    submittedAt: 'Mar 05, 2025',
    purpose: 'Working capital for retail expansion.',
    officer: 'Unassigned',
    riskScore: 41,
    timeline: makeTimeline(1),
  },
  {
    id: 'LN-48099',
    applicant: 'Marcus Bauer',
    email: 'marcus.bauer@example.com',
    type: 'Personal',
    amount: 18000,
    termMonths: 36,
    rate: 11.5,
    status: 'rejected',
    creditScore: 612,
    income: 54000,
    submittedAt: 'Feb 20, 2025',
    purpose: 'Debt consolidation.',
    officer: 'J. Mensah',
    riskScore: 73,
    timeline: makeTimeline(4),
  },
  {
    id: 'LN-48041',
    applicant: 'Sofia Russo',
    email: 'sofia.russo@example.com',
    type: 'Education',
    amount: 62000,
    termMonths: 120,
    rate: 5.8,
    status: 'disbursed',
    creditScore: 759,
    income: 72000,
    submittedAt: 'Feb 12, 2025',
    purpose: 'Graduate tuition financing.',
    officer: 'L. Chen',
    riskScore: 19,
    timeline: makeTimeline(5),
  },
  {
    id: 'LN-47988',
    applicant: 'Tobias King',
    email: 'tobias.king@example.com',
    type: 'Home',
    amount: 415000,
    termMonths: 360,
    rate: 6.6,
    status: 'under-review',
    creditScore: 728,
    income: 154000,
    submittedAt: 'Mar 01, 2025',
    purpose: 'Refinance of existing mortgage.',
    officer: 'J. Mensah',
    riskScore: 33,
    timeline: makeTimeline(3),
  },
  {
    id: 'LN-47921',
    applicant: 'Hana Suzuki',
    email: 'hana.suzuki@example.com',
    type: 'Business',
    amount: 89000,
    termMonths: 72,
    rate: 8.7,
    status: 'submitted',
    creditScore: 690,
    income: 138000,
    submittedAt: 'Mar 06, 2025',
    purpose: 'Equipment purchase for manufacturing line.',
    officer: 'Unassigned',
    riskScore: 47,
    timeline: makeTimeline(1),
  },
  {
    id: 'LN-47855',
    applicant: 'Leo Martins',
    email: 'leo.martins@example.com',
    type: 'Auto',
    amount: 29900,
    termMonths: 48,
    rate: 8.1,
    status: 'approved',
    creditScore: 766,
    income: 84000,
    submittedAt: 'Feb 24, 2025',
    purpose: 'Used vehicle purchase.',
    officer: 'L. Chen',
    riskScore: 22,
    timeline: makeTimeline(4),
  },
]

// The "current applicant" whose dashboard we render.
export const currentApplicant = {
  name: 'Amara Okafor',
  email: 'amara.okafor@example.com',
  memberSince: '2021',
  applications: applications.filter(
    (a) => a.email === 'amara.okafor@example.com',
  ),
}

export const monthlyVolume = [
  { month: 'Sep', approved: 42, rejected: 11, volume: 4.2 },
  { month: 'Oct', approved: 48, rejected: 9, volume: 5.1 },
  { month: 'Nov', approved: 51, rejected: 14, volume: 5.6 },
  { month: 'Dec', approved: 39, rejected: 8, volume: 4.0 },
  { month: 'Jan', approved: 58, rejected: 12, volume: 6.4 },
  { month: 'Feb', approved: 64, rejected: 10, volume: 7.2 },
  { month: 'Mar', approved: 71, rejected: 13, volume: 8.1 },
]

export const loanMix = [
  { type: 'Home', value: 38, fill: 'var(--color-home)' },
  { type: 'Auto', value: 22, fill: 'var(--color-auto)' },
  { type: 'Business', value: 18, fill: 'var(--color-business)' },
  { type: 'Personal', value: 14, fill: 'var(--color-personal)' },
  { type: 'Education', value: 8, fill: 'var(--color-education)' },
]

export const approvalTrend = [
  { week: 'W1', rate: 74 },
  { week: 'W2', rate: 71 },
  { week: 'W3', rate: 78 },
  { week: 'W4', rate: 82 },
  { week: 'W5', rate: 80 },
  { week: 'W6', rate: 85 },
  { week: 'W7', rate: 83 },
  { week: 'W8', rate: 87 },
]
