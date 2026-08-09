<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute top-[40%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Header Navigation -->
    <header class="border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-blue-500 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-white text-xl font-light">.io</span>
        </NuxtLink>
        <nav class="flex items-center gap-4 text-xs font-medium text-white/60">
          <NuxtLink to="/pricing" class="hover:text-white transition-colors">{{ $t('nav.pricing') }}</NuxtLink>
          <NuxtLink to="/docs" class="hover:text-white transition-colors">{{ $t('nav.docs') }}</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors">{{ $t('nav.privacy') }}</NuxtLink>
          <NuxtLink to="/auth/register" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-1.5 rounded-lg transition-colors ml-2">
            {{ $t('nav.register') }}
          </NuxtLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <!-- Header Badge & Title -->
      <div class="mb-10 text-center sm:text-left">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
          Legal Agreement
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          {{ $t('legal.termsTitle') }}
        </h1>
        <p class="text-white/45 text-sm sm:text-base">
          Last Updated: August 8, 2026 &bull; Effective immediately.
        </p>
      </div>

      <!-- Detail Sections -->
      <div class="space-y-10 text-white/80 text-sm leading-relaxed">
        <section class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="text-blue-400">1.</span> Acceptance of Terms / การยอมรับข้อตกลง
          </h2>
          <p class="text-white/60">
            By accessing or using PicHost.io, you agree to be bound by these Terms of Service.
            การเข้าใช้บริการ PicHost.io ถือว่าท่านได้ยอมรับข้อตกลงและเงื่อนไขการให้บริการนี้แล้ว
          </p>
        </section>

        <section class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="text-blue-400">2.</span> Acceptable Use & Content Policy
          </h2>
          <p class="text-white/60">
            Illegal content, malware, phishing, and copyrighted content violations are strictly prohibited.
            ห้ามใช้อัปโหลดไฟล์ที่ผิดกฎหมาย สื่อลามกอนาจาร ไวรัส/มัลแวร์ หรือไฟล์ละเมิดลิขสิทธิ์
          </p>
        </section>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/[0.08] py-8 text-center text-xs text-white/30">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {{ new Date().getFullYear() }} PicHost.io. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-white/60 hover:text-white">{{ $t('nav.privacy') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-white/60 hover:text-white">{{ $t('nav.contact') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const SITE_URL = 'https://pichost.io'
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/terms` }],
})

useSeoMeta({
  title: 'Terms of Service — PicHost.io',
  description: 'Read the Terms of Service for PicHost.io image hosting platform.',
})
</script>
