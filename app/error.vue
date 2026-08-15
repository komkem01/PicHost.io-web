<template>
  <div class="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex flex-col justify-between">
    <!-- Header -->
    <header class="border-b border-zinc-200 bg-white/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-0.5">
          <span class="text-zinc-900 text-xl font-bold tracking-tight">PicHost</span>
          <span class="text-zinc-400 text-xl font-light">.io</span>
        </NuxtLink>
        <div class="flex items-center gap-3">
          <button
            @click="handleError"
            class="text-xs text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer"
          >
            {{ $t('common.back') }}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-6 py-20">
      <div class="w-full max-w-md text-center">
        <!-- Error Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-700 text-xs font-mono font-medium mb-6">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Error {{ statusCode }}
        </div>

        <!-- Headline -->
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3">
          {{ title }}
        </h1>
        <p class="text-zinc-500 text-sm sm:text-base leading-relaxed mb-8">
          {{ message }}
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            @click="handleError"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {{ $t('nav.home') }}
          </button>
          <NuxtLink
            to="/upload"
            class="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            {{ $t('nav.upload') }}
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Minimal Footer -->
    <footer class="py-6 border-t border-zinc-200 text-center text-xs text-zinc-400 bg-white">
      &copy; {{ new Date().getFullYear() }} PicHost.io. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})

const statusCode = computed(() => props.error?.statusCode || 404)
const title = computed(() => {
  if (statusCode.value === 404) return 'Page not found / ไม่พบหน้าที่ต้องการ'
  if (statusCode.value === 403) return 'Access denied / ไม่มีสิทธิ์เข้าถึง'
  return 'Something went wrong / เกิดข้อผิดพลาด'
})
const message = computed(() => {
  if (statusCode.value === 404) return "The page you are looking for doesn't exist or was moved."
  return props.error?.message || 'An unexpected error occurred.'
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
