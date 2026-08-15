export interface AuthUser {
  id: string
  email: string | null
  username: string | null
  plan: string
  plan_expires_at: string | null
  plan_cancelled_at: string | null
  email_verified_at: string | null
  is_active: boolean
  is_guest: boolean
  is_admin: boolean
}

interface MeResponse {
  code: string
  message: string
  data: AuthUser
}

interface RefreshResponse {
  code: string
  message: string
  data: {
    access_token: string
    token_type: string
    expires_in: number
    user: AuthUser
  }
}

// Module-level singletons shared across all composable instances
const user = ref<AuthUser | null>(null)
const initialized = ref(false)
let _refreshTimer: ReturnType<typeof setTimeout> | null = null
let _apiBase = ''

/** Decode JWT payload and return `exp` (Unix seconds), or null on failure. */
function _getJwtExp(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length < 3) return null
    const b64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(b64))
    return typeof payload.exp === 'number' ? payload.exp : null
  } catch {
    return null
  }
}

/** Schedule a silent refresh ~60 s before the token expires. */
function _scheduleRefresh(token: string) {
  if (!import.meta.client) return
  if (_refreshTimer) clearTimeout(_refreshTimer)
  const exp = _getJwtExp(token)
  if (!exp) return
  const delay = exp * 1000 - Date.now() - 60_000 // 1 min before expiry

  const MAX_DELAY = 86400000 // 24 hours
  if (delay > MAX_DELAY) {
    _refreshTimer = setTimeout(_doRefresh, MAX_DELAY)
  } else {
    _refreshTimer = setTimeout(_doRefresh, Math.max(0, delay))
  }
}

/** Call POST /public/auth/refresh (uses HttpOnly refresh-token cookie). */
async function _doRefresh(): Promise<boolean> {
  if (!_apiBase) return false
  try {
    const res = await $fetch<RefreshResponse>(`${_apiBase}/public/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    const token = res.data.access_token
    if (import.meta.client) localStorage.setItem('access_token', token)
    const cookie = useCookie('access_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
    cookie.value = token
    user.value = res.data.user
    _scheduleRefresh(token)
    return true
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status
    if (status === 401) {
      if (import.meta.client) localStorage.removeItem('access_token')
      const cookie = useCookie('access_token')
      cookie.value = null
      user.value = null
    }
    return false
  }
}

export function useAuth() {
  const config = useRuntimeConfig()
  _apiBase = config.public.apiBase as string

  function getToken(): string | null {
    if (import.meta.client) {
      const val = localStorage.getItem('access_token')
      if (val && val !== 'null' && val !== 'undefined' && val.trim() !== '') {
        return val
      }
    }
    const cookie = useCookie<string | null>('access_token')
    return cookie.value || null
  }

  function setToken(token: string) {
    const cookie = useCookie<string | null>('access_token', { maxAge: 60 * 60 * 24 * 7, path: '/' })
    if (!token || token.trim() === '') {
      cookie.value = null
      if (import.meta.client) localStorage.removeItem('access_token')
    } else {
      cookie.value = token
      if (import.meta.client) localStorage.setItem('access_token', token)
    }
  }

  function clearToken() {
    const cookie = useCookie<string | null>('access_token')
    cookie.value = null
    if (import.meta.client) localStorage.removeItem('access_token')
  }

  async function fetchMe(): Promise<AuthUser | null> {
    if (initialized.value && user.value !== null) {
      return user.value
    }

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
      _scheduleRefresh(token)
      return res.data
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status
      if (status === 401 || status === 404) {
        if (status === 401) {
          const ok = await _doRefresh()
          if (ok) {
            const newToken = getToken()
            if (newToken) {
              try {
                const res2 = await $fetch<MeResponse>(`${config.public.apiBase}/auth/me`, {
                  headers: { Authorization: `Bearer ${newToken}` },
                })
                user.value = res2.data
                initialized.value = true
                return res2.data
              } catch {}
            }
          }
        }
        clearToken()
        user.value = null
        initialized.value = true
        return null
      }
      return user.value
    }
  }

  function refreshMe(): Promise<AuthUser | null> {
    initialized.value = false
    return fetchMe()
  }

  function isTokenExpired(): boolean {
    const token = getToken()
    if (!token) return true
    const exp = _getJwtExp(token)
    if (!exp) return false
    return Date.now() >= exp * 1000
  }

  async function refreshToken(): Promise<boolean> {
    return _doRefresh()
  }

  async function resendVerificationEmail(): Promise<string> {
    const token = getToken()
    if (!token) throw new Error('Unauthenticated')
    const res = await $fetch<{ code: string; message: string }>(`${config.public.apiBase}/auth/resend-verification`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.message
  }

  async function logout() {
    if (_refreshTimer) clearTimeout(_refreshTimer)
    const token = getToken()
    try {
      await $fetch(`${config.public.apiBase}/public/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 3000,
      })
    } catch {
      // Ignore network or timeout errors on logout
    } finally {
      clearToken()
      user.value = null
      initialized.value = false
    }
  }

  async function forgotPassword(email: string): Promise<string> {
    const res = await $fetch<{ code: string; message: string }>(`${config.public.apiBase}/public/auth/forgot-password`, {
      method: 'POST',
      body: { email },
    })
    return res.message
  }

  async function resetPassword(token: string, password: string): Promise<string> {
    const res = await $fetch<{ code: string; message: string }>(`${config.public.apiBase}/public/auth/reset-password`, {
      method: 'POST',
      body: { token, password },
    })
    return res.message
  }

  async function verifyEmail(token: string): Promise<string> {
    const res = await $fetch<{ code: string; message: string }>(`${config.public.apiBase}/public/auth/verify-email`, {
      method: 'POST',
      body: { token },
    })
    return res.message
  }

  async function resendVerification(): Promise<string> {
    return resendVerificationEmail()
  }

  return {
    user: readonly(user),
    initialized: readonly(initialized),
    getToken,
    setToken,
    clearToken,
    fetchMe,
    refreshMe,
    logout,
    refreshToken,
    isTokenExpired,
    resendVerificationEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    verifyEmail,
  }
}
