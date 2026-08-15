<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col justify-between">
    <!-- Fixed Top Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/favicon.svg" class="w-6 h-6 rounded-md shadow-2xs border border-zinc-200/80" alt="PicHost logo" />
          <div class="flex items-center gap-0.5">
            <span class="text-zinc-900 text-xl font-bold tracking-tight">PicHost</span>
            <span class="text-zinc-400 text-xl font-light">.io</span>
          </div>
        </NuxtLink>
        <nav class="flex items-center gap-1.5">
          <NuxtLink
            to="/#features"
            class="text-[13px] text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            {{ $t('nav.features') }}
          </NuxtLink>
          <NuxtLink
            to="/pricing"
            class="text-[13px] text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            exact-active-class="!text-zinc-900 !bg-zinc-100 font-medium"
          >
            {{ $t('nav.pricing') }}
          </NuxtLink>

          <template v-if="user">
            <NuxtLink
              to="/dashboard"
              class="text-[13px] text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              exact-active-class="!text-zinc-900 !bg-zinc-100 font-medium"
            >
              {{ $t('nav.dashboard') }}
            </NuxtLink>
            <NuxtLink
              to="/upload"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[13px] font-bold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-xs hover:shadow-md cursor-pointer group"
            >
              <svg class="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-colors shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              <span>{{ $t('nav.upload') }}</span>
            </NuxtLink>
            <NuxtLink
              to="/settings/account"
              class="text-[13px] text-zinc-500 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              exact-active-class="!text-zinc-900 !bg-zinc-100 font-medium"
            >
              {{ $t('nav.settings') }}
            </NuxtLink>
            <button
              @click="openLogoutModal()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 border border-red-200/80 transition-all shadow-2xs hover:shadow-xs cursor-pointer ml-1 group"
            >
              <svg class="w-3.5 h-3.5 text-red-500 group-hover:text-red-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>{{ $t('nav.logout') }}</span>
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="text-[13px] text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors ml-1"
            >
              {{ $t('nav.login') }}
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="text-[13px] bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-3.5 py-1.5 rounded-xl transition-colors ml-1 shadow-sm"
            >
              {{ $t('nav.register') }}
            </NuxtLink>
          </template>

          <div class="ml-2 pl-2 border-l border-zinc-200">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>

    <div class="pt-[64px] flex-1">
      <EmailVerificationBanner />
      <slot />
    </div>

    <!-- Layout Footer -->
    <footer class="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-400 mt-auto">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {{ new Date().getFullYear() }} PicHost.io. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/pricing" class="text-zinc-500 hover:text-zinc-900 transition-colors">{{ $t('nav.pricing') }}</NuxtLink>
          <NuxtLink to="/terms" class="text-zinc-500 hover:text-zinc-900 transition-colors">{{ $t('nav.terms') }}</NuxtLink>
          <NuxtLink to="/privacy" class="text-zinc-500 hover:text-zinc-900 transition-colors">{{ $t('nav.privacy') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-zinc-500 hover:text-zinc-900 transition-colors">{{ $t('nav.contact') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { open: openLogoutModal } = useLogoutModal()
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})
</script>
