<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppPageLoader :show="pageLoading" />
    <AppToast />
    <AppLogoutModal />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const pageLoading = ref(false)
const router = useRouter()
const { getToken, refreshToken, isTokenExpired } = useAuth()

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

// Refresh token when the user returns to the tab — but only if the token
// is expired or near-expiry. If it's still healthy, the scheduled timer handles it.
onMounted(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && getToken() && isTokenExpired()) {
      refreshToken()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => document.removeEventListener('visibilitychange', handleVisibilityChange))
})
</script>

