<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex flex-col overflow-hidden">
    <!-- Background glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[-10%] right-[10%] w-[400px] h-[350px] bg-indigo-700/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Fixed header -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-[#09090b]/90 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-blue-500 text-2xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-2xl font-light">.io</span>
        </NuxtLink>
        <p class="text-sm text-white/40">
          New here?
          <NuxtLink to="/auth/register" class="text-blue-400 hover:text-blue-300 transition-colors font-medium ml-1">
            Create account
          </NuxtLink>
        </p>
      </div>
    </header>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[400px]">

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold tracking-tight text-white mb-1.5">Welcome back</h1>
          <p class="text-[14px] text-white/40">Sign in to continue to PicHost.io</p>
        </div>

        <!-- Card -->
        <div class="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 p-7">
          <!-- Subtle top shimmer -->
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-t-2xl"></div>

          <!-- Google OAuth -->
          <a
            :href="`${config.public.apiBase}/public/auth/google`"
            class="group w-full flex items-center justify-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/20 text-white/80 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-150 text-[13.5px] font-medium"
          >
            <svg class="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <!-- Divider -->
          <div class="relative my-5 flex items-center gap-3">
            <div class="flex-1 h-px bg-white/[0.07]"></div>
            <span class="text-[11px] text-white/25 tracking-wide uppercase">or</span>
            <div class="flex-1 h-px bg-white/[0.07]"></div>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
            <!-- Email -->
            <div>
              <label for="email" class="block text-[12.5px] font-medium text-white/50 mb-1.5">Email address</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :class="[
                    'w-full bg-white/[0.05] border rounded-xl pl-10 pr-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all duration-150 focus:bg-white/[0.07]',
                    fieldErrors.email
                      ? 'border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20'
                      : 'border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15',
                  ]"
                />
              </div>
              <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
                <p v-if="fieldErrors.email" class="mt-1.5 text-[11.5px] text-red-400 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ fieldErrors.email }}
                </p>
              </Transition>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-[12.5px] font-medium text-white/50 mb-1.5">Password</label>
              <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-white/25 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  :class="[
                    'w-full bg-white/[0.05] border rounded-xl pl-10 pr-10 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all duration-150 focus:bg-white/[0.07]',
                    fieldErrors.password
                      ? 'border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20'
                      : 'border-white/[0.09] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/15',
                  ]"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  <svg v-if="!showPassword" class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-[15px] h-[15px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
              <Transition enter-from-class="opacity-0 -translate-y-0.5" enter-active-class="transition duration-150">
                <p v-if="fieldErrors.password" class="mt-1.5 text-[11.5px] text-red-400 flex items-center gap-1">
                  <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  {{ fieldErrors.password }}
                </p>
              </Transition>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="relative w-full mt-2 overflow-hidden rounded-xl py-2.5 text-[13.5px] font-semibold text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              :class="loading ? 'bg-blue-600/70' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30'"
            >
              <span class="flex items-center justify-center gap-2">
                <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ loading ? 'Signing in…' : 'Sign In' }}
              </span>
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

interface ErrorBody {
  code: string
  message: string
  data: null | {
    error?: string
    errors?: Record<string, { code: string; message: string; input: string }>
  }
}

const config = useRuntimeConfig()
const router = useRouter()
const { setToken, fetchMe } = useAuth()
const { error: toastError } = useToast()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const fieldErrors = reactive<Record<string, string>>({})
const showPassword = ref(false)

async function handleSubmit() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])

  if (!form.email) {
    fieldErrors.email = 'Email is required'
  }
  if (!form.password) {
    fieldErrors.password = 'Password is required'
  }
  if (Object.keys(fieldErrors).length) return

  loading.value = true
  try {
    const res = await $fetch<LoginResponse>(`${config.public.apiBase}/public/auth/login`, {
      method: 'POST',
      body: { email: form.email, password: form.password },
    })

    setToken(res.data.access_token)
    await fetchMe()
    router.push(res.data.user.is_admin ? '/admin' : '/dashboard')
  } catch (err: unknown) {
    const body = (err as { data?: ErrorBody })?.data
    if (body?.data?.errors) {
      for (const [key, val] of Object.entries(body.data.errors)) {
        fieldErrors[key] = val.message
      }
    } else if (body?.data?.error) {
      toastError(body.data.error)
    } else if (body?.message) {
      toastError(body.message)
    } else {
      toastError('Something went wrong. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>
