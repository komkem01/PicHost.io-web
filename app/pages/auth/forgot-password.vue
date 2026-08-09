<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex flex-col overflow-hidden">
    <!-- Background glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[-10%] right-[10%] w-[400px] h-[350px] bg-indigo-700/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[400px]">

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-[28px] font-bold tracking-tight text-white mb-1.5">{{ $t('auth.forgotPassword.title') }}</h1>
          <p class="text-[14px] text-white/40">{{ $t('auth.forgotPassword.subtitle') }}</p>
        </div>

        <!-- Success State -->
        <div v-if="submitted" class="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-7 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-[13px] text-white/60 leading-relaxed">
            {{ $t('auth.forgotPassword.successMsg') }}
          </p>
          <div class="pt-2">
            <NuxtLink to="/auth/login" class="inline-block w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-[13.5px] font-semibold transition-all">
              {{ $t('auth.forgotPassword.backToLogin') }}
            </NuxtLink>
          </div>
        </div>

        <!-- Card Form -->
        <div v-else class="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl shadow-black/60 p-7">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-[12.5px] font-medium text-white/60 mb-1.5">{{ $t('auth.login.emailLabel') }}</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="name@example.com"
                class="w-full bg-white/[0.04] border border-white/[0.1] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || !email"
              class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed text-[13.5px]"
            >
              <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
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
