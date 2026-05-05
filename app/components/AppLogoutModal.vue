<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      enter-active-class="transition duration-150"
      leave-to-class="opacity-0"
      leave-active-class="transition duration-100"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="close"
      >
        <Transition
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-active-class="transition duration-150"
          leave-to-class="opacity-0 scale-95"
          leave-active-class="transition duration-100"
        >
          <div
            v-if="show"
            class="relative w-full max-w-[360px] rounded-2xl border border-white/[0.08] bg-[#111113] shadow-2xl shadow-black/80 p-6"
          >
            <!-- Top shimmer -->
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-2xl"></div>

            <!-- Icon -->
            <div class="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
              </svg>
            </div>

            <h3 class="text-white font-semibold text-[15px] mb-1">Sign out?</h3>
            <p class="text-white/40 text-[13px] mb-6">You will be redirected to the home page.</p>

            <div class="flex gap-3">
              <button
                @click="close"
                class="flex-1 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-white/70 hover:text-white text-[13px] font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirm"
                :disabled="loading"
                class="flex-1 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-[13px] font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { show, close } = useLogoutModal()
const { logout } = useAuth()
const router = useRouter()
const loading = ref(false)

async function confirm() {
  loading.value = true
  await logout()
  close()
  router.push('/')
}
</script>
