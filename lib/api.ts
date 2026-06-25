import type { LoanApplication, AnalyticsData } from '@/lib/data'
import { API_BASE_URL } from '@/src/config/api'

const API_BASE = API_BASE_URL
const API_TIMEOUT_MS = 10000

function createTimeoutSignal(timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  }
}

async function request<T>(path: string, options: RequestInit = {}) {
  const { signal, clear } = createTimeoutSignal()

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
      signal,
      cache: 'no-store',
    })

    clear()

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(body || `API request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your connection and try again.')
    }

    throw error
  }
}

export interface CreateApplicationPayload {
  applicant_id: number
  type: string
  termMonths: number
  rate: number
  amount: number
  annualIncome: number
  employmentType: string
  purpose: string
  educationSignal?: string
  careerSignal?: string
  monthlyIncome?: number
  monthlyExpenses?: number
  cashFlowStability?: string
  profileType?: string
  coApplicantName?: string
  coApplicantRelationship?: string
  coApplicantIncome?: number
  coApplicantCreditScore?: number
}

export interface ConsentPayload {
  user_id: number
  application_id?: number | null
  consent_text: string
  consented: boolean
}

export interface DocumentMetadataPayload {
  document_type: string
  file_url: string
  hint?: string
  status?: string
}

export interface ReviewDecisionPayload {
  officer_id: number
  decision: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED'
  remarks?: string
}

export async function getApplications(applicantId?: number) {
  const query = applicantId ? `?applicant_id=${applicantId}` : ''
  return request<LoanApplication[]>(`/applications${query}`)
}

export async function getApplication(applicationId: number) {
  return request<LoanApplication>(`/applications/${applicationId}`)
}

export async function createApplication(payload: CreateApplicationPayload) {
  return request<LoanApplication>('/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getScoreBreakdown(applicationId: number) {
  return request<{
    application_id: number
    readiness_score: number
    credit_score: number
    trust_score: number
    approval_probability: number
    reasons: string[]
    recommendations: string[]
    breakdown: Record<string, unknown>
    created_at: string
  }>(`/applications/${applicationId}/score-breakdown`)
}

export async function getStatusHistory(applicationId: number) {
  return request<
    {
      id: number
      application_id: number
      status: string
      note?: string
      created_at: string
    }[]
  >(`/applications/${applicationId}/status-history`)
}

export async function uploadDocumentMetadata(applicationId: number, payload: DocumentMetadataPayload) {
  return request<{ id: number; application_id: number; document_type: string; file_url: string; hint?: string; status: string; created_at: string }>(
    `/applications/${applicationId}/documents`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}

export async function submitReviewDecision(applicationId: number, payload: ReviewDecisionPayload) {
  return request<LoanApplication>(`/applications/${applicationId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getAnalytics() {
  return request<AnalyticsData>('/applications/analytics')
}

export async function submitConsent(payload: ConsentPayload) {
  return request<{ id: number; user_id: number; application_id?: number | null; consent_text: string; consented: boolean; created_at: string }>('/users/consent', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface LoginPayload {
  email: string
  password: string
}

export async function loginUser(payload: LoginPayload) {
  return request<{ id: number; name: string; email: string; role: string }>(
    '/users/login',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
}