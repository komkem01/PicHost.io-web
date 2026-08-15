import type { FetchOptions } from 'ofetch'

/**
 * Shared API fetch utility that automatically adds Authorization headers,
 * unwraps standard API responses, and handles 401 token refresh retries.
 */
export async function apiFetch<T = any>(
  request: string,
  options: FetchOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const { getToken, refreshToken } = useAuth()

  let lang = 'th'
  try {
    const nuxtApp = useNuxtApp()
    if ((nuxtApp as any)?.$i18n?.locale?.value) {
      lang = (nuxtApp as any).$i18n.locale.value
    }
  } catch {}

  const token = getToken()
  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
  const langHeader: Record<string, string> = { 'Accept-Language': lang }

  const mergedOptions: FetchOptions = {
    baseURL: config.public.apiBase,
    ...options,
    headers: {
      ...langHeader,
      ...authHeader,
      ...(options.headers as Record<string, string>),
    },
  }

  try {
    return await $fetch<T>(request, mergedOptions as any)
  } catch (err: any) {
    // If 401 Unauthorized occurs and we have a token, attempt refresh & retry once
    if (err?.status === 401 || err?.response?.status === 401) {
      const refreshed = await refreshToken()
      if (refreshed) {
        const newToken = getToken()
        const retryHeaders: Record<string, string> = newToken ? { Authorization: `Bearer ${newToken}` } : {}
        return await $fetch<T>(request, {
          ...mergedOptions,
          headers: {
            ...mergedOptions.headers,
            ...retryHeaders,
          },
        } as any)
      }
    }
    throw err
  }
}

/**
 * Uploads FormData with real XMLHttpRequest progress callback.
 */
export function uploadFileWithProgress<T = any>(
  endpoint: string,
  formData: FormData,
  onProgress?: (progressPercent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const config = useRuntimeConfig()
    const { getToken } = useAuth()
    const xhr = new XMLHttpRequest()

    let lang = 'th'
    try {
      const nuxtApp = useNuxtApp()
      if ((nuxtApp as any)?.$i18n?.locale?.value) {
        lang = (nuxtApp as any).$i18n.locale.value
      }
    } catch {}

    const url = `${config.public.apiBase}${endpoint}`
    xhr.open('POST', url)

    const token = getToken()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.setRequestHeader('Accept-Language', lang)

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data as T)
        } else {
          reject({ status: xhr.status, data })
        }
      } catch (err) {
        reject({ status: xhr.status, error: err })
      }
    }

    xhr.onerror = () => reject({ status: xhr.status, error: 'Network error' })
    xhr.send(formData)
  })
}
