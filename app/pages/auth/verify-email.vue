<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex flex-col overflow-hidden">
    <!-- Background glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[-10%] right-[10%] w-[400px] h-[350px] bg-indigo-700/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-12 pt-[88px]">
      <div class="w-full max-w-[420px]">

        <!-- Loading State -->
        <div v-if="verifying" class="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-white">Verifying Email</h3>
          <p class="text-[13.5px] text-white/50">Please wait while we confirm your email address…</p>
        </div>

        <!-- Success State -->
        <div v-else-if="successState" class="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-white">Email Verified!</h3>
          <p class="text-[13.5px] text-white/60 leading-relaxed">
            Your email address has been successfully verified. You now have full access to all PicHost.io features!
          </p>
          <div class="pt-2">
            <NuxtLink to="/dashboard" class="inline-block w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-[13.5px] font-semibold transition-all shadow-lg shadow-blue-600/20">
              Go to Dashboard
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-8 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div class="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-[18px] font-bold text-white">Verification Failed</h3>
          <p class="text-[13.5px] text-white/60 leading-relaxed">
            {{ errorMessage || 'The verification link is invalid or has expired.' }}
          </p>
          <div class="pt-2 space-y-2">
            <NuxtLink to="/settings/account" class="inline-block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[13.5px] font-semibold transition-all">
              Account Settings
            </NuxtLink>
            <NuxtLink to="/dashboard" class="inline-block w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white text-[13.5px] font-semibold transition-all">
              Go to Dashboard
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { verifyEmail } = useAuth()

const verifying = ref(true)
const successState = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const token = String(route.query.token || '').trim()
  if (!token) {
    verifying.value = false
    errorMessage.value = 'No verification token provided in URL.'
    return
  }

  try {
    await verifyEmail(token)
    successState.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.message || err?.message || 'Verification link is invalid or expired.'
  } finally {
    verifying.value = false
  }
})
</script>
