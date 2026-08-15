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
        class="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs"
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
            class="relative w-full max-w-[360px] rounded-2xl border border-zinc-200 bg-white shadow-modal p-6 text-center flex flex-col items-center"
          >
            <!-- Icon (Centered) -->
            <div class="w-11 h-11 rounded-2xl bg-red-50 border border-red-200/80 flex items-center justify-center mb-4 text-red-600 shadow-2xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>
              </svg>
            </div>

            <h3 class="text-zinc-900 font-bold text-base mb-1">
              {{ $t('auth.logoutModal.title') }}
            </h3>
            <p class="text-zinc-500 text-xs sm:text-sm mb-6 leading-relaxed">
              {{ $t('auth.logoutModal.subtitle') }}
            </p>

            <div class="flex gap-3 w-full">
              <button
                @click="close"
                class="flex-1 py-2.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="confirm"
                :disabled="loading"
                class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <AppSpinner v-if="loading" size="sm" />
                <span>{{ $t('auth.logoutModal.confirmBtn') }}</span>
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
const { success: toastSuccess } = useToast()
const { locale } = useI18n()
const router = useRouter()
const loading = ref(false)

async function confirm() {
  if (loading.value) return
  loading.value = true
  try {
    await logout()
  } catch (e) {
    // Ignore any network errors on logout
  } finally {
    loading.value = false
    close()
    toastSuccess(locale.value === 'th' ? 'ออกจากระบบเรียบร้อยแล้ว' : 'Signed out successfully')
    router.push('/')
  }
}
</script>
