<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col overflow-hidden">
    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[400px]">

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold tracking-tight text-zinc-900 mb-1.5">{{ $t('auth.resetPassword.title') }}</h1>
          <p class="text-[14px] text-zinc-500">{{ $t('auth.resetPassword.subtitle') }}</p>
        </div>

        <!-- Missing Token Warning -->
        <div v-if="!token" class="rounded-2xl border border-red-200 bg-white p-7 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-zinc-900">Invalid Reset Link</h3>
          <div class="pt-2">
            <NuxtLink to="/auth/forgot-password" class="inline-block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13.5px] font-semibold transition-all shadow-xs cursor-pointer">
              {{ $t('auth.forgotPassword.submitBtn') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="successState" class="rounded-2xl border border-emerald-200 bg-white p-7 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-zinc-900">{{ $t('auth.resetPassword.successMsg') }}</h3>
          <div class="pt-2">
            <NuxtLink to="/auth/login" class="inline-block w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13.5px] font-semibold transition-all shadow-xs cursor-pointer">
              {{ $t('auth.login.submitBtn') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Card Form -->
        <div v-else class="relative rounded-2xl border border-zinc-200 bg-white shadow-card p-7">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-[12.5px] font-medium text-zinc-700 mb-1.5">{{ $t('settings.security.newPassword') }}</label>
              <div class="relative">
                <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="At least 8 characters"
                  class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 pr-10 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-[12.5px] font-medium text-zinc-700 mb-1.5">{{ $t('settings.security.confirmPassword') }}</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                placeholder="Repeat new password"
                class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
                :class="confirmPassword && newPassword !== confirmPassword ? 'border-red-300' : ''"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || !newPassword || newPassword.length < 8 || newPassword !== confirmPassword"
              class="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed text-[13.5px] cursor-pointer"
            >
              <AppSpinner v-if="loading" size="md" />
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
