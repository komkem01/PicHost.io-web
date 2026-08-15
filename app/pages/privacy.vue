<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <!-- Header Badge & Title -->
      <div class="mb-10 text-center sm:text-left">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 uppercase tracking-widest mb-4">
          Data Protection & PDPA
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3">
          {{ $t('legal.privacyTitle') }}
        </h1>
        <p class="text-zinc-500 text-sm sm:text-base">
          Last Updated: August 8, 2026 &bull; Compliant with Thailand PDPA.
        </p>
      </div>

      <!-- Detail Sections -->
      <div class="space-y-6 text-zinc-700 text-sm leading-relaxed">
        <section class="rounded-2xl border border-zinc-200 bg-white shadow-card p-6 sm:p-8 space-y-4">
          <h2 class="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <span class="text-zinc-900 font-bold">1.</span> Information We Collect / ข้อมูลที่เราจัดเก็บ
          </h2>
          <p class="text-zinc-600">
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
