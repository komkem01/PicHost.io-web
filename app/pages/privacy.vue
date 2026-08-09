<template>
  <div class="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30 selection:text-blue-200">
    <!-- Hero Glows -->
    <div class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] right-1/2 translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/[0.07] rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[120px]"></div>
    </div>

    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <!-- Header Badge & Title -->
      <div class="mb-10 text-center sm:text-left">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">
          Data Protection & PDPA
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          {{ $t('legal.privacyTitle') }}
        </h1>
        <p class="text-white/45 text-sm sm:text-base">
          Last Updated: August 8, 2026 &bull; Compliant with Thailand PDPA.
        </p>
      </div>

      <!-- Detail Sections -->
      <div class="space-y-10 text-white/80 text-sm leading-relaxed">
        <section class="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8 space-y-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="text-emerald-400">1.</span> Information We Collect / ข้อมูลที่เราจัดเก็บ
          </h2>
          <p class="text-white/60">
            We collect account email, username, uploaded image files, and security access logs strictly for operating PicHost.io.
            เราจัดเก็บอีเมล ชื่อผู้ใช้ ภาพที่ถูกอัปโหลด และประวัติบันทึกความปลอดภัยเฉพาะที่จำเป็นสำหรับการให้บริการเท่านั้น
          </p>
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
  link: [{ rel: 'canonical', href: `${SITE_URL}/privacy` }],
})

useSeoMeta({
  title: 'Privacy Policy — PicHost.io',
  description: 'Learn how PicHost.io protects your privacy and personal data.',
})
</script>
