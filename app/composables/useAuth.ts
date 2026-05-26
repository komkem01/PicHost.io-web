export interface AuthUser {
  id: string
  email: string | null
  username: string | null
  plan: string
  plan_expires_at: string | null
  plan_cancelled_at: string | null
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
    // JWT payload is the second segment; base64url-encoded
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
  _refreshTimer = setTimeout(_doRefresh, Math.max(0, delay))
}

/** Call POST /public/auth/refresh (uses HttpOnly refresh-token cookie). */
async function _doRefresh(): Promise<boolean> {
  if (!_apiBase || !import.meta.client) return false
  try {
    const res = await $fetch<RefreshResponse>(`${_apiBase}/public/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    const token = res.data.access_token
    localStorage.setItem('access_token', token)
    user.value = res.data.user
    _scheduleRefresh(token)
    return true
  } catch (err: any) {
    // Only clear auth state on a definitive 401 (refresh token expired/invalid).
    // Network errors, 5xx, CORS failures, etc. must NOT log the user out.
    const status = err?.status ?? err?.response?.status
    if (status === 401) {
      localStorage.removeItem('access_token')
      user.value = null
    }
    return false
  }
}

export function useAuth() {
  const config = useRuntimeConfig()
  // Store apiBase once so module-level functions can use it
  _apiBase = config.public.apiBase as string

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
    // If already initialized with a valid user, return cached value without hitting the API.
    // This prevents spurious logouts when navigating between pages.
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
      // 401 → try silent refresh once, then retry
      const status = err?.status ?? err?.response?.status
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
        // Definitive 401 — user is not authenticated
        user.value = null
        initialized.value = true
        return null
      }
      // Non-401 error (network error, 5xx): preserve existing user state.
      // A transient backend failure should never log the user out.
      initialized.value = true
      return user.value
    }
  }

  /** Force re-fetch from API, bypassing the cache. Use after profile updates. */
  async function refreshMe(): Promise<AuthUser | null> {
    initialized.value = false
    return fetchMe()
  }

  /** Expose a manual refresh for external callers (e.g. visibility-change). */
  async function refreshToken(): Promise<boolean> {
    return _doRefresh()
  }

  /**
   * Returns true if the stored access token is missing, already expired,
   * or within `bufferSeconds` of expiry (default 60 s).
   * Use this to gate visibility-change refreshes so we don't hit the backend
   * unnecessarily when the token is still healthy.
   */
  function isTokenExpired(bufferSeconds = 60): boolean {
    const token = getToken()
    if (!token) return true
    const exp = _getJwtExp(token)
    if (!exp) return true
    return exp * 1000 - Date.now() < bufferSeconds * 1000
  }

  async function logout() {
    if (_refreshTimer) clearTimeout(_refreshTimer)
    const token = getToken()
    try {
      await $fetch(`${config.public.apiBase}/public/auth/logout`, {
        method: 'POST',
        credentials: 'include',
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
    refreshMe,
    logout,
    refreshToken,
    isTokenExpired,
  }
}
