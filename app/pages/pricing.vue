<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[140px]"></div>
      <div class="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-cyan-600/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Header Navigation -->
    <header class="border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-blue-500 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-xl font-light">.io</span>
        </NuxtLink>
        <nav class="flex items-center gap-4 text-xs font-medium text-white/60">
          <NuxtLink to="/upload" class="hover:text-white transition-colors">{{ $t('nav.upload') }}</NuxtLink>
          <NuxtLink to="/docs" class="hover:text-white transition-colors">{{ $t('nav.docs') }}</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-white transition-colors">{{ $t('nav.terms') }}</NuxtLink>
          <NuxtLink to="/auth/register" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors ml-1">
            {{ $t('nav.register') }}
          </NuxtLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-16">
      <!-- Title section -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
          {{ $t('pricing.title') }}
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          {{ $t('pricing.subtitle') }}
        </h1>
      </div>

      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        <!-- Free Tier -->
        <div class="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ $t('pricing.free.name') }}</h3>
            </div>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-extrabold text-white">{{ formatCurrency(0, locale) }}</span>
              <span class="text-white/40 text-sm">{{ $t('pricing.monthly') }}</span>
            </div>
            <p class="text-xs text-white/50 mb-6">{{ $t('pricing.free.desc') }}</p>

            <div class="space-y-3 text-xs text-white/70 border-t border-white/[0.06] pt-6 mb-8">
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.storage', { size: '1 GB' }) }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.maxFileSize', { size: '5 MB' }) }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register"
            class="w-full py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white text-center font-semibold text-sm transition-all"
          >
            {{ $t('pricing.free.cta') }}
          </NuxtLink>
        </div>

        <!-- Basic Tier (Popular) -->
        <div class="relative rounded-2xl border-2 border-blue-500/50 bg-blue-500/[0.04] p-8 flex flex-col justify-between backdrop-blur-xl shadow-2xl shadow-blue-500/10">
          <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[11px] font-bold uppercase tracking-wider text-white">
            {{ $t('pricing.basic.badge') }}
          </div>
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ $t('pricing.basic.name') }}</h3>
            </div>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-extrabold text-white">{{ formatCurrency(19, locale) }}</span>
              <span class="text-white/40 text-sm">{{ $t('pricing.monthly') }}</span>
            </div>
            <p class="text-xs text-white/50 mb-6">{{ $t('pricing.basic.desc') }}</p>

            <div class="space-y-3 text-xs text-white/80 border-t border-white/[0.08] pt-6 mb-8">
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.storage', { size: '10 GB' }) }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.maxFileSize', { size: '15 MB' }) }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.noWatermark') }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-center font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all"
          >
            {{ $t('pricing.basic.cta') }}
          </NuxtLink>
        </div>

        <!-- Pro Tier -->
        <div class="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-white">{{ $t('pricing.pro.name') }}</h3>
              <span class="px-2.5 py-1 rounded-md bg-purple-500/20 text-xs text-purple-300 font-medium">{{ $t('pricing.pro.badge') }}</span>
            </div>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-4xl font-extrabold text-white">{{ formatCurrency(190, locale) }}</span>
              <span class="text-white/40 text-sm">{{ $t('pricing.monthly') }}</span>
            </div>
            <p class="text-xs text-white/50 mb-6">{{ $t('pricing.pro.desc') }}</p>

            <div class="space-y-3 text-xs text-white/70 border-t border-white/[0.06] pt-6 mb-8">
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.storage', { size: '100 GB' }) }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.apiAccess') }}</span>
              </div>
              <div class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                <span>{{ $t('pricing.features.prioritySupport') }}</span>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/auth/register"
            class="w-full py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white text-center font-semibold text-sm transition-all"
          >
            {{ $t('pricing.pro.cta') }}
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/[0.08] py-8 text-center text-xs text-white/30">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {{ new Date().getFullYear() }} PicHost.io. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/terms" class="text-white/60 hover:text-white">{{ $t('nav.terms') }}</NuxtLink>
          <NuxtLink to="/privacy" class="text-white/60 hover:text-white">{{ $t('nav.privacy') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-white/60 hover:text-white">{{ $t('nav.contact') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const SITE_URL = 'https://pichost.io'
const { locale, t } = useI18n()

useSeoMeta({
  title: 'Pricing — PicHost.io Image Hosting',
  description: 'Compare PicHost.io free and paid plans. Get up to 100 GB storage, watermark removal, and API access.',
  ogTitle: 'Pricing — PicHost.io Image Hosting',
  ogDescription: 'Compare PicHost.io free and paid plans. Get up to 100 GB storage, watermark removal, and API access.',
  ogImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/pricing` }],
})
</script>
