import type { AuthUser } from './useAuth'
import type { PublicPlanSetting, ApiResponse } from '~/types/api'
export type { PublicPlanSetting } from '~/types/api'

export interface PaymentTransaction {
  id: string
  user_id: string
  plan_key: string
  amount_thb: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired' | 'refunded'
  provider: string
  checkout_reference: string
  provider_reference: string | null
  payment_url: string | null
  slip_storage_id: string | null
  review_reason: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  expires_at: string
  paid_at: string | null
  /** Set once the approved payment has actually been applied to the user's plan. */
  activated_at: string | null
  /** Derived by the API: `status === 'paid' && !activated_at`. */
  awaiting_verification: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Thrown by `createCheckout` when the backend reports (HTTP 409) that the
 * user already has an open transaction (pending, or paid-but-unactivated).
 * `paymentId` lets the caller route straight to the existing payment.
 */
export class OpenPaymentConflictError extends Error {
  status = 409 as const
  paymentId: string | null

  constructor(message: string, paymentId: string | null) {
    super(message)
    this.name = 'OpenPaymentConflictError'
    this.paymentId = paymentId
  }
}

/** True when a payment was approved but is still waiting on email verification to activate. */
export function isAwaitingVerification(payment: Pick<PaymentTransaction, 'status' | 'activated_at' | 'awaiting_verification'> | null | undefined): boolean {
  if (!payment) return false
  if (typeof payment.awaiting_verification === 'boolean') return payment.awaiting_verification
  return payment.status === 'paid' && !payment.activated_at
}

export interface BankInfo {
  bank_name: string
  bank_account_name: string
  bank_account_number: string
  bank_account_type: string
  prompt_pay_id: string
  bank_logo_url: string
}

export function useBilling() {
  const config = useRuntimeConfig()
  const { getToken } = useAuth()

  function authHeaders(): Record<string, string> {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function listPublicPlans(): Promise<PublicPlanSetting[]> {
    const res = await $fetch<ApiResponse<PublicPlanSetting[]>>(
      `${config.public.apiBase}/public/plans`,
    )
    return (res.data ?? []).filter((plan) => plan.is_enabled !== false)
  }

  async function createCheckout(planKey: string, provider = 'manual'): Promise<PaymentTransaction> {
    try {
      const res = await $fetch<ApiResponse<PaymentTransaction>>(
        `${config.public.apiBase}/billing/checkout`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: { plan_key: planKey, provider },
        },
      )
      return res.data
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode ?? err?.response?.status
      if (status === 409) {
        const errData = err?.data?.data ?? err?.data ?? {}
        const paymentId =
          errData.payment_id ?? errData.paymentId ?? errData.id ?? null
        throw new OpenPaymentConflictError(
          err?.data?.message || 'You already have an open payment for this plan.',
          paymentId ? String(paymentId) : null,
        )
      }
      throw err
    }
  }

  async function getPayment(id: string): Promise<PaymentTransaction> {
    const res = await $fetch<ApiResponse<PaymentTransaction>>(
      `${config.public.apiBase}/billing/payments/${id}`,
      { headers: authHeaders() },
    )
    return res.data
  }

  async function listMyPayments(limit = 20): Promise<PaymentTransaction[]> {
    const res = await $fetch<ApiResponse<PaymentTransaction[]>>(
      `${config.public.apiBase}/billing/payments?limit=${limit}`,
      { headers: authHeaders() },
    )
    return res.data ?? []
  }

  async function getPaymentMethods(): Promise<BankInfo> {
    const res = await $fetch<ApiResponse<BankInfo>>(
      `${config.public.apiBase}/billing/payment-methods`,
      { headers: authHeaders() },
    )
    return res.data
  }

  async function submitSlip(paymentId: string, storageId: string): Promise<PaymentTransaction> {
    const res = await $fetch<ApiResponse<PaymentTransaction>>(
      `${config.public.apiBase}/billing/payments/${paymentId}/slip`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: { storage_id: storageId },
      },
    )
    return res.data
  }

  function toPlanDisplayName(planKey: string, fallback?: AuthUser | null) {
    const key = (planKey || '').trim().toLowerCase()
    const map: Record<string, string> = {
      free: 'Free',
      basic: 'Basic',
      pro: 'Pro',
      enterprise: 'Enterprise',
    }
    return map[key] ?? fallback?.plan ?? key
  }

  async function cancelSubscription(cancelMonth?: number, cancelYear?: number): Promise<AuthUser> {
    const res = await $fetch<ApiResponse<AuthUser>>(
      `${config.public.apiBase}/billing/cancel`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: cancelMonth && cancelYear ? { cancel_month: cancelMonth, cancel_year: cancelYear } : {},
      },
    )
    return res.data
  }

  return {
    listPublicPlans,
    createCheckout,
    getPayment,
    listMyPayments,
    getPaymentMethods,
    submitSlip,
    toPlanDisplayName,
    cancelSubscription,
  }
}
