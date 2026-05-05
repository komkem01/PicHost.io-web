export interface AuthUser {
  id: string
  email: string | null
  username: string | null
  plan: string
  is_active: boolean
  is_guest: boolean
}

interface MeResponse {
  code: string
  message: string
  data: AuthUser
}

const user = ref<AuthUser | null>(null)
const initialized = ref(false)

export function useAuth() {
  const config = useRuntimeConfig()

  function getToken(): string | null {
    if (import.meta.client) return localStorage.getItem('access_token')
    return null
  }

  function setToken(token: string) {
    if (import.meta.client) localStorage.setItem('access_token', token)
  }

  function clearToken() {
    if (import.meta.client) localStorage.removeItem('access_token')
  }

  async function fetchMe(): Promise<AuthUser | null> {
    const token = getToken()
    if (!token) {
      user.value = null
      initialized.value = true
      return null
    }
    try {
      const res = await $fetch<MeResponse>(`${config.public.apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      user.value = res.data
      initialized.value = true
      return res.data
    } catch {
      user.value = null
      initialized.value = true
      return null
    }
  }

  async function logout() {
    const token = getToken()
    try {
      await $fetch(`${config.public.apiBase}/public/auth/logout`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch {}
    clearToken()
    user.value = null
  }

  return {
    user: readonly(user),
    initialized: readonly(initialized),
    getToken,
    setToken,
    fetchMe,
    logout,
  }
}
