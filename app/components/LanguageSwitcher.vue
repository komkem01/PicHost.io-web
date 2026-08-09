<template>
  <div class="relative inline-flex items-center">
    <button
      @click="toggleLanguage"
      type="button"
      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 rounded-lg transition-all shadow-xs"
      :aria-label="`Switch language to ${locale === 'th' ? 'English' : 'Thai'}`"
    >
      <span class="text-sm leading-none">{{ locale === 'th' ? '🇹🇭' : '🇬🇧' }}</span>
      <span class="uppercase tracking-wider font-semibold text-[11px]">{{ locale }}</span>
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
