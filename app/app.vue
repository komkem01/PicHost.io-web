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
</script>

