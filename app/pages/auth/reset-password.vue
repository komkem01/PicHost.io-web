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
        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
            {{ $t('auth.login.submitBtn') }}
          </NuxtLink>
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[400px]">

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold tracking-tight text-white mb-1.5">{{ $t('auth.resetPassword.title') }}</h1>
          <p class="text-[14px] text-white/40">{{ $t('auth.resetPassword.subtitle') }}</p>
        </div>

        <!-- Missing Token Warning -->
        <div v-if="!token" class="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-7 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-white">Invalid Reset Link</h3>
          <div class="pt-2">
            <NuxtLink to="/auth/forgot-password" class="inline-block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13.5px] font-semibold transition-all">
              {{ $t('auth.forgotPassword.submitBtn') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="successState" class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-7 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-white">{{ $t('auth.resetPassword.successMsg') }}</h3>
          <div class="pt-2">
            <NuxtLink to="/auth/login" class="inline-block w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13.5px] font-semibold transition-all">
              {{ $t('auth.login.submitBtn') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Card Form -->
        <div v-else class="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 p-7">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-[12.5px] font-medium text-white/60 mb-1.5">{{ $t('settings.security.newPassword') }}</label>
              <div class="relative">
                <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="At least 8 characters"
                  class="w-full bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-[12.5px] font-medium text-white/60 mb-1.5">{{ $t('settings.security.confirmPassword') }}</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="Repeat new password"
                class="w-full bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
                :class="confirmPassword && newPassword !== confirmPassword ? 'border-red-500/40' : ''"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword"
              class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed text-[13.5px]"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {{ loading ? $t('common.loading') : $t('auth.resetPassword.submitBtn') }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
const route = useRoute()
const { resetPassword } = useAuth()
const { success, error: toastError } = useToast()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const token = computed(() => String(route.query.token || '').trim())
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const successState = ref(false)

async function handleSubmit() {
  if (!token.value || !newPassword.value || newPassword.value !== confirmPassword.value) return
  loading.value = true
  try {
    const msg = await resetPassword(token.value, newPassword.value)
    successState.value = true
    success(msg || t('auth.resetPassword.successMsg'))
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>
