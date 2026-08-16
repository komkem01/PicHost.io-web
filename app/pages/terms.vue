<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
    <!-- Main Content Container -->
    <main class="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      <!-- Header Badge & Title -->
      <div class="mb-10 text-center sm:text-left">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-700 uppercase tracking-widest mb-4">
          Legal Agreement
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3">
          {{ doc?.title || $t('legal.termsTitle') }}
        </h1>
        <p class="text-zinc-500 text-sm sm:text-base">
          {{ doc?.updated_at ? `Last Updated: ${formatDate(doc.updated_at)}` : 'Last Updated: August 8, 2026' }} &bull; Effective immediately.
        </p>
      </div>

      <!-- Detail Sections -->
      <div v-if="loading" class="text-center py-20 text-zinc-400 text-sm flex flex-col items-center gap-2">
        <svg class="w-6 h-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span>Loading Terms of Service...</span>
      </div>
      <div v-else-if="sections.length > 0" class="space-y-6 text-zinc-700 text-sm leading-relaxed">
        <section
          v-for="(sec, i) in sections"
          :key="i"
          class="rounded-2xl border border-zinc-200 bg-white shadow-card p-6 sm:p-8 space-y-4"
        >
          <h2 v-if="sec.heading" class="text-lg font-bold text-zinc-900 flex items-center gap-2">
            {{ sec.heading }}
          </h2>
          <div class="text-zinc-600 space-y-2 whitespace-pre-line">
            {{ sec.body }}
          </div>
        </section>
      </div>
      <div v-else class="rounded-2xl border border-zinc-200 bg-white shadow-card p-6 sm:p-8 space-y-4 text-zinc-600 whitespace-pre-line">
        {{ doc?.content }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const SITE_URL = 'https://pichost.io'
const { t, locale } = useI18n()

interface LegalDoc {
  key: string
  title: string
  content: string
  updated_at: string
}

const doc = ref<LegalDoc | null>(null)
const loading = ref(true)

const sections = computed(() => {
  if (!doc.value?.content) return []
  const blocks = doc.value.content.split(/\n\n+/)
  return blocks.map(block => {
    const lines = block.trim().split('\n')
    if (lines.length > 1 && (lines[0].match(/^\d+\./) || lines[0].length < 80)) {
      return { heading: lines[0], body: lines.slice(1).join('\n') }
    }
    return { heading: '', body: block }
  })
})

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function fetchDoc() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/public/legal/terms')
    if (res.data) {
      doc.value = res.data
    }
  } catch (e) {
    console.error('Failed to load terms document:', e)
  } finally {
    loading.value = false
  }
}

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

onMounted(() => {
  fetchDoc()
})
</script>

