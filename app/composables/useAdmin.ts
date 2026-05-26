export interface AdminUser {
  id: string
  email: string | null
  username: string | null
  plan: string
  is_active: boolean
  is_guest: boolean
  is_admin: boolean
  created_at: string
  used_storage_bytes: number | null
  image_count: number | null
}

export interface DashboardStats {
  total_users: number
  active_users: number
  guest_users: number
  plan_breakdown: Record<string, number>
}

export interface AdminPlanSetting {
  plan_key: string
  display_name: string
  monthly_price_thb: number
  storage_limit_bytes: number
  image_limit: number
  max_upload_mb: number
  is_enabled: boolean
  allow_private: boolean
  custom_domain: boolean
  api_access: boolean
  priority_support: boolean
  no_ads: boolean
  watermark_removal: boolean
  updated_at: string
}

interface ApiResponse<T> {
  code: string
  message: string
  data: T
}

export function useAdmin() {
  const config = useRuntimeConfig()
  const { getToken } = useAuth()

  function headers(): Record<string, string> {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function getStats(): Promise<DashboardStats> {
    const res = await $fetch<ApiResponse<DashboardStats>>(
      `${config.public.apiBase}/admin/stats`,
      { headers: headers() },
    )
    return res.data
  }

  async function listUsers(): Promise<AdminUser[]> {
    const res = await $fetch<ApiResponse<AdminUser[]>>(
      `${config.public.apiBase}/admin/users`,
      { headers: headers() },
    )
    return res.data
  }

  async function getUser(id: string): Promise<AdminUser> {
    const res = await $fetch<ApiResponse<AdminUser>>(
      `${config.public.apiBase}/admin/users/${id}`,
      { headers: headers() },
    )
    return res.data
  }

  async function setUserPlan(id: string, plan: string): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/users/${id}/plan`, {
      method: 'PATCH',
      headers: headers(),
      body: { plan },
    })
  }

  async function setUserActive(id: string, isActive: boolean): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/users/${id}/active`, {
      method: 'PATCH',
      headers: headers(),
      body: { is_active: isActive },
    })
  }

  async function setUserAdmin(id: string, isAdmin: boolean): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/users/${id}/admin`, {
      method: 'PATCH',
      headers: headers(),
      body: { is_admin: isAdmin },
    })
  }

  async function deleteUser(id: string): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/users/${id}`, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  async function updateUserProfile(id: string, payload: { email?: string | null; username?: string | null }): Promise<AdminUser> {
    const res = await $fetch<ApiResponse<AdminUser>>(
      `${config.public.apiBase}/admin/users/${id}/profile`,
      {
        method: 'PATCH',
        headers: headers(),
        body: payload,
      },
    )
    return res.data
  }

  async function listPlanSettings(): Promise<AdminPlanSetting[]> {
    const res = await $fetch<ApiResponse<AdminPlanSetting[]>>(
      `${config.public.apiBase}/admin/plans`,
      { headers: headers() },
    )
    return res.data
  }

  async function getPlanSetting(key: string): Promise<AdminPlanSetting> {
    const res = await $fetch<ApiResponse<AdminPlanSetting>>(
      `${config.public.apiBase}/admin/plans/${encodeURIComponent(key)}`,
      { headers: headers() },
    )
    return res.data
  }

  async function updatePlanSetting(key: string, payload: Omit<AdminPlanSetting, 'plan_key' | 'updated_at'>): Promise<AdminPlanSetting> {
    const res = await $fetch<ApiResponse<AdminPlanSetting>>(
      `${config.public.apiBase}/admin/plans/${encodeURIComponent(key)}`,
      {
        method: 'PATCH',
        headers: headers(),
        body: payload,
      },
    )
    return res.data
  }

  async function deletePlanSetting(key: string): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/plans/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: headers(),
    })
  }

  interface AdminPaymentListResponse {
    data: import('./useBilling').PaymentTransaction[]
    paginate: { page: number; size: number; total: number }
  }

  async function adminListPayments(limit = 50, offset = 0): Promise<{ data: import('./useBilling').PaymentTransaction[]; total: number }> {
    const res = await $fetch<AdminPaymentListResponse>(
      `${config.public.apiBase}/admin/payments?limit=${limit}&offset=${offset}`,
      { headers: headers() },
    )
    return { data: res.data ?? [], total: res.paginate?.total ?? 0 }
  }

  async function adminConfirmPayment(
    id: string,
    status: 'paid' | 'failed' | 'cancelled',
    reviewReason?: string,
  ): Promise<void> {
    await $fetch(`${config.public.apiBase}/admin/payments/${id}/confirm`, {
      method: 'PATCH',
      headers: headers(),
      body: {
        status,
        review_reason: reviewReason?.trim() || undefined,
      },
    })
  }

  return {
    getStats,
    listUsers,
    getUser,
    setUserPlan,
    setUserActive,
    setUserAdmin,
    deleteUser,
    updateUserProfile,
    listPlanSettings,
    getPlanSetting,
    updatePlanSetting,
    deletePlanSetting,
    adminListPayments,
    adminConfirmPayment,
  }
}
