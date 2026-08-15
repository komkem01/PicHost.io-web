<template>
  <div class="relative inline-flex items-center">
    <button
      @click="toggleLanguage"
      type="button"
      class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50/80 border border-zinc-200/80 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
      :aria-label="`Switch language to ${locale === 'th' ? 'English' : 'Thai'}`"
    >
      <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
      <span class="uppercase tracking-wider text-[11px] font-bold text-zinc-800">{{ locale === 'th' ? 'TH' : 'EN' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

function toggleLanguage() {
  const nextLocale = locale.value === 'th' ? 'en' : 'th'
  setLocale(nextLocale)
}
</script>
