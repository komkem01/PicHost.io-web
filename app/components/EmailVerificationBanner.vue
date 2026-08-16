<template>
  <div
    v-if="showBanner"
    class="w-full bg-amber-500/10 border-b border-amber-500/20 text-amber-900 px-4 py-2.5 transition-all duration-300"
  >
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p class="font-medium text-amber-900 truncate">
          {{ locale === 'th' ? 'กรุณายืนยันอีเมลเพื่อเปิดใช้งานการอัปเกรดแพ็กเกจเต็มรูปแบบ' : 'Please verify your email to enable full plan upgrades.' }}
          <span class="hidden md:inline opacity-75">({{ user?.email }})</span>
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <span v-if="successMsg" class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          {{ successMsg }}
        </span>
        <span v-else-if="errorMsg" class="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
          {{ errorMsg }}
        </span>

        <button
          type="button"
          @click="handleResend"
          :disabled="loading || cooldown > 0"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <AppSpinner v-if="loading" size="sm" />
          <template v-if="cooldown > 0">
            {{ locale === 'th' ? `ลองอีกครั้งใน ${cooldown}s` : `Retry in ${cooldown}s` }}
          </template>
          <template v-else-if="loading">
            {{ locale === 'th' ? 'กำลังส่ง…' : 'Sending…' }}
          </template>
          <template v-else>
            {{ locale === 'th' ? 'ส่งอีเมลยืนยันอีกครั้ง' : 'Resend Email' }}
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { user, resendVerification } = useAuth()

const loading = ref(false)
const cooldown = ref(0)
const successMsg = ref('')
const errorMsg = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const showBanner = computed(() => !!(user.value && !user.value.is_guest && !user.value.email_verified_at))

async function handleResend() {
  if (loading.value || cooldown.value > 0) return
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const msg = await resendVerification()
    successMsg.value = locale.value === 'th' ? 'ส่งอีเมลเรียบร้อยแล้ว!' : (msg || 'Verification email sent!')
    startCooldown(60)
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || (locale.value === 'th' ? 'ไม่สามารถส่งอีเมลได้' : 'Failed to send email')
  } finally {
    loading.value = false
  }
}

function startCooldown(sec: number) {
  cooldown.value = sec
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
