<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] right-1/3 w-[700px] h-[500px] bg-blue-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-cyan-600/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-12">
      <!-- Title Header -->
      <div class="mb-12 border-b border-white/[0.08] pb-8">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
          Developer REST API
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          {{ $t('docs.title') }}
        </h1>
        <p class="text-white/50 text-sm sm:text-base max-w-2xl leading-relaxed">
          {{ $t('docs.subtitle') }}
        </p>
      </div>

      <!-- Main Body -->
      <div class="space-y-12 text-sm leading-relaxed text-white/80">
        <!-- Section 1: Authentication -->
        <section id="authentication" class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-cyan-400">1.</span> Authentication & Headers
          </h2>
          <p class="text-white/60">
            API endpoints require a valid JWT Access Token passed in the standard HTTP <code class="text-cyan-300 font-mono text-xs bg-white/[0.05] px-1.5 py-0.5 rounded">Authorization</code> header.
          </p>
          <div class="rounded-xl bg-[#111115] border border-white/[0.08] p-4 font-mono text-xs text-white/80 overflow-x-auto">
            Authorization: Bearer YOUR_ACCESS_TOKEN
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const SITE_URL = 'https://pichost.io'
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  },
  link: [{ rel: 'canonical', href: `${SITE_URL}/docs` }],
})

useSeoMeta({
  title: 'API Documentation — PicHost.io REST API',
  description: 'Learn how to upload images programmatically using the PicHost.io REST API.',
})
</script>
