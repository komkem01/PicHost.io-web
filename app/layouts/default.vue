<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans flex flex-col justify-between">
    <!-- Fixed Top Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-blue-500 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-xl font-light">.io</span>
        </NuxtLink>
        <nav class="flex items-center gap-1.5">
          <NuxtLink
            to="/pricing"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            exact-active-class="!text-white !bg-white/[0.06] font-medium"
          >
            {{ $t('nav.pricing') }}
          </NuxtLink>
          <NuxtLink
            to="/docs"
            class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            exact-active-class="!text-white !bg-white/[0.06] font-medium"
          >
            {{ $t('nav.docs') }}
          </NuxtLink>

          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              exact-active-class="!text-white !bg-white/[0.06] font-medium"
            >
              {{ $t('nav.dashboard') }}
            </NuxtLink>
            <NuxtLink
              to="/upload"
              class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              exact-active-class="!text-white !bg-white/[0.06] font-medium"
            >
              {{ $t('nav.upload') }}
            </NuxtLink>
            <NuxtLink
              to="/settings/account"
              class="text-[13px] text-white/60 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
              exact-active-class="!text-white !bg-white/[0.06] font-medium"
            >
              {{ $t('nav.settings') }}
            </NuxtLink>
            <button
              @click="openLogoutModal()"
              class="text-[13px] text-red-400 hover:text-white border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors font-medium ml-1"
            >
              {{ $t('nav.logout') }}
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="text-[13px] text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors ml-1"
            >
              {{ $t('nav.login') }}
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-[13px] bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded-lg transition-colors ml-1"
            >
              {{ $t('nav.register') }}
            </NuxtLink>
          </template>

          <div class="ml-2 pl-2 border-l border-white/10">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>

    <div class="pt-[64px] flex-1">
      <slot />
    </div>

    <!-- Layout Footer -->
    <footer class="border-t border-white/[0.08] bg-[#09090b] py-8 text-center text-xs text-white/30 mt-auto">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {{ new Date().getFullYear() }} PicHost.io. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/pricing" class="text-white/60 hover:text-white">{{ $t('nav.pricing') }}</NuxtLink>
          <NuxtLink to="/docs" class="text-white/60 hover:text-white">{{ $t('nav.docs') }}</NuxtLink>
          <NuxtLink to="/terms" class="text-white/60 hover:text-white">{{ $t('nav.terms') }}</NuxtLink>
          <NuxtLink to="/privacy" class="text-white/60 hover:text-white">{{ $t('nav.privacy') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-white/60 hover:text-white">{{ $t('nav.contact') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { openLogoutModal } = useLogoutModal()
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})
</script>
