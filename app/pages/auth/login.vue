<template>
  <div class="min-h-[calc(100vh-64px)] bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col justify-center items-center px-4 py-6 sm:py-10">
    <div class="w-full max-w-[440px] mx-auto my-auto">

      <!-- Heading -->
      <div class="text-center mb-6">
        <h1 class="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900 mb-1.5">{{ $t('auth.login.title') }}</h1>
        <p class="text-[13.5px] text-zinc-500">{{ $t('auth.login.subtitle') }}</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-zinc-200 bg-white shadow-card p-6 sm:p-7">
        <!-- Form -->
        <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-[12.5px] font-medium text-zinc-700 mb-1.5">{{ $t('auth.login.emailLabel') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :class="[
                'w-full bg-white border rounded-xl px-3.5 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-150',
                fieldErrors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                  : 'border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200',
              ]"
            />
            <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
              <p v-if="fieldErrors.email" class="mt-1.5 text-[11.5px] text-red-600">
                {{ fieldErrors.email }}
              </p>
            </Transition>
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="password" class="block text-[12.5px] font-medium text-zinc-700">{{ $t('auth.login.passwordLabel') }}</label>
              <NuxtLink to="/auth/forgot-password" class="text-[11.5px] text-zinc-500 hover:text-zinc-900 transition-colors">
                {{ $t('auth.login.forgotPassword') }}
              </NuxtLink>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                :class="[
                  'w-full bg-white border rounded-xl px-3.5 pr-10 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-150',
                  fieldErrors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-200'
                    : 'border-zinc-200 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-200',
                ]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
              <p v-if="fieldErrors.password" class="mt-1.5 text-[11.5px] text-red-600">
                {{ fieldErrors.password }}
              </p>
            </Transition>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="relative w-full mt-1 rounded-xl py-2.5 text-[13.5px] font-semibold text-white bg-zinc-900 hover:bg-zinc-800 shadow-xs transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span class="flex items-center justify-center gap-2">
              <AppSpinner v-if="loading" size="md" />
              {{ loading ? $t('common.loading') : $t('auth.login.submitBtn') }}
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-4 flex items-center gap-3">
          <div class="flex-1 h-px bg-zinc-200"></div>
          <span class="text-[11px] text-zinc-400 font-medium lowercase">or</span>
          <div class="flex-1 h-px bg-zinc-200"></div>
        </div>

        <!-- Google Sign-In (at bottom) -->
        <a
          :href="`${config.public.apiBase}/public/auth/google`"
          class="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-900 px-4 py-2.5 rounded-xl transition-all duration-150 text-[13.5px] font-medium shadow-xs cursor-pointer"
        >
          <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ $t('auth.login.googleBtn') }}
        </a>
      </div>

      <!-- Register Link -->
      <p class="text-center text-[13px] text-zinc-500 mt-5">
        {{ $t('auth.login.noAccount') }}
        <NuxtLink to="/auth/register" class="font-semibold text-zinc-900 hover:underline transition-all ml-1">
          {{ $t('auth.login.registerLink') }}
        </NuxtLink>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

interface LoginResponse {
  code: string
  message: string
  data: {
    access_token: string
    token_type: string
    expires_in: number
    user: {
      id: string
      email: string | null
      username: string | null
      plan: string
      is_active: boolean
      is_guest: boolean
      is_admin: boolean
    }
  }
}

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const { setToken, fetchMe } = useAuth()
const { success: toastSuccess, error: toastError } = useToast()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const fieldErrors = reactive<Record<string, string>>({})
const showPassword = ref(false)

async function handleSubmit() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  if (!form.email) {
    fieldErrors.email = locale.value === 'th' ? 'กรุณากรอกอีเมล' : 'Email is required'
  }
  if (!form.password) {
    fieldErrors.password = locale.value === 'th' ? 'กรุณากรอกรหัสผ่าน' : 'Password is required'
  }
  if (Object.keys(fieldErrors).length) return

  loading.value = true
  try {
    const res = await apiFetch<LoginResponse>('/public/auth/login', {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    setToken(res.data.access_token)
    await fetchMe()
    toastSuccess(locale.value === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Signed in successfully')
    const redirectPath = String(route.query.redirect ?? '').trim()
    if (redirectPath && redirectPath.startsWith('/') && !redirectPath.startsWith('//') && !redirectPath.startsWith('/auth')) {
      router.push(redirectPath)
    } else {
      router.push(res.data.user.is_admin ? '/admin' : '/dashboard')
    }
  } catch (err: any) {
    const msg = err?.data?.data?.error || err?.data?.message || t('common.error')
    toastError(msg)
  } finally {
    loading.value = false
  }
}
</script>
