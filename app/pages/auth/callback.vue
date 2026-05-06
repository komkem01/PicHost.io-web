<template>
  <div class="min-h-screen bg-[#09090b] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner -->
      <svg
        class="w-8 h-8 text-blue-400 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
      </svg>
      <p class="text-white/40 text-sm">Signing you in…</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { setToken, fetchMe } = useAuth()
const { error: toastError } = useToast()

onMounted(async () => {
  // The access_token is in the URL fragment (#access_token=xxx)
  // The fragment is never sent to servers — it only exists in the browser.
  const hash = window.location.hash.slice(1) // strip leading '#'
  const params = new URLSearchParams(hash)
  const token = params.get('access_token')

  if (!token) {
    toastError('Sign-in failed. Please try again.')
    router.replace('/auth/login')
    return
  }

  setToken(token)
  const me = await fetchMe()

  if (!me) {
    toastError('Sign-in failed. Please try again.')
    router.replace('/auth/login')
    return
  }

  router.replace(me.is_admin ? '/admin' : '/dashboard')
})
</script>
