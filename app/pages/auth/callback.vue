<template>
  <div class="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-sans">
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner -->
      <svg
        class="w-8 h-8 text-zinc-900 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
      </svg>
      <p class="text-zinc-500 text-sm font-medium">Signing you in…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { setToken, fetchMe } = useAuth()
const { success: toastSuccess, error: toastError } = useToast()
const { locale } = useI18n()

onMounted(async () => {
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash)
  const token = params.get('access_token')

  if (!token) {
    toastError(locale.value === 'th' ? 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' : 'Sign-in failed. Please try again.')
    router.replace('/auth/login')
    return
  }

  setToken(token)
  const me = await fetchMe()

  if (!me) {
    toastError(locale.value === 'th' ? 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' : 'Sign-in failed. Please try again.')
    router.replace('/auth/login')
    return
  }

  toastSuccess(locale.value === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Signed in successfully')
  router.replace(me.is_admin ? '/admin' : '/dashboard')
})
</script>
