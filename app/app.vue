<template>
  <div class="dark">
    <NuxtRouteAnnouncer />
    <AppPageLoader :show="pageLoading" />
    <AppToast />
    <AppLogoutModal />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const pageLoading = ref(false)
const router = useRouter()
const { getToken, refreshToken } = useAuth()

let delayTimer: ReturnType<typeof setTimeout>

router.beforeEach(() => {
  delayTimer = setTimeout(() => {
    pageLoading.value = true
  }, 80)
})

router.afterEach(() => {
  clearTimeout(delayTimer)
  nextTick(() => {
    pageLoading.value = false
  })
})

// Refresh token when the user returns to the tab (e.g. after a long absence)
onMounted(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && getToken()) {
      refreshToken()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => document.removeEventListener('visibilitychange', handleVisibilityChange))
})
</script>

