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
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
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
    return (res.data ?? []).filter((plan) => plan.is_enabled)
  }

  async function createCheckout(planKey: string, provider = 'manual'): Promise<PaymentTransaction> {
    const res = await $fetch<ApiResponse<PaymentTransaction>>(
      `${config.public.apiBase}/billing/checkout`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: { plan_key: planKey, provider },
      },
    )
    return res.data
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

  async function cancelSubscription(useUntilMonth?: string): Promise<void> {
    await $fetch(
      `${config.public.apiBase}/billing/cancel`,
      {
        method: 'POST',
        headers: authHeaders(),
        body: useUntilMonth ? { use_until_month: useUntilMonth } : {},
      },
    )
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
