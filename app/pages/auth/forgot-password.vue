<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col overflow-hidden">
    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[400px]">

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold tracking-tight text-zinc-900 mb-1.5">{{ $t('auth.forgotPassword.title') }}</h1>
          <p class="text-[14px] text-zinc-500">{{ $t('auth.forgotPassword.subtitle') }}</p>
        </div>

        <!-- Success State -->
        <div v-if="submitted" class="rounded-2xl border border-zinc-200 bg-white p-7 text-center space-y-4 shadow-card">
          <div class="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-[13px] text-zinc-600 leading-relaxed">
            {{ $t('auth.forgotPassword.successMsg') }}
          </p>
          <div class="pt-2">
            <NuxtLink to="/auth/login" class="inline-block w-full py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-[13.5px] font-semibold transition-all shadow-xs cursor-pointer">
              {{ $t('auth.forgotPassword.backToLogin') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Card Form -->
        <div v-else class="relative rounded-2xl border border-zinc-200 bg-white shadow-card p-7">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-[12.5px] font-medium text-zinc-700 mb-1.5">{{ $t('auth.login.emailLabel') }}</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full bg-white border border-zinc-200 focus:border-zinc-400 rounded-xl px-3.5 py-2.5 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || !email"
              class="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed text-[13.5px] cursor-pointer"
            >
              <AppSpinner v-if="loading" size="md" />
              {{ loading ? $t('common.loading') : $t('auth.forgotPassword.submitBtn') }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })
const { forgotPassword } = useAuth()
const { success, error: toastError } = useToast()
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const email = ref('')
const loading = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  if (!email.value) return
  loading.value = true
  try {
    const msg = await forgotPassword(email.value)
    submitted.value = true
    success(msg || t('auth.forgotPassword.successMsg'))
  } catch (err: any) {
    toastError(err?.data?.message || err?.message || t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>
